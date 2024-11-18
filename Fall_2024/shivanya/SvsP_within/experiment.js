const files = {
  instructions: "materials/instructions.json",
  stimuli: "materials/stimuli.json",
};

window.onbeforeunload = function () {
  return true;
}

// Date and Time
var utc_date = new Date();
var date = utc_date.toLocaleString();

// Record Sona Number
var subNum = jsPsych.data.getURLVariable("workerId");
var compNum = jsPsych.data.getURLVariable("compNum");
var version = jsPsych.data.getURLVariable("version");

class Experiment {
  constructor() {
    this.timeline = [];

    this.loadMaterials();
  }

  loadMaterials() {
    const self = this;
    $.when(
      ...Object.keys(files).map((fileKey) =>
        $.getJSON(files[fileKey], (data) => {
          console.log("loading", fileKey);
          this[fileKey] = data;
        })
      )
    ).then(() => {
      self.buildTimeline();
      self.run();
    });
  }

  buildTimeline() {
    const instructionTrial = {
      type: "pcllab-core",
      stimuli: [this.instructions["welcome"]],
      show_button: true,
      button_text: "Next",
      response_count: 0,
      //minimum_time: 7000,
      response_count: 0,
      data: { phase: "instructions" },
    };

    this.timeline.push(instructionTrial);
    this.practiceList = jsPsych.randomization.shuffleNoRepeats(this.stimuli["Practice"]);
  }


  run() {
    jsPsych.init({
      display_element: $("div#experiment_container"),
      timeline: this.timeline,
      fullscreen: true,
      on_finish: () => {
        jsPsych.data.addProperties({
          subject: subNum,
          computer: compNum,
          version: version,
          timestamp: new Date().toUTCString(),

        });

        jsPsych.data.localSave('Pretesting_Asymmetric_Demo' + "_" + jsPsych.data.getURLVariable("workerId") + "_" + jsPsych.data.getURLVariable("version") + '.csv', 'csv')


        let myData = experimentData // Data for the experiment
        $.ajax('https://jarvis.psych.purdue.edu/api/v1/experiments/data/6739b320201d92b32f491134', {
          data: JSON.stringify(myData),
          contentType: 'application/json',
          type: 'POST'
        })
      },
    });
  }
}
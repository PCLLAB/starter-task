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
    //this is with Vb stimuli 
    this.timeline.push(instructionTrial);
    this.practiceList = jsPsych.randomization.shuffleNoRepeats(this.stimuli["Vb"]);

    for (let ex of this.practiceList) {
      let task = {
        type: "pcllab-core",
        stimuli: [
          { text: `<div style="text-align: center; font-size: 24px">${ex.cue}</div>` }
        ],
        response_type: "input",
        response_count: 1,
        data: { phase: "practiceTest", cue: ex.cue }
      };

      let anotherTask = {
        type: "pcllab-core",
        stimuli: [
          { text: `<div style="text-align: center; font-size: 24px">${ex.cue} -- ${ex.target}</div>` }
        ],
        response_count: 0,
        maximum_time: 5000,
        data: { phase: "practicePair", cue: ex.cue, target: ex.target },
      }
      this.timeline.push(task);
      this.timeline.push(anotherTask);
    }
    // Math Distractor (Addition problems)
    const mathStimuli = [];
    const correctAnswers = [];
    for (let i = 0; i < 15; i++) {
      const num1 = Math.floor(Math.random() * 9 + 1);
      const num2 = Math.floor(Math.random() * 9 + 1);
      const num3 = Math.floor(Math.random() * 9 + 1);

      correctAnswers.push(num1 + num2 + num3);
      const equation = `${num1} + ${num2} + ${num3}`;

      mathStimuli.push({
        text: `<div style="text-align: center; font-size: 24px">${equation}</div>`,
      });
    }

    const mathDistractor = {
      type: "pcllab-core",
      stimuli: mathStimuli,
      total_maximum_time: 1000 * 120,
      response_type: "input",
      response_count: 1,
      show_button: true,
      button_text: "Next",
      data: { phase: "distractor", correctAnswers: correctAnswers },
    };
    this.timeline.push(mathDistractor);

    // Final Test
    for (let ex of this.practiceList) {
      let cuedRecallTask = {
        type: "pcllab-core",
        stimuli: [{ text: `<div style="text-align: center; font-size: 24px">${ex.cue}</div>` }],
        response_type: "input",
        response_count: 1,
        maximum_time: 7000,
        data: { phase: "finalTest", cue: ex.cue },
      };
      this.timeline.push(cuedRecallTask);
    }

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
//Object that holds all the instructions and stimuli data for JSON files
const files = {
  instructions: "materials/instructions.json",
  stimuli: "materials/stimuli.json",
};

// Prevent user from accidentally refreshing if user leaves or refreshes mid-experiment
window.onbeforeunload = function () {
  return true;
}

// Date and Time
var utc_date = new Date();             
var date = utc_date.toLocaleString();  

class Experiment {
  constructor() {
    //sequence of experiment tasks
    this.timeline = [];
    //loads an extern files
    this.loadMaterials();
  }

  // Load Instructions and Stimuli
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
    // Instructions
    const instructions = {
      type: "pcllab-core",
      stimuli: [this.instructions["welcome"]],
      show_button: true,
      button_text: "Next",
      response_count: 0,
      data: { phase: "instructions" },
    };
    this.timeline.push(instructions);

    // Encoding Task with "Practice" stimuli
    this.practiceList = jsPsych.randomization.shuffleNoRepeats(this.stimuli["Practice"]);

    for (let experiment of this.practiceList) {
      let testBoxTask = {
        type: "pcllab-core",
        stimuli: [
          { text: `<div style="text-align: center; font-size: 24px">${experiment.cue}</div>` }
        ],
        response_type: "input",
        response_count: 1,
        data: { phase: "practiceTest", cue: experiment.cue },
      };

      let pairTask = {
        type: "pcllab-core",
        stimuli: [
          { text: `<div style="text-align: center; font-size: 24px">${experiment.cue} -- ${experiment.target}</div>` }
        ],
        response_count: 0,
        maximum_time: 5000,
        data: { phase: "practicePair", cue: experiment.cue, target: experiment.target },
      };

      this.timeline.push(testBoxTask);
      this.timeline.push(pairTask);
    }

    // Math Distractor (Addition problems)
    const mathStimuli = [];
    const correctAnswers = [];
    for (let i = 0; i < 15; i++) {
      const num1 = Math.floor(Math.random() * 9 + 1);
      const num2 = Math.floor(Math.random() * 9 + 1);
      const num3 = Math.floor(Math.random() * 9 + s1);

      correctAnswers.push(num1 + num2 + num3);
      const equation = `${num1} + ${num2} + ${num3}`;

      mathStimuli.push({
        text: `<div style="text-align: center; font-size: 24px">${equation}</div>`,
      });
    }

    const mathDistractor = {
      type: "pcllab-core",
      stimuli: mathStimuli,
      response_type: "input",
      response_count: 1,
      show_button: true,
      button_text: "Next",
      data: { phase: "distractor", correctAnswers: correctAnswers },
    };
    this.timeline.push(mathDistractor);

    // Final Test
    for (let experiment of this.practiceList) {
      let cuedRecallTask = {
        type: "pcllab-core",
        stimuli: [{ text: `<div style="text-align: center; font-size: 24px">${experiment.cue}</div>` }],
        response_type: "input",
        response_count: 1,
        maximum_time: 7000,
        data: { phase: "finalTest", cue: experiment.cue },
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

        jsPsych.data.localSave('Pretesting_Asymmetric_Demo' + "_" + jsPsych.data.getURLVariable("workerId") + "_" + jsPsych.data.getURLVariable("version") +'.csv', 'csv')

        let myData = jsPsych.data.dataAsJSON(); // Data for the experiment
        $.ajax(
          "https://jarvis.psych.purdue.edu/api/v1/experiments/data/672904857e0ef9067032093b",
          {
            data: myData,
            contentType: "application/json",
            type: "POST",
          }
        );
      },
    });
}
}

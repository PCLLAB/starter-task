/*
 * Pretesting effect (study vs. pretest) with asymetrics pairs (backward associated only)
 * E1
 *
 * Michelle
 */

const files = {
  instructions: "materials/instructions.json",
  stimuli: "materials/stimuli.json",
};

// Prevent user from accidentally refreshing
window.onbeforeunload = function () {
  return true
}

// Record Sona Number
var subNum = jsPsych.data.getURLVariable("workerId");
var compNum = jsPsych.data.getURLVariable("compNum");
var version = jsPsych.data.getURLVariable("version");

// Date and Time
var utc_date = new Date();             // Gets GMT time
var date = utc_date.toLocaleString();  // Converts GMT to EST


class Experiment {
  constructor() {
    this.timeline = [];

    const $form = $('#subject-form');
    console.log($form);

    this.loadMaterials();
  }


  // Load Instructions
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

    // Welcome
    const instructionsWelcome = {
      type: "pcllab-core",
      stimuli: [this.instructions["welcome"]],
      show_button: true,
      button_text: "Next",
      response_count: 0,
      data: {
        phase: "instructionsWelcome",
      },
    };
    // this.timeline.push(instructionsWelcome);

    // Instructions Start
    const instructionsStart = {
      type: "pcllab-core",
      stimuli: [this.instructions["start"]],
      show_button: true,
      button_text: "Next",
      response_count: 0,
      minimum_time: 1000,
      data: {
        phase: "instructions",
      },
    };
    // this.timeline.push(instructionsStart);

    const instructionsEncoding = {
      type: "pcllab-core",
      stimuli: [this.instructions["encodingInstuctions"]],
      show_button: true,
      button_text: "Next",
      response_count: 0,
      minimum_time: 5000,
      data: {
        phase: "instructions",
      },
    };
    // this.timeline.push(instructionsEncoding);


    const instructionsDistractor = {
      type: "pcllab-core",
      stimuli: [this.instructions["distractorInstructions"]],
      show_button: true,
      button_text: "Next",
      response_count: 0,
      minimum_time: 3000,
      data: {
        phase: "instructions",
      },
    };

    const instructionsTest = {
      type: "pcllab-core",
      stimuli: [this.instructions["test"]],
      show_button: true,
      button_text: "Next",
      response_count: 0,
      minimum_time: 5000,
      data: {
        phase: "instructions",
      },
    };

    // Unfamiliar Words
    const unfamiliar = {
      type: "pcllab-core",
      stimuli: [
        {
          text: '<div style="text-align: center; font-weight: 400; font-size: 24px">Were any of the words from the pairs you studied (during the first part of the experiment) unfamiliar to you?</div>',
          response_type: "button",
          buttons: ["Yes", "No"]
        }
      ],
      response_columns: 2,
      show_button: true,
      data: {
        phase: "unfamiliar",
      }
    };

    const unfamiliarWords = {
      type: "pcllab-core",
      stimuli: [
        {
          text: '<div style="text-align: center; font-weight: 400; font-size: 24px">If you answered yes, please type any of the words that were unfamiliar that you can remember into this textbox. If you said no, or you do not remember which words were unfamiliar, click "Next" to continue.</div>',
          response_type: "input",
        }
      ],
      show_button: true,
      data: {
        phase: "unfamiliar",
      },
    };
    //this.timeline.push(unfamiliarWords);

    // Debrief
    const instructionsDemographics = {
      type: "pcllab-core",
      stimuli: [this.instructions["demographics"]],
      response_count: 0,
      show_button: true,
      button_text: "Next",
      minimum_time: 5000,
      data: {
        phase: "intructionsDeographics",
      },
    };
    //this.timeline.push(demographics);

    // Demographics
    const demographics = {
      type: "pcllab-form",
      demographics: true,
      data: {
        phase: "demographics",
      },
    };
    //this.timeline.push(demographics);

    // Instructions End
    const instructionsEnd = {
      type: "pcllab-core",
      stimuli: [this.instructions["end"]],
      show_button: true,
      button_text: "Continue",
      response_count: 0,
      minimum_time: 5000,
      data: {
        phase: "intructionsEnd",
      },
    };
    //this.timeline.push(instructionsEnd);

    // Debrief
    const debrief = {
      type: "pcllab-core",
      stimuli: [this.instructions["debrief"]],
      response_count: 0,
      show_button: true,
      minimum_time: 10000,
      button_text: "End",
      data: {
        phase: "debrief",
      },
    };
    //this.timeline.push(debrief);

    const endExperiment = {
      type: "pcllab-core",
      stimuli: [
        {
          response_type: "keyboard",
          text: `<div style="text-align: center; font-weight: 400; font-size: 24px">Thank you for your participation! <br> Please remain seated and quiet until everyone else is finished.</div>`,
        }
      ],
      response_count: 0,
      show_button: false,
      maximum_time: 1000 * 1200,
      data: {
        phase: "debrief",
      },
    };
    //this.timeline.push(endExperiment);

    // Timeline Start
    this.timeline.push(instructionsWelcome);
    this.timeline.push(instructionsStart);
    this.timeline.push(instructionsEncoding);


    //Encoding Task

    //Assign stimuli by condition
    if (version === "A") {
      this.studyList = jsPsych.randomization.shuffleNoRepeats(this.stimuli["Va"]);
    } else if (version === "B") {
      this.studyList = jsPsych.randomization.shuffleNoRepeats(this.stimuli["Vb"]);
    };

    for (var experiment of this.studyList) {
      let studyTask = {
        type: "pcllab-core",
        title: "   ",
        stimuli: [
          {
            text: `<div style="text-align: center; font-weight: 400; font-size: 24px">${experiment.cue} -- ${experiment.target}</div>`,
          },
        ],
        response_count: 0,
        isi_time: 500,
        cue_count: 0,
        maximum_time: 1000 * 5,
        data: {
          phase: "study",
          cue: experiment.cue,
          target: experiment.target,
          encodingTask: experiment.condition,
        },
      };

      let pretestTask = {
        type: "pcllab-core",
        title: "   ",
        stimuli: [{ cue: experiment.cue }],
        isi_time: 500,
        cue_count: 1,
        maximum_time: 1000 * 7,
        data: {
          phase: "pretest",
          cue: experiment.cue,
          target: experiment.target,
          encodingTask: experiment.condition,
        }
      };

      if (experiment.condition === "study") {
        this.timeline.push(studyTask);
      }
      else if (experiment.condition === "pretest") {
        this.timeline.push(pretestTask);
        this.timeline.push(studyTask);
      };

    }

    //Math Distractor
    this.timeline.push(instructionsDistractor);

    const stimuli = [];
    const correct_answer = [];
    for (let z = 0; z < 60; z++) {
      const num1 = Math.floor(Math.random() * 9 + 1);
      const num2 = Math.floor(Math.random() * 9 + 1);
      const num3 = Math.floor(Math.random() * 9 + 1);

      correct_answer.push(num1 + num2 + num3);

      const equation = `${num1} + ${num2} + ${num3}`;
      stimuli.push({
        text: `<div class="row m-0 p-0 mb-4 w-75 mt-5" style="height: 100px; margin-left: auto !important; margin-right: auto !important;">
                        <div class="d-flex justify-content-between col">
                        <span style="margin: auto; font-weight: 400; font-size: 24px">${equation}</span>
                        </div>
                    </div>`,
      });
    }

    const distractor = {
      type: "pcllab-core",
      stimuli: stimuli,
      response_count: 1,
      isi_time: 500,
      cue_count: 0,
      total_maximum_time: 1000 * 120,
      show_button: true,
      button_text: "Next",
      data: {
        phase: "distractor",
        correct_answer: correct_answer,
      },
    };

    this.timeline.push(distractor);

    //Cued Recall Test
    this.timeline.push(instructionsTest);

    if (version === "A") {
      this.testList = jsPsych.randomization.shuffleNoRepeats(this.stimuli["Va"]);
    } else if (version === "B") {
      this.testList = jsPsych.randomization.shuffleNoRepeats(this.stimuli["Vb"]);
    };

    for (var experiment of this.testList) {
      let cuedTest = {
        type: "pcllab-core",
        title: "   ",
        stimuli: [{ cue: experiment.cue }],
        isi_time: 500,
        cue_count: 1,
        maximum_time: 1000 * 7,
        data: {
          phase: "finalTest",
          cue: experiment.cue,
          target: experiment.target,
          encodingingTask: experiment.condition,
        }
      };

      if (experiment.condition === "study") {
        this.timeline.push(cuedTest);
      }
      else if (experiment.condition === "pretest") {
        this.timeline.push(cuedTest);
      }
    }

    this.timeline.push(unfamiliar);
    this.timeline.push(unfamiliarWords);
    this.timeline.push(instructionsDemographics);
    this.timeline.push(demographics);
    this.timeline.push(instructionsEnd);
    this.timeline.push(debrief);
    this.timeline.push(endExperiment);
  };

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


        const myData = experimentData // Data for the experiment
        $.ajax('https://jarvis.psych.purdue.edu/api/v1/experiments/data/6739b320201d92b32f491134', {
          data: JSON.stringify(myData),
          contentType: 'application/json',
          type: 'POST'
        })
      },
    });
  }
};

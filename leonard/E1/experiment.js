/*
 * LoP Effect
 * E1
 *
 * Jiaan Shang
 */

const files = {
  instructions: "Materials/instructions.json",
  Order1: "Materials/Practice.json",
};

// Prevent user from accidentally refreshing
window.onbeforeunload = function () {
  return true;
};

// Record Sona Number
var subNum = jsPsych.data.getURLVariable("workerId");
var order = jsPsych.data.getURLVariable("Version");
var order_index=order-1;
var condition = this.condition;
DOWNLOAD_CSV = true // Enable to download experiment CSV
EXPERIMENT_NAME = "LOP-Effect-E1"

// Date and Time
var utc_date = new Date(); // Gets GMT time
var date = utc_date.toLocaleString(); // Converts GMT to EST

class Experiment {
  constructor() {
    this.condition = jsPsych.data.urlVariables().condition;
    if (this.condition) {
      this.condition = this.condition.toLowerCase();
    }
    this.studyList = null;
    this.timeline = [];

    /* Determine which condition to use */
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
    if (!this.condition) {
      var conditions = [
        "CONDITION_1",
        "CONDITION_2",
      ];
      
      //this.condition = conditions[Math.floor(condRand * conditions.length)];
      this.condition = conditions[order_index];
      console.log(this.condition);
      if (this.condition == "CONDITION_1") {
        this.studyList = jsPsych.randomization.shuffleNoRepeats(this.Order1);
      } 
      // else if (this.condition == "CONDITION_2") {
      //   console.log("condition2");
      //   this.studyList = jsPsych.randomization.shuffleNoRepeats(this.Order2);
      // }
      //else if (this.condition == "CONDITION_3") {
        //this.studyList = jsPsych.randomization.shuffleNoRepeats(this.Order3);
      //} else if (this.condition == "CONDITION_4") {
        //this.studyList = jsPsych.randomization.shuffleNoRepeats(this.Order4);
      //}


      // jsPsych.pluginAPI.preloadImages(
      //   this.studyList.map((item) => item.Picture_Source)
      // );
    }
    //Save Data
    var saveData = {
      type: "pcllab-save-to-jarvis",
      experiment_id: "646a593b1336ab51b107454b",
    };
    this.timeline.push(saveData);


    const instructionsStart = {
      type: "pcllab-core",
      stimuli: [this.instructions["start"]],
      show_button: true,
      button_text: "Continue",
      response_count: 0,
      minimum_time: 7000,
    };
    this.timeline.push(instructionsStart);
    //console.log("instruction test");


    //Study Phase Instructions
    const instructionsStudy = {
      type: "pcllab-core",
      stimuli: [this.instructions["study1"]],
      show_button: true,
      button_text: "Continue",
      response_count: 0,
      minimum_time: 7000,
    };
    this.timeline.push(instructionsStudy);

    const instructionsStudy2 = {
      type: "pcllab-core",
      stimuli: [this.instructions["study2"]],
      show_button: true,
      button_text: "Continue",
      response_count: 0,
      minimum_time: 7000,
    };
    this.timeline.push(instructionsStudy2);

    // Study Block
    //"yes/no" is a button that requires response and document response time
    //should "data" include response and correct response
    for (let i = 0; i < this.studyList.length; i++) {
      //Present the orienting question
      console.log("Study list");
      console.log(this.studyList[i].Questions);
      console.log(this.studyList[i].PictureName);
      var inputorder=i+1;
      let studyBlockQuestion = {
        type: "pcllab-core",
        stimuli: [
          {
            text: `<div class="row m-0 p-0 mb-4 w-100" style="height: 100px;">
                      <div class="col h-100 d-flex text-center">
                          <span style="margin: auto; font-weight: 400; font-size: 24px">${this.studyList[i].Questions}</span>
                      </div>
                    </div>`,
          },
        ],
        response_count: 0,
        isi_time: 1000,
        minimum_time: 1000,
        maximum_time: 2000,
        on_stimulus_end: () => {
          const img = new Image()
          img.src = this.studyList[i].Picture_Source
        },
        data: {
          Questions: this.studyList[i].Questions,
        },
      };
      this.timeline.push(studyBlockQuestion);
      //present the picture and ask for a response
      var stimuli_button=[];
      // if(this.studyList[i].Questions=="Is this unicolored or multicolored?"){
      //   stimuli_button=["Unicolored", "Multicolored"]
      // } else if (this.studyList[i].Questions=="Is this animate or inanimate?"){
      //   stimuli_button=["Animate", "Inanimate"]
      // }else if (this.studyList[i].Questions=="Is this rounded or angular?"){
      //   stimuli_button=["Rounded", "Angular"]
      // }else if (this.studyList[i].Questions=="Is this edible or inedible?"){
      //   stimuli_button=["Edible", "Inedible"]
      // }else if (this.studyList[i].Questions=="Is this symmetrical or asymmetrical?"){
      //   stimuli_button=["Symmetrical", "Asymmetrical"]
      // }else if (this.studyList[i].Questions=="Is this natural or manmade?"){
      //   stimuli_button=["Natural", "Manmade"]
      // }else if (this.studyList[i].Questions=="Is this horizontal or vertical?"){
      //   stimuli_button=["Horizontal", "Vertical"]
      // }else if (this.studyList[i].Questions=="Is this indoors or outdoors?"){
      //   stimuli_button=["Indoors", "Outdoors"]
      // }
      stimuli_button=["Yes", "No"];
      
      let studyBlockPicture = {
        type: "pcllab-core",
        stimuli: [
          {
            text: `
            <div class="row text-center mb-2">
              <div class="col text-center">
                <img src="${this.studyList[i].Picture_Source}" width="500px" style="display: block; margin: auto; margin-bottom: 16px">
                <span style="margin: auto; font-weight: 400; font-size: 24px">${this.studyList[i].Questions}</span>
              </div>
            </div>`,
            response_type: "button",
            buttons: stimuli_button,
          },
        ],
        response_columns: 2,
        forced_response: true,
        show_button: true,
        data: {
          Picture: this.studyList[i].PictureName,
          Correct_Answer: this.studyList[i].Correct_Answer,
          Phase: "Study_Picture",
          inputOrder: inputorder,
        },
      };
      this.timeline.push(studyBlockPicture);
    }

    const instructionsLookup1 = {
      type: "pcllab-core",
      stimuli: [this.instructions["studylookup"]],
      show_button: true,
      button_text: "Continue",
      response_count: 0,
      minimum_time: 7000,
    };
    this.timeline.push(instructionsLookup1);

    //Distractor Task
    // var pacmanInstructions = {
    //   type: "pcllab-core",
    //   stimuli: [this.instructions["pacman"]],
    //   show_button: true,
    //   response_count: 0,
    //   minimum_time: 1000,
    //   show_progress: false,
    //   button_text: "Continue",
    // };
    // this.timeline.push(pacmanInstructions);

    // var pacman = {
    //   type: "pcllab-distractor-game",
    //   time: 5 * 60 * 1000,
    //   //time: 1000,
    //   url: "plugins/pcllab-distractor-game/example/game/game.html",
    //   iframe: true,
    //   sound_disabled: false,
    //   show_progress: true,
    //   //debug: DEBUG_MODE,
    // };
    // this.timeline.push(pacman);

    // const instructionsLookup2 = {
    //   type: "pcllab-core",
    //   stimuli: [this.instructions["pacmanlookup"]],
    //   show_button: true,
    //   button_text: "Continue",
    //   response_count: 0,
    //   minimum_time: 7000,
    // };
    // this.timeline.push(instructionsLookup2);

    //Test Block
    // const instructionsTest = {
    //   type: "pcllab-core",
    //   stimuli: [this.instructions["test"]],
    //   show_button: true,
    //   button_text: "Begin",
    //   response_count: 0,
    //   minimum_time: 7000,
    // };
    // this.timeline.push(instructionsTest);
    // var stimuliString = ``;
    // if (this.condition == "CONDITION_1") {
    //   let testBlock = {
    //     type: "pcllab-free-recall-list",
    //     instructions: "",
    //     minimum_time: 300000,
    //     maximum_time: 300000,
    //     show_progress: true,
    //     show_instructions: true,
    //     word_file: "Materials/Order1.json",
    //     scroll_list: true,
    //     allow_delete: false,
    //     exact_response: true,
    //     show_timer: false,
    //     data: {
    //       Phase: "Free Recall",
    //     },
    //     title: "",
    //   };
    //   this.timeline.push(testBlock);
    // } 
    // else if (this.condition == "CONDITION_2") {
    //   let testBlock = {
    //     type: "pcllab-free-recall-list",
    //     instructions: "",
    //     minimum_time: 300000,
    //     maximum_time: 300000,
    //     show_progress: true,
    //     show_instructions: true,
    //     word_file: "Materials/Order2.json",
    //     scroll_list: true,
    //     allow_delete: false,
    //     exact_response: true,
    //     show_timer: false,
    //     data: {
    //       Phase: "Free Recall",
    //     },
    //     title: "",
    //   };
    //   this.timeline.push(testBlock);
    // } 
    /*else if (this.condition == "CONDITION_3") {
      let testBlock = {
        type: "pcllab-free-recall-list",
        instructions: "",
        minimum_time: 300000,
        maximum_time: 300000,
        show_progress: true,
        show_instructions: true,
        word_file: "Materials/Order3.json",
        scroll_list: true,
        allow_delete: false,
        exact_response: true,
        show_timer: false,
        data: {
          Phase: "Free Recall",
        },
        title: "",
      };
      this.timeline.push(testBlock);
    } else {
      let testBlock = {
        type: "pcllab-free-recall-list",
        instructions: "",
        minimum_time: 300000,
        maximum_time: 300000,
        show_progress: true,
        show_instructions: true,
        word_file: "Materials/Order4.json",
        scroll_list: true,
        allow_delete: false,
        exact_response: true,
        show_timer: false,
        data: {
          Phase: "Free Recall",
        },
        title: "",
      };
      this.timeline.push(testBlock);
    }*/

    const instructionsDemographics = {
      type: "pcllab-core",
      stimuli: [this.instructions["demographics"]],
      response_count: 0,
      show_button: true,
      button_text: "Next",
      minimum_time: 5000,
    };
    this.timeline.push(instructionsDemographics);

    // Demographics
    const demographics = {
      type: "pcllab-form",
      demographics: true,
      data: {
        period: "demographics",
      },
    };
    this.timeline.push(demographics);

    const instructionsEnd = {
      type: "pcllab-core",
      stimuli: [this.instructions["end"]],
      show_button: true,
      button_text: "Continue",
      response_count: 0,
      minimum_time: 5000,
    };
    this.timeline.push(instructionsEnd);
    //this.timeline.push(saveData);

    // Debrief
    const debrief = {
      type: "pcllab-core",
      stimuli: [this.instructions["debrief"]],
      response_count: 0,
      show_button: true,
      button_text: "End",
      minimum_time: 180000,
    };
    this.timeline.push(debrief);
  }

  run() {
    jsPsych.init({
      display_element: $("div#experiment_container"),
      timeline: this.timeline,
      fullscreen: true,
      on_finish: () => {
        $("#jspsych-content").css("text-align", "center");
        $("#jspsych-content").html(`
        <h2>Thank you for your participation!</h2><br>
        <h4>Please remain seated and quiet until everyone else is finished</h4><br>
        `);

        jsPsych.data.addProperties({
          subject: subNum,
          order: order,
          condition: this.condition,
          timestamp: new Date().toUTCString(),
        });

        //jsPsych.data.displayData();
        //onfinish data.correct
        let myData = jsPsych.data.dataAsJSON(); // Data for the experiment
        $.ajax(
          "https://jarvis.psych.purdue.edu/api/v1/experiments/data/646a593b1336ab51b107454b",
          {
            data: myData,
            contentType: "application/json",
            type: "POST",
          }
        );
        if(DOWNLOAD_CSV) {
          jsPsych.data.localSave(`${EXPERIMENT_NAME}-${subNum}-${this.condition}.csv`, 'csv')
      }
      },
    });
  }
}

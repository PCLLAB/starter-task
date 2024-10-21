/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


 jsPsych.plugins['cued-recall'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // create a div and show preamble text
    display_element.append($('<div>', {
      "id": 'jspsych-cued-recall-header',
      "class": 'jspsych-cued-recall-preamble'
    }));
    $('#jspsych-cued-recall-header').html(trial.preamble); 
    
      // create div
      display_element.append($('<div>', {
        "id": 'jspsych-cued-recall',
        "class": 'jspsych-cued-recall-question'
      }));

      // add question text
      $("#jspsych-cued-recall").append('<center><p class="jspsych-cued-recall-question">' + trial.questions + '</p></center>');

      // add text box
      $("#jspsych-cued-recall").append('<center><textarea id="jspsych-cued-recall-input" cols="20" rows="1" onkeypress="return restrictCharacters(this, event, alphaOnly)"></textarea></center>');
      // $("#jspsych-cued-recall").append('<p class="jspsych-cued-recall" id="cued-recall-feedback">' + trial.questions[i] + ' - ' + trial.targets[i] + '</p>');
      // $("#cued-recall-feedback").hide();
    

    $("#jspsych-cued-recall-input").focus();
    $("#jspsych-cued-recall-input").keypress(function(event){
      if(event.keyCode == 13){

        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;

        // create object to hold responses
        var question_data = {};       
        var question_data = document.getElementById('jspsych-cued-recall-input').value;
        console.log( question_data)
        
        
        var trialdata = {
          "rt": response_time,
          "word": JSON.stringify(question_data),
          "stimulus": JSON.stringify(trial.questions),
          "target": JSON.stringify(trial.targets)
        };

        display_element.html('');
          // next trial
        jsPsych.finishTrial(trialdata);
      }

    });
    var startTime = (new Date()).getTime();
  };

  return plugin;
})();

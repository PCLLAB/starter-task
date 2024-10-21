/**
 * jspsych-cued-recall
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

(function($) {
  jsPsych['cued-recall-feedback'] = (function() {

    var plugin = {};

    plugin.create = function(params) {

      //params = jsPsych.pluginAPI.enforceArray(params, ['data']);

      var trials = [];
      for (var i = 0; i < params.questions.length; i++) {
        var rows = [], cols = [];
        if(typeof params.rows == 'undefined' || typeof params.columns == 'undefined'){
          for(var j = 0; j < params.questions[i].length; j++){
            cols.push(40);
            rows.push(1);
          }
        }

        trials.push({
          preamble: typeof params.preamble == 'undefined' ? "" : params.preamble,
          questions: params.questions[i],
          targets: params.targets[i],
          rows: typeof params.rows == 'undefined' ? rows : params.rows[i],
          columns: typeof params.columns == 'undefined' ? cols : params.columns[i],
          feedbackTime: params.feedbackTime || 0 // if 0 have no delay
        });
      }
      return trials;
    };

    plugin.trial = function(display_element, trial) {


      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

      // show preamble text
      display_element.append($('<div>', {
        "id": 'jspsych-cued-recall-preamble',
        "class": 'jspsych-cued-recall-preamble'
      }));

      $('#jspsych-cued-recall-preamble').html(trial.preamble);


      // add questions
      for (var i = 0; i < trial.questions.length; i++) {
        // create div
        display_element.append($('<div>', {
          "id": 'jspsych-cued-recall-' + i,
          "class": 'jspsych-cued-recall-question'
        }));

        // add the cue text
        $("#jspsych-cued-recall-" + i).append('<p class="jspsych-cued-recall">' + trial.questions[i] + '</p>');
        // add the correct target text        
        // display_element.append($('<div>', {
        //   "id": 'jspsych-cued-recall-feedback',
        //   "class": 'jspsych-cued-recall-question left',
        //   html: trial.targets[i]
        // }));



        // add text box
        $("#jspsych-cued-recall-" + i).append('<textarea id="jspsych-cued-recall-input" cols="20" rows="1" size=6 name="#jspsych-cued-recall-response-' + i + '" onkeypress="return restrictCharacters(this, event, alphaOnly)"></textarea>');
        $("#jspsych-cued-recall-" + i).append('<p class="jspsych-cued-recall" id="cued-recall-feedback">' + trial.questions[i] + ' - ' + trial.targets[i] + '</p>');
        $("#cued-recall-feedback").hide();
      }
      
      $("#jspsych-cued-recall-input").focus();
      $("#jspsych-cued-recall-input").keypress(function(event){
        if(event.keyCode == 13){

              // measure response time
              var endTime = (new Date()).getTime();
              var response_time = endTime - startTime;

              // create object to hold responses
              var question_data = {};
              
              var question_data = $("div.jspsych-cued-recall-question").children('textarea').val();
              
              // save data
              jsPsych.data.write({
                "rt": response_time,
                "responses": JSON.stringify(question_data), //JSON.stringify(question_data)
                "cue": JSON.stringify(trial.questions),
                "target": JSON.stringify(trial.targets)
              });

              $("#cued-recall-feedback").show();
              setTimeout(function(){
                display_element.html('');
                // next trial
                jsPsych.finishTrial();
                }, trial.feedbackTime)
            }
          
          });

// This is some experimental code to score the responses once entered.
// if ($response != "N/A") {
//       $response = strtolower($response);
//       for ($i = 0; $i < 45; $i++) {
//         $percent = 0.0;
//         similar_text($response, $word_list[$i]->word, $percent);
//         if ($percent > $max) {
//           $max = $percent;
//           $similar_word = $word_list[$i]->word;
//         }
//       }
//     }

      var startTime = (new Date()).getTime();
    };

    return plugin;
  })();
})(jQuery);

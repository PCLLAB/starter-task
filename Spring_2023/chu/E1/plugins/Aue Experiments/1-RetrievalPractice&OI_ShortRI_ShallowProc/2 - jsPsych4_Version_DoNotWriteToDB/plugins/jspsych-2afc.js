/*  jspsych-xab.js
 *	Josh de Leeuw
 *
 *  This plugin runs a single 2AFC trial, where  A and B are choices.	The subject's goal is to identify 
 *  whether A or B is the target.
 *
 * documentation: docs.jspsych.org
 *
 */

 (function($) {
  jsPsych["2afc"] = (function() {

    var plugin = {};

    plugin.create = function(params) {

      params = jsPsych.pluginAPI.enforceArray(params, ['data']);

      // the number of trials is determined by how many entries the params.stimuli array has
      var trials = new Array(params.stimuli_a.length);

      for (var i = 0; i < trials.length; i++) {
        trials[i] = {}; 
        // trials[i].x_path = params.stimuli[i][0];
        // if there is only a pair of stimuli, then the first is the target and is shown twice.
        // if there is a triplet, then the first is X, the second is the target, and the third is foil (useful for non-exact-match XAB).
        // if (params.stimuli[i].length == 2) {
        //   trials[i].a_path = params.stimuli[i][0];
        //   trials[i].b_path = params.stimuli[i][1];
        // } else {
        trials[i].a_path = params.stimuli_a[i];
        trials[i].b_path = params.stimuli_b[i];
        // trials[i].a_data = params.stimuli_a_data[i];
        // trials[i].b_data = params.stimuli_b_data[i];
        // }
        trials[i].left_key = params.left_key || 81; // defaults to 'q'
        trials[i].right_key = params.right_key || 80; // defaults to 'p'
        // timing parameters
        // trials[i].timing_x = params.timing_x || 1000; // defaults to 1000msec.
        // trials[i].timing_xab_gap = params.timing_xab_gap || 1000; // defaults to 1000msec.
        trials[i].timing_ab = params.timing_ab || -1; // defaults to -1, meaning infinite time on AB. If a positive number is used, then AB will only be displayed for that length.
        // optional parameters
        trials[i].is_html = (typeof params.is_html === 'undefined') ? false : params.is_html;
        trials[i].prompt = (typeof params.prompt === 'undefined') ? "" : params.prompt;
        trials[i].LRpos = params.LRpos[i];

      }
      return trials;
    };

    plugin.trial = function(display_element, trial) {

      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

      // this array holds handlers from setTimeout calls
      // that need to be cleared if the trial ends early
      var setTimeoutHandlers = [];

        // randomize whether the target is on the left or the right; I don't like the way this is done. For short runs, it's problematic.
        
        // var target_left = (trial.LRpos === 1);//(Math.floor(Math.random() * 2) === 0); // 50% chance target is on left.

        // var image_left = true;

        // show the options
        if (!trial.is_html) {
          display_element.append($('<img>', {
            "src": images[0],
            "class": 'jspsych-2afc left'
          }));
          display_element.append($('<img>', {
            "src": images[1],
            "class": 'jspsych-2afc right'
          }));
        } else {
          if(trial.LRpos === 1){
            display_element.append($('<div>', {
              "class": 'jspsych-2afc left',
              html: trial.a_path
            }));
            display_element.append($('<div>', {
              "class": 'jspsych-2afc right',
              html: trial.b_path
            }));
          } else {
            display_element.append($('<div>', {
              "class": 'jspsych-2afc right',
              html: trial.a_path
            }));
            display_element.append($('<div>', {
              "class": 'jspsych-2afc left',
              html: trial.b_path
            }));
          };
        };

        if (trial.prompt !== "") {
          display_element.append(trial.prompt);
        }


        // if timing_ab is > 0, then we hide the stimuli after timing_ab milliseconds
        if (trial.timing_ab > 0) {
          setTimeoutHandlers.push(setTimeout(function() {
            $('.jspsych-2afc').css('visibility', 'hidden');
          }, trial.timing_ab));
        }

        // create the function that triggers when a key is pressed.
        var after_response = function(info) {

          // kill any remaining setTimeout handlers
          for (var i = 0; i < setTimeoutHandlers.length; i++) {
            clearTimeout(setTimeoutHandlers[i]);
          }

          var correct = 0; // true when the correct response is chosen

          if (info.key == trial.left_key) // 'q' key by default
          {
            if (trial.LRpos === 1) {
              correct = 1;
            }
          } else if (info.key == trial.right_key) // 'p' key by default
          {
            if (trial.LRpos === 0) {
              correct = 1;
            }
          }

          // if (info.key == trial.left_key && target_left == true) // 'q' key by default
          //   {
          //     // if (target_left) {
          //       correct = true;
          //     // }
          //   } else if (info.key == trial.right_key && target_left != true) // 'p' key by default
          //     {
          //     // if (!target_left) {
          //       correct = true;
          //     // }
          //   } else { 
          //     correct = false;
          //   }

          // create object to store data from trial
          var trial_data = {
            "rt": info.rt,
            "correct": correct,
            "stimulus": trial.a_path,
            "foil": trial.b_path,
            "stimulus_pos": trial.LRpos,
            "key_press": info.key,
            // "target_dat": trial.a_data,
            // "foil_dat": trial.b_data,
          };
          jsPsych.data.write(trial_data);

          display_element.html(''); // remove all

          xab_trial_complete = true;

          // move on to the next trial after timing_post_trial milliseconds
          jsPsych.finishTrial();

        };

        jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: [trial.left_key, trial.right_key],
          rt_method: 'date',
          persist: false,
          allow_held_key: false
        });
      // }
    };

    return plugin;
  })();
})(jQuery);

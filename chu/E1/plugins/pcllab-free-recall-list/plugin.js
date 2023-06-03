/**
 * @name Free Recall List
 *
 * @param {string} [title] - The optional title
 * @param {string} [button_text] - Text that will appear in place of 'Next' on the button.
 * @param {string} [instructions] - The instructions to be shown in an optionally displayed instructions label
 * @param {number} [maximum_time] - The amount of time (in milliseconds) for the experiment to be completed
 * @param {number} [minimum_time] - The amount of time until the experiment can be submitted
 * @param {boolean} [allow_delete=false] - If set to true, the user can delete their responses from the answer box
 * @param {boolean} [show_progress=false] - If set to true and maximum time is set, it will show the progress bar, default false
 * @param {boolean} [show_timer=false] - If set to true and maximum time is set, it will show a label with the time left, default false
 * @param {boolean} [show_instructions=false] - If set to true the instruction label on top of the input box will be displayed, default false
 * @param {boolean} [scroll_list=false] - If set to true, the list will have a scroll bar instead of getting taller as more words are added
 * @param {boolean} [track_unsubmitted=false] - If a user backspaces a word before hitting enter, keep track of it in a separate array, default false
 * @param {array} [word_list] - An optional array of strings of the correct words to be recalled
 * @param {boolean} [order_matters] - If set to true, order will matter when scoring correct responses
 * @param {boolean} [exact_response] - Responses must be exact, so no plurals, etc.
 * @param {string} [word_file] - An optional path to a JSON file which contains the correct words
 *
 * @desc This is a very customizable plugin that allows the user to recall words into a list format.
 *
 * @author Mehran Einakchi https://github.com/LOG67, Andrew Arpasi https://github.com/Andrew-Dev
 * 
 */

 jsPsych.plugins["pcllab-free-recall-list"] = (function() {

	var plugin = {};
	plugin.trial = function(display_element, trial) {
		// set default values for parameters
    if(trial.instructions) {
      for(let i = 60; i < trial.instructions.length; i += 60) {
        trial.instructions = `${trial.instructions.slice(0, i)}<br/>${trial.instructions.slice(i)}`
      }
    } else
      trial.instructions = '';

		// allow variables as functions
		// this allows any trial variable to be specified as a function
		// that will be evaluated when the trial runs. this allows users
		// to dynamically adjust the contents of a trial as a result
		// of other trials, among other uses. you can leave this out,
		// but in general it should be included
		trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    var words = [];

    var firstKeyTimes = [];
    var firstKeyTime = -1;

    var submissionKeyTimes = [];
    var submissionKeyTime = -1;

    var timeInterval;

    var timeElapsed = 0;

    var startTime = Date.now();

    let currentResponseIndex = 0;

    let wordPrefixes = []
    let correctSet = new Set()

    if(!trial.button_text) {
      trial.button_text = 'Next'
    }

    //prevent cut copy and paste
    $('body').bind("cut copy paste", function (e) { e.preventDefault(); })

    // title
    if (trial.title) {
      var titleView = $('<h2>', {
        class: 'pcllab-text-center pcllab-default-bottom-margin-medium',
        text: trial.title,
      });
    }

    //load JSON
    if(trial.word_file) {
      $.getJSON(trial.word_file, function(data) {
        if(!Array.isArray(data)) {
          console.log("Invalid JSON, must be array of words");
          return;
        }
        console.log(data);
        trial.word_list = data;
        correctSet = new Set(trial.word_list.map(word=>word.PictureName));
        buildPrefixes()
      });
    }

    //build set of prefixes for correctness checking
    if(trial.word_list) {
      buildPrefixes()
    }

    function buildPrefixes() {
      trial.word_list.map((word) => {
        if(word.PictureName.length == 0) return
        //if(word.PictureName.length <= 3) {
          //wordPrefixes.add(word.PictureName)
          //return word
        //}
        const prefix = word.PictureName.substring(0,3)
        word.Prefixes=prefix
        return word
      })
      console.log("prefixes",wordPrefixes)
    }

    //Grid System
    var gridContainer = $('<div>', {
      class: 'pcllab-free-recall-list-grid-container',
    });

    var gridRow = function () {
      return $('<div>', {
          class: 'row',
      });
    }

    var gridCol = function (size) {
      return $('<div>', {
        class: 'col-sm-' + size,
      });
    }

    // instructions
    var instructionsView = $('<h4>', {
      class: 'pcllab-default-bottom-margin-medium',
      style: 'text-align: center;',
    }).html(trial.instructions);

    //Grid Items
    var recallRow = gridRow();

    var leftContainer = gridCol(6);
    var rightContainer = gridCol(6);

    // textarea
    var responseTextFieldView = $('<input>', {
      class: 'form-control',
      type: 'text',
      style: 'min-width: 50%; margin-top: 50%; font-size: 20px; padding: 5px 0px; border-radius: 0;',
      placeholder: 'Type a word then press enter.',
      maxlength: '30'
    });

    if(trial.show_instructions) {
      leftContainer.append(instructionsView);
    }

    leftContainer.append(responseTextFieldView);
    recallRow.append(leftContainer);

    //word bank wrapper
    var wordWrapperView = $('<div>',{
      id: 'wordBankWrapper',
      class: 'pcllab-free-recall-list-wrapper pcllab-short-answer-bank-word-container',
      style: 'width:100%;',
    });

    // word bank
    var cardView = $('<div>', {
      class: 'card card-body'
    });

    var wordBankView = $('<div>', {
      id: 'wordBank',
      class: 'pcllab-short-answer-bank-word-container pcllab-default-font-larger',
      style: 'height: auto; width: 100%; border: none; margin: 0;',
    });

    wordWrapperView.append(wordBankView);
    cardView.append(wordWrapperView);
    rightContainer.append(cardView);
    recallRow.append(rightContainer);

    var continueBtnView = $('<button>', {
      class: 'btn btn-primary btn-lg pcllab-button-center wave-effect',
      text: trial.button_text
    });

    // Progress Bar
    var progressBarContainer = $('<div>', {
        class: 'progress',
        style: 'margin-top: 40px;',
    });

    var progressBar = $('<div>', {
        class: 'progress-bar',
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': 100
    });

    var timeLabel = $('<p>', {
      style: 'text-align: center; padding: 20px',
    });

    progressBarContainer.append(progressBar);

    //bottom row for progress bar, timer and button
    var bottomRow = gridRow();
    var bottomCol = gridCol(12);
    bottomRow.append(bottomCol);
    bottomRow.css('margin-top','20px');

    // building the view
    display_element.html('');
    if (titleView) {
      display_element.append(titleView);
    }

    //apply specific styles if the list is set to be scrollable
    if(trial.scroll_list) {
      wordWrapperView.css('height','450px');
      wordWrapperView.css('overflow','auto');
    } else {
      wordWrapperView.css('min-height','450px');
    }

    bottomCol.append(continueBtnView);

    //if the maximum time is set and it isn't hidden, show the progress bar
    if(trial.maximum_time && trial.show_progress) {
      bottomCol.append(progressBarContainer);
      //for some reason it is hidden in the CSS
      progressBarContainer.show();
    }

    //if the maximum time is set and it isn't hidden, show the timer
    if(trial.maximum_time && trial.show_timer) {
      bottomCol.append(timeLabel);
    }

    gridContainer.append(recallRow);
    gridContainer.append(bottomRow);

    display_element.append(gridContainer);

    //focus the text field
    responseTextFieldView.focus();

    //check if minimum and maximum time are set
    if(trial.minimum_time || trial.maximum_time) {

      timeInterval = setInterval(function() {
        timeElapsed += 100;
        //if maximum time is set, check to see if trial
        if(trial.maximum_time) {
          //finish the trial if the participant has reached their maximum time
          if(timeElapsed >= trial.maximum_time) {
            finishTrial();
          }

          //progress bar
          if(trial.show_progress) {
            var newValue = 100 - ((timeElapsed / (trial.maximum_time || trial.minimum_time)) * 100);
            progressBar.css('width', newValue + '%');
            progressBar.css({
              'height': '100%'
          })
            progressBar.prop('aria-valuenow', newValue);
          }

          //time label
          if(trial.show_timer) {
            var timeLeft = trial.maximum_time - timeElapsed;
            var minutes = Math.floor(timeLeft / 60000);
            var seconds = Math.floor((timeLeft % 60000)/ 1000);
            if(seconds < 10) {
              timeLabel.text("Time remaining: " + minutes + ":0" + seconds);
            } else {
              timeLabel.text("Time remaining: " + minutes + ":" + seconds);
            }
          }
        }

      },100);

      //hide continue button as the trial will automatically continue if they are equal
      if(trial.maximum_time == trial.minimum_time) {
        console.log("equal");
        continueBtnView.hide();
      } else if(trial.minimum_time) {
        continueBtnView.prop('disabled',true);
        //enable submit button after minimum time passes
        setTimeout(function() {
          continueBtnView.prop('disabled',false);
        },trial.minimum_time);
      }
    }

    responseTextFieldView.keyup(onKeyup);
    responseTextFieldView.keypress(onKeypress);
    continueBtnView.click(finishTrial);

    function finishTrial() {
      display_element.html('');
      clearInterval(timeInterval);

      var trialData = {
        total_time: Date.now() - startTime,
      }

      jsPsych.finishTrial(trialData);
    }

    var currentWord = responseTextFieldView.val().trim();
    var backspaces = 0;

    function saveWordTime() {
      firstKeyTimes.push(firstKeyTime);
      firstKeyTime = -1;
      submissionKeyTime = (Math.round(((Date.now() - startTime))));
      submissionKeyTimes.push(submissionKeyTime);
    }

    function recordWord(word) {
      let data = {
        response: word,
        firstkeyRT: firstKeyTime,
        submissionRT: Math.round(Date.now() - startTime),
        outputOrder: words.length,
      }

      const prefix = word.substring(0,3)

      firstKeyTime = -1

      if(trial.word_list) {

        data.correct = 0
        //console.log(prefix)
        //console.log(wordPrefixes)
        //console.log(trial.exact_response)
        //console.log(wordPrefixes.has(prefix))

        let foundExact=(trial.word_list.find(item => item.PictureName=== word))
        let foundPrefixes=(trial.word_list.find(item => item.Prefixes=== prefix))
        if(trial.exact_response && (foundExact)) {
          data.correct = 1
          data.QuestionType=foundExact.QuestionType
          console.log("correct")
        }
        else if(!trial.exact_response && (foundPrefixes)) {
          data.correct = 1
          data.QuestionType=foundPrefixes.QuestionType
          console.log("correct")
        }
      }

      currentResponseIndex++

      jsPsych.data.write(data)
    }

    function recordDelete(word) {
      currentResponseIndex--;

      jsPsych.data.write({
        action: 'delete',
        response: word
      })
    }

    function onKeyup(e) {

      if (e.which == 13) {
        var word = responseTextFieldView.val().trim();
        responseTextFieldView.val('');

        if (word.length == 0) return;

  			if (words.indexOf(word.toLowerCase()) < 0) {
  		 		words.push(word.toLowerCase());
          //saveWordTime();
          recordWord(word);
          updateWordBank();
        } else {
          firstKeyTime = -1;
          alert('You can enter a word only once');
        }

      } else if(e.which != 8) {
        currentWord = responseTextFieldView.val().trim();
      }
    }

    function onKeypress(e) {
      if (String.fromCharCode(e.which).match(/[^a-zA-Z\b]/)){
  			e.preventDefault();
  		} else if (firstKeyTime == -1) {
				firstKeyTime = (Math.round(((Date.now() - startTime))));
			}
    }

    function onClick(e) {
      if(trial.allow_delete) {
        var word = $(e.delegateTarget).text();
        var index = words.indexOf(word);
        words.splice(index, 1);
        firstKeyTimes.splice(index, 1);
        submissionKeyTimes.splice(index, 1);
        recordDelete(word);
        updateWordBank();
      }
    }

    function updateWordBank() {
      wordBankView.html('');
      for (var i = 0; i < words.length; i++) {
        var ulElem = $('<ul>');
        wordBankView.append(ulElem);
        var wordSpan = $('<span>', {
          class: 'pcllab-free-recall-list-word',
          text: words[i],
          click: onClick
        });

        //check if deletion is disabled to disable red hover
        if(!trial.allow_delete) {
          wordSpan.css('color','#000');
          wordSpan.css('cursor','default');
        }

        ulElem.append($('<li>').append(wordSpan));

        if(trial.scroll_list) {
          wordWrapperView.scrollTop(wordWrapperView.get(0).scrollHeight);
        }
      }
    }
	};

	return plugin;
})();

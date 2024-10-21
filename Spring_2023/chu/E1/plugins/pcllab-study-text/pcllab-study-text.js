/**
 * jsPsych plugin for showing a list of long texts
 * Mehran Einakchi
 */

/**
 * @name Study Text
 * @param {array} stimuli - Each element of the array is a piece of html containing text tags
 * @param {number=} [minimum_time=1000*60] - How long to wait to show the advance button (in milliseconds).
 * @param {number=} [blank_time=0] - If greater than 0, then a gap will be shown between each item/items in the sequence. This parameter specifies the length of the gap.
 */

jsPsych.plugins["pcllab-study-text"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.minimum_time = trial.minimum_time || 1000*60;
        trial.blank_time = trial.blank_time || 0;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);


        var animateFrame = -1;
        var startTime = (new Date()).getTime();

        // css variables
        var textContainerId = 'pcllab-study-text-text-container';
        var progressBarId = 'pcllab-study-text-progressbar';
        var advanceButtonId = 'pcllab-study-text-button';

        var animationData = [];


        display_element.html("");
        display_element.load("./template.html", function () {
            $("#" + advanceButtonId).click(function () {
                record();
                if (animateFrame == trial.stimuli.length - 1) {
                    var trialData = {
                        "study_sequence": JSON.stringify(animationData)
                    };
                    display_element.html('');
                    jsPsych.finishTrial(trialData);
                    return;
                }

                if (trial.blank_time > 0) {
                    display_element.css('visibility', 'hidden');
                    setTimeout(function() {
                        record('blank');
                        advance();
                    }, trial.blank_time);
                } else {
                    advance();
                }
            });
            advance();
        });


        function advance() {
            display_element.css('visibility', 'visible');
            animateFrame++;
            var timeSpent = trial.minimum_time;
            $("#" + progressBarId).progressbar({max:timeSpent});
            $("#" + progressBarId).progressbar({value:timeSpent});
            $("#" + progressBarId).css('display', 'block');
            $("#" + advanceButtonId).css('display', 'none');

            var timerInterval = setInterval( function () {
                timeSpent -= 100;
                if (timeSpent <= 0) {
                    clearInterval(timerInterval);
                    $("#" + progressBarId).css('display', 'none');
                    $("#" + advanceButtonId).css('display', 'block');
                }
                $("#" + progressBarId).progressbar({value: timeSpent});
            } ,100);


            // TODO: title
            // console.log(animateFrame);
            // console.log(trial.stimuli[animateFrame]);
            $("#" + textContainerId).html($(trial.stimuli[animateFrame]['text']));
        }

        function record(title) {
            title = title || trial.stimuli[animateFrame].title;

            var newStartTime = (new Date()).getTime();
            animationData.push({
                "stimuli": title,
                "time": newStartTime - startTime,
            });
            startTime = newStartTime;
        }

    };


    return plugin;
})();

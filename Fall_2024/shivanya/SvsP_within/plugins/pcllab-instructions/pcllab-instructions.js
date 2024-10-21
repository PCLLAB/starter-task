/**
 * jsPsych plugin for showing the instructions
 * Usage: This plugin assumes that there is an instructions.json file or you need to provide the url to a json file
 * containing all the instructions for the experiment, the structure of the json file is that the root node is an object.
 * Each instruction set has a key and the value is either an object with 'title' and 'text' properties or an array of
 * these objects.
 *
 * Mehran Einakchi
 */

/**
 * @name Instructions
 * @param {string} [url=instructions.json] - The address of the json file of all instructions.
 * @param {string} [label] - You should provide the label for one instruction or an array of instructions.
 */

jsPsych.plugins["pcllab-instructions"] = (function () {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('pcllab-instructions', 'text', 'image');

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.url = trial.url || "instructions.json";


        if (!jsPsych.userInfo) {
            jsPsych.userInfo = {};
        }

        if (!jsPsych.userInfo.instructions) {
            $.getJSON(trial.url, function (data) {
                jsPsych.userInfo.instructions = data;
                show()
            });
        } else {
            show();
        }


        function show() {
            var instructions = jsPsych.userInfo.instructions[trial.label];

            if (!$.isArray(instructions)) {
                instructions = [instructions];
            }

            display_element.html($("<div></div>", {
                'class': "centered-container"
            }));

            var index = 0;

            showNext();

            function showNext() {
                $('div.centered-container').html('<h1>' + instructions[index].title + '</h1><br>');
                $('div.centered-container').append( instructions[index].text  + '<br><br><br>');
                $('div.centered-container').append('<button type="button" class="pcllab-button pcllab-button-center">Continue</button>');
                index++;
                $('.pcllab-button').click(function () {
                    if (index != instructions.length) {
                        showNext();
                    } else {
                        display_element.html("");
                        jsPsych.finishTrial();
                    }
                });
            }
        }

    };

    return plugin;
})();

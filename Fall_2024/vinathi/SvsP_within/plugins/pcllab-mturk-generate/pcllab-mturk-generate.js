/**
 * jsPsych plugin for generating a random string to use as the mturk
 * Mehran Einakchi
 */

/**
 * @name MTurk Generate
 */

jsPsych.plugins["pcllab-mturk-generate"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        var code = generateMTurkCode(4);

        var data = {
            turkCode: code,
        };

        jsPsych.finishTrial(data);
    };

    // Generate a unique code for them to input to mturk
    function generateMTurkCode(codeLength){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for( var i = 0; i < codeLength; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }


    return plugin;
})();

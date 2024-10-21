/**
 * jsPsych plugin for showing the mturk code to the experimentee
 * Mehran Einakchi
 */

/**
 * @name MTurk Show
 */

jsPsych.plugins["pcllab-mturk-show"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        var trials = jsPsych.data.getTrialsOfType("pcllab-mturk-generate");
        var code = trials[0].turkCode;

        display_element.html("<div class='centered-container'></div>");

        $('div.centered-container').html('<div style="text-align: center;"> ' +
            '<h2>Thank you for your participation!</h2><br> ' +
            '<h2>Please put the code below into the box on MTurk to confirm your participation.</h2><br>' +
            '<h2 style="color: darkred;">' + code + '</h2><br>' +
            '<h2>Remember that this is a two-session experiment. You have just completed the first session, and you will receive payment for this session.</h2>' +
            '</div>');

    };

    return plugin;
})();

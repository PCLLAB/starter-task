/**
 * jsPsych plugin for halting the process of the experiment if the mturk info is not correct
 * Mehran Einakchi
 */

/**
 * @name Mturk Check
 */

jsPsych.plugins["pcllab-mturk-check"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        if (isMturkValid()) {
            display_element.html("");
            jsPsych.finishTrial();
            return;
        }

        display_element.html($("<div></div>", {
            'class': "centered-container"
        }));

        $('div.centered-container').html('<div style="text-align: center;"> ' +
            '<h1>No Valid Mturk Worker ID</h1><br> ' +
            '<p><b>You currently do not have any valid Worker ID attached to your profile. ' +
            'To participate in the study, please go back through mechanical turk and accept this ' +
            'HIT before you do this test.</b></p></div>');
    };

    function isMturkValid() {
        return !jsPsych.turk.turkInfo().outsideTurk;
    }

    return plugin;
})();

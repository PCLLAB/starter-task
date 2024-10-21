/**
 * jsPsych plugin for halting the process of the experiment if the device is mobile
 * Mehran Einakchi
 */

/**
 * @name No Mobile
 */

jsPsych.plugins["pcllab-no-mobile"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        if (!isMobile()) {
            display_element.html("");
            jsPsych.finishTrial();
            return;
        }

        display_element.html($("<div></div>", {
            'class': "centered-container"
        }));

        $('div.centered-container').html('<div style="text-align: center;"> ' +
            '<h1>No Mobile Devices</h1><br> ' +
            '<p><b>In order to receive credit for this HIT you must use a desktop or laptop computer. ' +
            'The experiment does not work on mobile or tablet devices.</b></p> ' +
            '<p><b>If you would still like to participate please go back to ' +
            'Mturk on a capable device and click the link.</b></p> ' +
            '</div>');
    };

    function isMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    }

    return plugin;
})();

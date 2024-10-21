/**
 * jsPsych plugin for showing the consent form
 * Mehran Einakchi
 */

/**
 * @name Consent Form
 * @param {string} [url=consent.html] - The address of the consent html form.
 */

jsPsych.plugins["pcllab-consent-form"] = (function () {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('pcllab-consent-form', 'stimuli', 'image');

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.url = trial.url || "consent.html";
        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        display_element.html($("<div></div>", {
            'class': "centered-container"
        }));

        $('div.centered-container').load(trial.url, function () {
            $('div.centered-container').append('<p>To continue, click the checkbox below and hit "Start Experiment".</p> ' +
                '<p> <input type="checkbox" id="consent_checkbox" />I agree to take part in this study. </p> ' +
                '<button type="button" class="pcllab-button pcllab-button-center">Start Experiment</button>');

            $('.pcllab-button').click(function () {
                if (!$('#consent_checkbox').prop("checked")) {
                    alert("You need to read and accept the Consent Form to start the experiment. Check the agreement box.");
                } else {
                    jsPsych.finishTrial();
                }
            });
        })



    };

    return plugin;
})();

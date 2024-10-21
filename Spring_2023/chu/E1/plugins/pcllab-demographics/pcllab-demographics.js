/**
 * jsPsych plugin for showing the retrieve the demographic data
 * Mehran Einakchi
 */

/**
 * @name Demographics
 * @param {bool} [no_age=false] - Should ask for the age.
 * @param {bool} [no_gender=false] - Should ask to choose the gender from male/female/other.
 * @param {bool} [no_english=false] - Should ask whether English is their first language.
 */

jsPsych.plugins["pcllab-demographics"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        display_element.html($("<div></div>", {
            'class': "centered-container"
        }));

        var divElem = $("div.centered-container");

        if (!trial.no_age) {
            divElem.append("<P>What is your age:</P>");
            divElem.append("<input type='text' name='age_demo'><br>");
        }

        if (!trial.no_gender) {
            divElem.append("<P>What is your gender:</P>");
            divElem.append("<input type='radio' name='gender_demo' value='female'>Female<br>");
            divElem.append("<input type='radio' name='gender_demo' value='male'>Male<br>");
            divElem.append("<input type='radio' name='gender_demo' value='other'>Other<br>");
        }

        if (!trial.no_english) {
            divElem.append("<P>Is English your first language?</P>");
            divElem.append("<input type='radio' name='english_demo' value='yes'>Yes<br>");
            divElem.append("<input type='radio' name='english_demo' value='no'>No<br>");
        }


        divElem.append("<button class='pcllab-button pcllab-button-center'>Continue</button>");

        $("button.pcllab-button").click(function () {
            // TODO: should check the input
            var data = {};
            if (!trial.no_age) {
                data['age'] = $('input[name=age_demo]').val();
            }
            if (!trial.no_gender) {
                data['gender'] = $('input[name=gender_demo]').val();
            }
            if (!trial.no_english) {
                data['english'] = $('input[name=english_demo]').val();
            }
            display_element.html("");
            jsPsych.finishTrial(data);
        });

    };

    return plugin;
})();

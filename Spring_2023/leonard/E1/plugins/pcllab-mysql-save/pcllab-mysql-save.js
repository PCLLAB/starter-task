/**
 * jsPsych plugin for getting connecting to mysql and saving the information
 * Mehran Einakchi
 */

/**
 * @name MySQL Save
 */

jsPsych.plugins["pcllab-mysql-save"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {
        trial.url = trial.url || "save.php";

        display_element.html(jsPsych.data.dataAsJSON());

        $.ajax({
            type:'post',
            cache: false,
            url: trial.url,
            data: {data:jsPsych.data.dataAsJSON()},
            success: function(output) {
                jsPsych.finishTrial({ok: true});
            },
            error: function (xhr, textStatus) {
                jsPsych.finishTrial({ok: false});
            },
        });
    };

    return plugin;
})();

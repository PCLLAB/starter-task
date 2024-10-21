/**
 * jsPsych plugin for getting connecting to mysql and getting the information
 * Mehran Einakchi
 */

/**
 * @name MySQL Retrieve
 */

jsPsych.plugins["pcllab-mysql-retrieve"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {
        trial.url = trial.url || "retrieve.php";

        $.ajax({
            type:'post',
            cache: false,
            url: trial.url,
            data: {
                workerId: trial.workerId
            },
            success: function(output) {
                var json = JSON.parse(output);
                jsPsych.finishTrial(json);
            },
            error: function (xhr, textStatus) {
                // TODO:
            },
        });


    };

    return plugin;
})();

/**
 * @name PCLLAB Save to Jarvis
 * 
 * A convenient drop-in plugin to save experiment data to Jarvis
 * 
 * @param {String} experiment_id - The experiment ID listed in the Jarvis endpoint dialog
 * @param {String} custom_JSON - Custom JSON to save to Jarvis, must be a JSON string, use JSON.stringify(...) if you need to convert an object
 * @param {String} custom_URL - Custom URL for development purposes, leave empty for 'https://jarvis.psych.purdue.edu'
 * 
 * @author Andrew Arpasi
 */
jsPsych.plugins['pcllab-save-to-jarvis'] = ( function() {
    var plugin = {}
    plugin.trial = function(display_element, trial) {
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial)

      const url = trial.custom_URL || 'https://jarvis.psych.purdue.edu'

      const endpoint = url + '/api/v1/experiments/data/' + trial.experiment_id

      const json = trial.custom_JSON || jsPsych.data.dataAsJSON()

      $.ajax(endpoint, {
        data: json,
        contentType: 'application/json',
        type: 'POST'
      })

      jsPsych.finishTrial({ignore: true})
    }
    return plugin
})()
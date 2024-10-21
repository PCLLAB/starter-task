/**
 * jsPsych plugin for showing a list of words or images
 * Mehran Einakchi
 */

/**
 * @name Study Items
 * @param {array} stimuli - Each element of the array is either another array of strings or a string which is a word or a path to an image.
 * @param {number=} [frame_time=250] - How long to display each item or items (in milliseconds).
 * @param {number=} [blank_time=0] - If greater than 0, then a gap will be shown between each item/items in the sequence. This parameter specifies the length of the gap.
 */

jsPsych.plugins["pcl-school-plugin"] = (function () {

    var plugin = {};

    // jsPsych.pluginAPI.registerPreload('study-items', 'stimuli', 'image');

    plugin.trial = function (display_element, trial) {

        // set default values for parameters
        trial.frame_time = trial.frame_time || 250;
        trial.blank_time = trial.blank_time || 0;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
        
        display_element.load();
    };

    return plugin;
})();

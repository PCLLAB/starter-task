/**
 * @name Distractor Game
 *
 * @param {number} [time=1000*60] - How long to show the distraction.
 * @param {boolean} [show_progress=false] - Show a progress bar if set to true
 * @param {string} [title=Pac Man] - The title that is shown above the game.
 * @param {string} [url=http://www.classicgamesarcade.com/games/pacman.swf] - The url to the flash file of the game.
 * Make sure that it is the actual shock-wave file which ends in swf file extension.
 * @param {boolean} [iframe] - Use an iframe instead of embedding an SWF.
 * @desc Shows a game for specific duration.
 *
 * @author Mehran Einakchi https://github.com/LOG67
 */

jsPsych.plugins["pcllab-distractor-game"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        trial.time = trial.time || 1000 * 60;
        trial.url = trial.url || "http://www.classicgamesarcade.com/games/pacman.swf";
        trial.title = trial.title || "Pac Man";

        if (trial.iframe) {
            var title = $('<h2>', {
                text: trial.title,
                style: 'text-align: center;',
            });

            var gameBox = $('<div>', {
                id: 'game_box',
            });

            var iframe = $('<iframe>', {
                src: trial.url,
            });

            iframe.css({
                'width': '100%',
                'min-height': '500px',
                'border': 'none',
            });

            display_element.append(title);
            gameBox.append(iframe);
            display_element.append(gameBox);

            console.log(iframe);
            iframe[0].contentWindow.focus();

        } else {
            display_element.html('<div style="text-align: center;"> ' +
                '<h2>' + trial.title + '</h2><br> ' +
                '<embed id="game_box" src="' + trial.url + '" width="100%" height="500px" autoplay="true"></embed>' +
                '</div><br>');
        }

        if (trial.sound_disabled) {
            localStorage.setItem("soundDisabled", "true")
        } else {
            localStorage.setItem("soundDisabled", "false")
        }

        //progress bar
        var progressView = $('<div>', {
            class: 'progress',
        });
        var progressBar = $('<div>', {
            class: 'progress-bar',
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': 100
        });
        progressBar.css({
            'height': '100%'
        })

        display_element.append('<button class="btn btn-primary btn-lg pcllab-button-center" style="display: none">Continue</button>');
        $(".btn").click(function () {
            display_element.html("");
            jsPsych.finishTrial();
        });

        var timeLeft = trial.time;
        if (trial.show_progress) {
            display_element.append(progressView);
            progressView.append(progressBar);
            progressView.css({
                'margin-top': '20px',
            });
            progressView.show();
        }
        var timerInterval = setInterval(function () {
            timeLeft -= 100;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                // progressView.css('display', 'none');
                // $(".btn").css('display', 'block');
                // $("#game_box").remove();
                display_element.html("");
                jsPsych.finishTrial();
                return;
            }

            var newValue = ((trial.time - timeLeft) / trial.time) * 100;
            progressBar.css('width', newValue + '%');
            progressBar.prop('aria-valuenow', newValue);
        }, 100);
    };

    return plugin;
})();

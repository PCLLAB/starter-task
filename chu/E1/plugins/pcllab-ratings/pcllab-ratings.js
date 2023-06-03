/**
 * jsPsych plugin for showing the ratings after the experiment is completed
 * Mehran Einakchi
 */

/**
 * @name Ratings
 */

jsPsych.plugins["pcllab-ratings"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        display_element.html($("<div></div>", {
            'class': "centered-container"
        }));

        var inputData = [
            {
                name: 'remembrance',
                question: 'On a scale from 0 to 100, how well do you think you will remember the material you studied in 1 week?',
                min_label: 'Not at all',
                max_label: 'Perfectly'
            },
            {
                name: 'enjoyment',
                question: 'How much did you enjoy this task?',
                min_label: 'Not at all',
                max_label: 'Immensely'
            },
            {
                name: 'difficulty',
                question: 'How difficult was this task?',
                min_label: 'Easy',
                max_label: 'Hard'
            },
            {
                name: 'interestingness',
                question: 'How interesting was this task?',
                min_label: 'Not interesting',
                max_label: 'Very interesting'
            }
        ];

        var index = 0;
        var data = {};

        show();


        function show() {
            var d = inputData[index];
            var divElem = $("div.centered-container");
            // TODO: needs some tweaking for how to display this and some refactoring for css
            divElem.html("");
            divElem.append("<h2> Please answer the questions using the scale below.</h2>");

            divElem.append("<br>");
            divElem.append("<br>");

            divElem.append("<p id='ratings_question'></p>");

            divElem.append("<br>");
            divElem.append("<br>");

            divElem.append("<div style='float: left;'>" + d.min_label + "</div>");
            divElem.append("<div style='float: right;'>" + d.max_label + "</div>");
            divElem.append("<div id='ratings_table' style='display:table; width: 80%;'></div>")


            divElem.append("<br>");
            divElem.append("<br>");

            divElem.append("<button class='pcllab-button pcllab-button-center'>Continue</button>");
            $("p#ratings_question").html(d.question);
            var tableElem = $("div#ratings_table");
            tableElem.html("");

            for (var i = 0; i <= 100; i+=10) {
                tableElem.append("<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'><input type='radio' name='radioOption' value='" + i + "' ><br>"+ i +"</label>");
            }


            $("button.pcllab-button").click(function () {
                data[inputData[index].name] = $("input[name=radioOption]:checked").val();
                if (index == inputData.length - 1) {
                    display_element.html("");
                    jsPsych.finishTrial(data);
                    return;
                }

                index++;
                show();
            });
        }

    };

    return plugin;
})();

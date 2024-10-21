/**
 * jsPsych plugin for showing the environment survey after the experiment is completed
 * Mehran Einakchi
 */

/**
 * @name Environment Survey
 */

jsPsych.plugins["pcllab-environment-survey"] = (function () {

    var plugin = {};

    plugin.trial = function (display_element, trial) {

        display_element.html($("<div></div>", {
            'class': "centered-container"
        }));

// TODO: needs some tweaking for how to display this and some refactoring for css


            var divElem = $("div.centered-container");

            divElem.html("");
            divElem.append("<h2>Please answer the following questions about your environment while you completed this session.</h2>");
            divElem.append("<br>");


        // Noise section

            divElem.append("<p>What is the noise level of your environment?</p>");
            divElem.append("<br>");

            var tableElem = $("<div style='display:table; width: 80%;'></div>").appendTo(divElem);

            tableElem.append("" +
                "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
                "<input type='radio' name='noise' value='1' >" +
                "<br>"+
                "1" +
                "<br>"+
                "Very Quiet" +
                "</label>");

        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='noise' value='2' >" +
            "<br>"+
            "2" +
            "<br>"+
            "Quiet" +
            "</label>");

        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='noise' value='3' >" +
            "<br>"+
            "3" +
            "<br>"+
            "Neutral" +
            "</label>");

        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='noise' value='4' >" +
            "<br>"+
            "4" +
            "<br>"+
            "Loud" +
            "</label>");

        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='noise' value='5' >" +
            "<br>"+
            "5" +
            "<br>"+
            "Very Loud" +
            "</label>");

            divElem.append("<br>");
            divElem.append("<br>");


        // Device section

        divElem.append("<p>What device did you use during this experiment?</p>");
        divElem.append("<br>");

        tableElem = $("<div style='display:table; width: 80%;'></div>").appendTo(divElem);
        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='device' value='Laptop' >" +
            "<br>"+
            "Laptop" +
            "</label>");
        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='device' value='Desktop' >" +
            "<br>"+
            "Desktop" +
            "</label>");
        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='device' value='Netbook' >" +
            "<br>"+
            "Netbook" +
            "</label>");
        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='device' value='Smartphone' >" +
            "<br>"+
            "Smartphone" +
            "</label>");
        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='device' value='Tablet' >" +
            "<br>"+
            "Tablet/iPad" +
            "</label>");

        divElem.append("<br>");
        divElem.append("<br>");

        // cheat section

        divElem.append("<p>Did you cheat at all during the experiment? You will receive credit regardless of whether you cheated or not, so please answer truthfully.</p>");
        divElem.append("<br>");

        tableElem = $("<div style='display:table; width: 80%;'></div>").appendTo(divElem);

        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='cheat' value='yes' >" +
            "<br>"+
            "Yes" +
            "</label>");

        tableElem.append("" +
            "<label style='display:table-cell; height: 50px; text-align: center; vertical-align: middle;'>" +
            "<input type='radio' name='cheat' value='no' >" +
            "<br>"+
            "No" +
            "</label>");

        divElem.append("<br>");
        divElem.append("<br>");

        // Comment section

        divElem.append("<p>If you would like to provide any comments about the experiment, please enter them into the space below.</p>");
        divElem.append("<br>");

        divElem.append("<textarea id='comment_area' style='font-size: 29.12px; background: transparent !important; z-index: auto;min-height: 200px; width: 80%; min-width: 100px;'></textarea>");

        divElem.append("<br>");
        divElem.append("<br>");

        divElem.append("<button class='pcllab-button pcllab-button-center'>Continue</button>");

            $("button.pcllab-button").click(function () {
                var data = {};
                data.noise = $("input[name=noise]:checked").val();
                data.device = $("input[name=device]:checked").val();
                data.cheat = $("input[name=cheat]:checked").val();
                data.comment = $("textarea#comment_area").val();
                display_element.html("");
                jsPsych.finishTrial(data);
            });
    };

    return plugin;
})();

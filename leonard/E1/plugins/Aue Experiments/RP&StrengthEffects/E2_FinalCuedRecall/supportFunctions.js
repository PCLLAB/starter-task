
function randomIntFromInterval(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

function getQueryVariable(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var check_consent = function(elem) {
	if ($('#consent_checkbox').is(':checked')) {
		return true;
	}
	else {
		alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
		return false;
	}
	return false;
};

function checkMobile() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return true;
	} else {
		return false;
	}
};

	// var alphaOnly = /[a-z]/g;
function restrictCharacters(myfield, e, restrictionType) {
	if (!e) var e = window.event
		if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
	var character = String.fromCharCode(code);

    // if they pressed esc... remove focus from field...
    if (code==27) { this.blur(); return false; }
    // ignore if they are press other keys
    // strange because code: 39 is the down key AND ' key...
    // and DEL also equals .
    if (!e.ctrlKey && code!=9 && code!=8 && code!=36 && code!=37 && code!=38 && (code!=39 || (code==39 && character=="'")) && code!=40) {
    	if (character.match(restrictionType)) {
    		return true;
    	} else {
    		return false;
    	}
    	
    }
}

// Generate a unique code for them to input to mturk
function mTurkCode(codeLength){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	for( var i=0; i < codeLength; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function saveMySQL(data){
   var data_table = "StrengthRecall"; // change this for different experiments
   $.ajax({
      type:'post',
      cache: false,
      url: 'savedata.php', // change this to point to your php file.
      // opt_data is to add additional values to every row, like a subject ID
      // replace 'key' with the column name, and 'value' with the value.
      data: {
          table: data_table,
          json: JSON.stringify(data),
          // opt_data: {key: value}
      },
      success: function(output) { console.log(output); } // write the result to javascript console
   });
}

function saveCSV(filename, filedata){
	$.ajax({
		type:'post',
		cache: false,
	      url: 'save_csv.php', // this is the path to the above PHP script
	      data: {filename: filename, filedata: filedata}
	  });
}

function getdata(url, callback){
    var data = $.ajax({
                type: 'GET',
                url: url
            }).done(callback).error(function(){
               alert('Oppps...something went wrong')
            });
    return data;
};

function readStim(url){
	$.ajax({
		type: 'GET',
  		url: url,
  		dataType: 'json',
  		success: function(data) { mydata = data;},
  		async: false
		});
	return(mydata)
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function isOdd(n) {
   return Math.abs(n % 2) == 1;
}

navigator.sayswho = function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
};

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

function palmerStimGen(nRow, nCol, nSegments){
    var segments_possible = (nRow*(nCol-1)) + (nCol*(nRow-1)) + ((nRow-1)*(nCol-1)*2)
    var blanks = Array.apply(null, new Array(segments_possible-nSegments)).map(Number.prototype.valueOf,0);
    var segments = Array.apply(null, new Array(nSegments)).map(Number.prototype.valueOf,1);
    var stim = blanks.concat(segments);
    return(stim);
}

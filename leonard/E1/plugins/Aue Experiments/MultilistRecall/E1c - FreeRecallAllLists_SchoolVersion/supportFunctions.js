
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
   var data_table = "OrderRecallSchool"; // change this for different experiments
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

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
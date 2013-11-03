var recognizing = false;
var final_transcript = '';
var start_timestamp;
var recognition;

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.start();
  start_timestamp = event.timeStamp;
  document.getElementById('message').innerHTML = "started";
}

function onPageLoad() {
	if (!('webkitSpeechRecognition' in window)) {
  		document.getElementById('message').innerHTML = "Your browser doesn't support web speech api";
	} else {
	  recognition = new webkitSpeechRecognition();
	  recognition.continuous = true;
	  recognition.interimResults = true;
	
	  recognition.onstart = function() {
	    recognizing = true;
	  };
	
	  recognition.onerror = function(event) {
	    if (event.error == 'no-speech') {
	    	document.getElementById('message').innerHTML = "Didn't capture any speech";
	          }
	    if (event.error == 'audio-capture') {
	     document.getElementById('message').innerHTML = "Audio capture error";
	    }
	    if (event.error == 'not-allowed') {
	      if (event.timeStamp - start_timestamp < 100) {
	      document.getElementById('message').innerHTML = "Time out error";
	      } 
	      else {
	      document.getElementById('message').innerHTML = "Not allowed error";
	      }
	    }
	  };
	
	  recognition.onend = function() {
	    recognizing = false;
	    document.getElementById('message').innerHTML = "Recognition ended";	  
	    document.getElementById('transcript').innerHTML = final_transcript;
	  };
	
	  recognition.onresult = function(event) {
	    var interim_transcript = '';
	    if (typeof(event.results) == 'undefined') {
	      recognition.onend = null;
	      recognition.stop();
	      document.getElementById('message').innerHTML = "Recognition is not supported by your browser";	
	      return;
	    }
	    for (var i = event.resultIndex; i < event.results.length; ++i) {
	      if (event.results[i].isFinal) {
	        final_transcript += event.results[i][0].transcript;
	      } else {
	        interim_transcript += event.results[i][0].transcript;
	      }
	    }
	};
}

}
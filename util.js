var recognizing = false;
var final_transcript = '';
var start_timestamp;
var recognition;

var stateEnum = {
	INITIAL : 0,
	TASKID : 1,
	ATTENDANCE : 2,
	GRADE : 3,
	GRADE_ENTERED : 4,
	ERROR_REPEAT : 5,
	ERROR_GRADEFORMAT: 6,
	GRADE_FINISHED : 7
};

var state = stateEnum.INITIAL;

//test roster, will be obtained from user in reality
var roster = [new student('Joe', 'Smith', 1),new student('Kristy', 'Boyer', 2),
				new student('Christopher', 'Fox', 3)];

function student(firstname, lastname, id) {
	this.firstname = firstname;
	this.lastname = lastname;
	this.id = id;
	this.value = 0;
}

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
	  
	  //get and display roster
	  var table = document.getElementById("gradeTable");	  
	  for(var i = 0; i < roster.length; i++) {
	  		var student = roster[i];
			row=table.insertRow(i+1);
			cell1=row.insertCell(0);
			cell2=row.insertCell(1);
			cell3=row.insertCell(2);
			cell4 = row.insertCell(3);
			cell1.innerHTML=student.lastname;
			cell2.innerHTML=student.firstname;
			cell3.innerHTML=student.id;
			cell4.innerHTML=" ";

	  }
	  


	  speak('Welcome to Teacher\'s Helper.  We can now begin entering grades.', false);
	  state=stateEnum.GRADE;
	  speak('Please say a grade in the format: id received grade, as in 1 received 85', true);
	  
	  state=stateEnum.TASKID;

	  
	  
	  recognition.onstart = function() {
	    recognizing = true;
	    document.getElementById('message').innerHTML = "Started";
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
	    document.getElementById('transcript').innerHTML += "User: "+final_transcript + "</br>";
	    if(state != stateEnum.ATTENDANCE) {
	    	gradebookDialogue.handleInput();
	    }
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
	        document.getElementById('input').innerHTML = final_transcript;
	      } else {
	        interim_transcript += event.results[i][0].transcript;
	      }
	    }
	};
}

//accepts the string to say and whether to start accepting input after speaking
function speak(text, readyForInput) {
	recognition.stop();
	var u = new SpeechSynthesisUtterance();
	u.text=text;
	u.onend=function(event) {
			document.getElementById('message').innerHTML = "In on end";
			recognition.start();
		};
	speechSynthesis.speak(u);
	document.getElementById('transcript').innerHTML += "Helper: "+text + "</br>";
	console.log('stuff logged');

}

}
//	INITIAL : 0,
//	TASKID : 1,
//	ATTENDANCE : 2,
//	GRADE : 3,
//	ATTENDANCE_ENTERED : 4,
//	ERROR_ATTENDANCEFORMAT: 5,
//	ERROR_STUDENT_INCORRECT: 6,
//	ERROR_ATTENDANCE_INCORRECT: 7,
//	ATTENDANCE_FINISHED : 8

var tempID;
var tempAttendance;
var absentStudents = new Array();

var rows = document.getElementsByTagName("tr");
var rollIndex=2;
var currentCells;
var name;

//source: http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript/
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!

var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;

var attenEnums = {
    WAIT_FOR_ROLL: 30,
    ERROR: 31,
    START: 2,
    CALL_ROLL: 33,
    GET_ABSENT: 34,
    FINISHED_GETTING_ABSENT: 35,
    CONFIRM_ABSENT: 36, 
	COMPLETE: 37,
	ROLL_RESPONSE: 38
    };

function handleAttendanceInput() {
	console.log('State: ' + state);
	switch(state)
	{
	    case stateEnum.ATTENDANCE:
			promptAttendance();
			break;
		case attenEnums.WAIT_FOR_ROLL:
			handleRollChoice();
			break;
		case attenEnums.CALL_ROLL:
			callRoll();
			break;
		case attenEnums.ROLL_RESPONSE:
			handleRollResponse();
			break;
		case attenEnums.GET_ABSENT:
			getAbsent();
			break;
		case attenEnums.FINISHED_GETTING_ABSENT:
			finishedGettingAbsent();
			break;
		case attenEnums.CONFIRM_ABSENT:
			confirmAbsent();
			break;
		default:
	}
	return;
}

function promptAttendance() {
    console.log('Attendance works!');
    speakThenStart('Would you like me to call roll?');
    state = attenEnums.WAIT_FOR_ROLL;
    return;
}

function handleRollChoice() {
	if(matchYes()) {
		state = attenEnums.CALL_ROLL;
		speak('Okay, I will call roll. Students, please say here when your name is called. If a student is absent, please say absent when their name is called');
		handleAttendanceInput();
	} else {
		speakThenStart('Who is absent? Please list the student IDs');
		state = attenEnums.GET_ABSENT;
	}
}

function getAbsent() {
	var input = final_transcript.trim().split(' ');
	for(var i = 0; i < input.length; i++) {
		//if this word is a number, see if it is an id
		if(input[i].match(/\d+/) != null) {
			var idFound = false;
			
			for(var j = 2; j < rows.length; j++) {
				var cells = rows[j].getElementsByTagName("td");
				console.log(cells[2].innerHTML + ', ' + input[i]);
				if(cells[2].innerHTML == input[i]) {
					idFound = true;
					cells[3].innerHTML = 0;
					var name = cells[1].innerHTML + ' ' + cells[0].innerHTML;
					absentStudents.push(name);
					break;
				}
			}
		}
	}
	state = attenEnums.FINISHED_GETTING_ABSENT;
	handleAttendanceInput();
}

function finishedGettingAbsent() {
	state = attenEnums.CONFIRM_ABSENT;
	if(absentStudents.length > 0) {
		speak('I marked ' + absentStudents.toString() + 'absent' );
		speakThenStart('Did I miss anyone?');
	} else {
		speakThenStart('So, no one is absent?' );
	}
}

function confirmAbsent() {
	//just asked 'did i miss anyone?'
	if(absentStudents.length > 0) {
		if(matchYes()) {
			speakThenStart('Who is absent? Please list the student IDs');
			state = attenEnums.GET_ABSENT;
		} else {
			fillHundreds();
			speak('Your attendance is complete. Thank you for using Teacher\'s helper');
		}
	} 
	//just assked 'so, no one is absent?'
	else {
		if(matchYes()) {
			fillHundreds();
			speak('Great. Your attendance is complete');
		} else {
			speakThenStart('Who is absent? Please list the student IDs');
			state = attenEnums.GET_ABSENT;
		}
	}
}

function fillHundreds() {
			
	for(var i = 2; i < rows.length; i++) {
		var cells = rows[i].getElementsByTagName("td");
		if(cells[3].innerHTML != '0') {
			cells[3].innerHTML = '100';
		}
	}
}

function callRoll() {
	console.log(rows.length);
	currentCells = rows[rollIndex].getElementsByTagName("td");
	name = currentCells[1].innerHTML + ' ' + currentCells[0].innerHTML;
	state = attenEnums.ROLL_RESPONSE;
	
	speakThenStart(name);
}

function handleRollResponse() {
	console.log('handling response');
	if(matchHere()) {
		currentCells[3].innerHTML = '100';
	} else {
		currentCells[3].innerHTML = '0';
		absentStudents.push(name);		
	}
	
	if(rollIndex < rows.length-1) {
		rollIndex++;
		state = attenEnums.CALL_ROLL;
		
	} else {
		state = attenEnums.FINISHED_GETTING_ABSENT;
	}
	
	handleAttendanceInput();
}



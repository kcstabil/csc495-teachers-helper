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

var numAttendanceAdded = 0;

//source: http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript/
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!

var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;

var attenEnums = {
    WAIT_FOR_ROLE: 30,
    ERROR: 31,
    START: 2,
    CALL_ROLE: 33,
    GET_ABSENT: 34,
	COMPLETE: 35
    };

function handleAttendanceInput() {
	console.log('State: ' + state);
	switch(state)
	{
	    case stateEnum.ATTENDANCE:
			promptAttendance();
			break;
		case attenEnums.WAIT_FOR_ROLE:
			handleRoleResponse();
			break;
		case attenEnums.CALL_ROLE:
			callRole();
			break;
		case attenEnums.GET_ABSENT:
			getAbsent();
			break;
		default:
	}
	return;
}

function promptAttendance() {
    console.log('Attendance works!');
    speakThenStart('Would you like me to call role?');
    state = attenEnums.WAIT_FOR_ROLE;
    return;
}

function handleRoleResponse() {
	if(matchYes()) {
		state = attenEnums.CALL_ROLE;
		attendanceHandler();
	} else {
		speakThenStart('Who is absent? Please list the student IDs');
		state = attenEnums.GET_ABSENT;
	}
}

function getAbsent() {
	var input = final_transcript.trim().split(' ');
	var numAbsent = 0;
	for(var i = 0; i < input.length; i++) {
		//if this word is a number, see if it is an id
		if(input[i].match(/\d+/) != null) {
			var idFound = false;
			var rows = document.getElementsByTagName("tr");
			
			for(var j = 2; j < rows.length; j++) {
				var cells = rows[j].getElementsByTagName("td");
				console.log(cells[2].innerHTML + ', ' + input[i]);
				if(cells[2].innerHTML == input[i]) {
					console.log('should add 0');
					idFound = true;
					cells[3].innerHTML = 0;
					break;
				}
			}
			
			if(idFound) {
				numAbsent++;
			}
		}
	}
	state = attenEnums.FINISHED_GETTING_ABSENT;

}


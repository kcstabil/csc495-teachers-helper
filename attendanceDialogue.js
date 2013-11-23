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
    START_ATTENDANCE : 2,
    ATTENDANCE_ERROR: 1,
    ATTENDANCE_WAITING: 0,
	ATTENDANCE_COMPLETE: 3,
    };

function handleAttendanceInput() {
	console.log('State: ' + state);
	switch(state)
	{
	    case stateEnum.ATTENDANCE:
			promptAttendance();
			break;
		default:
	}
	return;
}

function promptAttendance() {
    console.log('Attendance works!');
    return;
}


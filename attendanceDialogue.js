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

var attenEnums = {
    ATTENDANCE : 0,
    ATTENDANCE_ERROR: 1,
    

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


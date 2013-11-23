//	INITIAL : 0,
//	TASKID : 1,
//	ATTENDANCE : 2,
//	GRADE : 3,
var timesAsked = 0;

function decisionHandler() {
    console.log('Am I a decision?');
    switch (state)
   { 
        case stateEnum.INITIAL:
            promptGradeAtten();
            break;
        case stateEnum.ATTENDANCE:
            handleAttendanceInput();
            break;
        case stateEnum.GRADE:
            handleGradeInput();
            break;
        default:
            promptError();
    }
}

function promptGradeAtten() {
    timesAsked++;
    console.log('checking to see if grade or attendance');
    var input = final_transcript.trim().split(' ');
    var grade = false;
    var atten = false;
    var gradeWords = ["grade", "grades"];
    var attendanceWords = ["attendance", "roll"]

    for (i = 0; i < input.length; i++) {
        if (gradeWords.indexOf(input[i]) > -1) {
            grade = true;
            console.log('grade true');
        }
        if (attendanceWords.indexOf(input[i]) > -1) {
            atten = true;
            console.log('attendance true');
        }
    }

    if (grade == true && atten == false) {
        state = stateEnum.GRADE;
        decisionHandler();
    } else if (grade == false && atten == true) {
        state = stateEnum.ATTENDANCE;
        decisionHandler();
    } else {
        if (timesAsked <= 3) {
            errorGradeAtten();
        } else {
            gradeAttenAskedTooMany();
        }
    }
}

// error called if system did not understand if user asked for grade or attendance
function errorGradeAtten() {
    speakThenStart('I\'m sorry!  I did not understand what you said.  Did you want to check attendance or enter grades?');
}

function gradeAttenAskedTooMany() {
    speakThenStart('I am having a hard time understanding what you said.  Would you like to check attendance?');

    if (matchYes()) {
        state = stateEnum.ATTENDANCE;
        handleAttendanceInput();
    }

    speakThenStart('Ok, so you do not want to check attendance.  Would you like to enter grades?');
    
    if (matchYes()) {
        state = stateEnum.GRADE;
        handleGradeInput();
    }

}
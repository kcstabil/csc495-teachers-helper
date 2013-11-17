//	INITIAL : 0,
//	TASKID : 1,
//	ATTENDANCE : 2,
//	GRADE : 3,
//	GRADE_ENTERED : 4,
//	ERROR_BOTH_INCORRECT : 5,
//	ERROR_GRADEFORMAT: 6,
//	ERROR_STUDENT_INCORRECT: 7,
//	ERROR_GRADE_INCORRECT: 8,
//	GRADE_FINISHED : 9

var tempID;
var tempGrade;

var numGradesAdded = 0;

function handleGradeInput() {
	console.log('State: ' + state);
	switch(state)
	{
		case stateEnum.GRADE:
			promptGrade();
			break;
		case stateEnum.GRADE_ENTERED:
			gradeHandler();
			break;
		case stateEnum.ERROR_BOTH_INCORRECT:
			gradeErrorHandler();
			break;
		case stateEnum.ERROR_GRADEFORMAT:
			gradeErrorHandler();
			break;
		case stateEnum.ERROR_STUDENT_INCORRECT:
			promptForStudent();
			break;
		case stateEnum.INPUT_STUDENT:
			processStudentInput();
			break;
		case stateEnum.ERROR_GRADE_INCORRECT:
			promptForGrade();
			break;
		case stateEnum.INPUT_GRADE:
			processGradeInput();
			break;
		case stateEnum.GRADE_FINISHED:
			finalizeGrade();
			break;
		case stateEnum.GRADEBOOK_FINISHED:
			promptEnd();
			break;
		default:
	}
	return;
}

function gradeHandler() {
	var input = final_transcript.trim().split(' ');
	gradeCorrect = false;
	studentCorrect = false;
	
	console.log(final_transcript + ", length " + input.length);
	
	if (input.length == 3) {
		if (input[0].match(/\d+/) != null) {
			tempID = input[0];
			studentCorrect = true;
		}
		
		if (input[2].match(/\d+/) != null) {
			tempGrade = input[2];
			gradeCorrect = true;
		}
		
		if(gradeCorrect && studentCorrect) {
			state = stateEnum.GRADE_FINISHED;
		}
		else if(gradeCorrect && !studentCorrect) {
			state = stateEnum.ERROR_STUDENT_INCORRECT;
		}
		else if(!gradeCorrect && studentCorrect) {
			state = stateEnum.ERROR_GRADE_INCORRECT;
		}
		else {
			state = stateEnum.ERROR_BOTH_INCORRECT;
		}

		
	} else {
		state = stateEnum.ERROR_GRADEFORMAT;
		
	}
	handleGradeInput();
}

function gradeErrorHandler() {
	speak('Sorry we did not understand.');
	state = stateEnum.GRADE;
	handleGradeInput();
}

function promptGrade() {
	speakThenStart('Please enter a grade in the format id space grade');
	state = stateEnum.GRADE_ENTERED;

}

function finalizeGrade() {
	
	console.log('finalizing ' + tempID+ ', ' + tempGrade);
	var idFound = false;
	var rows = document.getElementsByTagName("tr");
	for(var i = 1; i < rows.length; i++) {
		var cells = rows[i].getElementsByTagName("td");
		if(cells[2].innerHTML == tempID) {
			idFound = true;
			cells[3].innerHTML = tempGrade;
			break;
		}
	}
		
	if(idFound) {
		numGradesAdded++;
		if(numGradesAdded < roster.length) {
			state = stateEnum.GRADE_ENTERED;
		} else {
			state = stateEnum.GRADEBOOK_FINISHED;
			handleGradeInput();
		}
	}
	else {
		state = stateEnum.ERROR_STUDENT_INCORRECT;
		handleGradeInput();
	}
}

function promptEnd() {
	speak('Your grade book for this assignment is complete.  Thanks for using Teacher\'s Helper');
}

function promptForStudent() {
	speakThenStart('I\'m sorry.  Who received a grade of ' + tempGrade + '?');
	state = stateEnum.INPUT_STUDENT;
}

function promptForGrade() {
	speakThenStart('I\'m sorry.  What grade did ' + tempID + ' receive?');
	state = stateEnum.INPUT_GRADE;
}

function processStudentInput() {
	var input = final_transcript.split(' ');

	if (input[0].match(/\d+/) != null) {
		tempID = input[0];
		state = stateEnum.GRADE_FINISHED;
		
	} else {
		state = stateEnum.ERROR_STUDENT_INCORRECT;
	}		
	handleGradeInput();	
}

function processGradeInput() {
	var input = final_transcript.split(' ');

	if (input[0].match(/\d+/) != null) {
		tempGrade = input[0];
		state = stateEnum.GRADE_FINISHED;
		
	} else {
		state = stateEnum.ERROR_GRADE_INCORRECT;
	}		
	handleGradeInput();	
}



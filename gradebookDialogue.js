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
	console.log('Handle input in ' + state);
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
		case stateEnum.ERROR_GRADE_INCORRECT:
			promptForGrade();
			break;
		case stateEnum.GRADE_FINISHED:
			finalizeGrade();
			break;
		case stateEnum.GRADEBOOK_FINISHED:
			promptEnd();
			break;
		default:
			console.log(state);
	}
	return;
}

function gradeHandler() {
	var input = final_transcript.split(' ');
	gradeCorrect = false;
	studentCorrect = false;
	
	if (input.length == 3) {
		if (input[0].match(/\d+/) != null) {
			tempID = input[0];
			console.log('got id ' + tempID);
			studentCorrect = true;
		}
		
		if (input[2].match(/\d+/) != null) {
			tempGrade = input[2];
			console.log('got grade ' + tempGrade);
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
}

function finalizeGrade() {
	
	var idFound = false;
	var rows = document.getElementsByTagName("tr");
	for(var i = 1; i < rows.length; i++) {
		var cells = rows[i].getElementsByTagName("td");
		console.log('num cells' + cells.length);
		if(cells[2].innerHTML == tempID) {
			idFound = true;
			cells[3].innerHTML = tempGrade;
			break;
		}
	}
		
	if(idFound) {
		numGradesAdded++;
		if(numGradesAdded < roster.length) {
			state = stateEnum.GRADE;
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
	speak('Sorry we did not understand the student id.');
	state = stateEnum.GRADE;
	handleGradeInput();

}

function promptForGrade() {
	speak('Sorry we did not understand the grade.');
	state = stateEnum.GRADE;
	handleGradeInput();

}



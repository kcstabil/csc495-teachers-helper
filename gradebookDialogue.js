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
var tempAssignName;
var isEdit = false;
var numGradesAdded = 0;
var firsttime = true;

function handleGradeInput() {
	console.log('State: ' + state);
	switch(state)
	{
	    case stateEnum.GRADE:
	        if (firsttime) {
	            state = stateEnum.ASK_ASSIGNMENT;
	            firsttime = false;
	            handleGradeInput();
	        } else {
	            promptGrade();
	        }
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
	        promptEdit();
			break;
		case stateEnum.WAIT_FOR_EDIT:
	        handleEdit();
			break;
		case stateEnum.GET_EXPORT_RESPONSE:
			processExportResponse();
			break;
		case stateEnum.GET_FILE_NAME:
			processFileName();
			break;
		case stateEnum.END_SESSION:
			promptEnd();
			break;
	    case stateEnum.GRADE_EXPORT_EXCEL:
	        promptExport();
	        break;
	    case stateEnum.ASK_ASSIGNMENT:
	        promptForAssigment();
	        break;
	    case stateEnum.GET_ASSIGNMENT:
	        processAssignment();
	        break;
	    case stateEnum.CORRECT_ASSIGNMENT:
	        promptAssignmentConfirmation();
	        break;
	    case stateEnum.CHECK_ASSIGN_CORRECT:
	        processAssignmentConfirmation();
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
	    isEdit = false;
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
	}
	else if (input.length == 4) {
	    isEdit = true;
	    console.log('EDIT happened');
	    if (input[0].match('edit')) {
	        if (input[1].match(/\d+/) != null) {
	            tempID = input[1];
	            studentCorrect = true;
	        }

	        if (input[3].match(/\d+/) != null) {
	            tempGrade = input[3];
	            gradeCorrect = true;
	        }

	        if (gradeCorrect && studentCorrect) {
	            state = stateEnum.GRADE_FINISHED;
	        }
	        else if (gradeCorrect && !studentCorrect) {
	            state = stateEnum.ERROR_STUDENT_INCORRECT;
	        }
	        else if (!gradeCorrect && studentCorrect) {
	            state = stateEnum.ERROR_GRADE_INCORRECT;
	        }
	        else {
	            state = stateEnum.ERROR_BOTH_INCORRECT;
	        }
	    }
	    else {
	        state = stateEnum.ERROR_GRADEFORMAT;
	    }
	}
	else {
		state = stateEnum.ERROR_GRADEFORMAT;
	}
	handleGradeInput();
}

function gradeErrorHandler() {
	speak('Sorry I did not understand.');
	state = stateEnum.GRADE;
	handleGradeInput();
}

function promptGrade() {
	speakThenStart('Please enter a grade in the format id space grade or edit id space grade.');
	state = stateEnum.GRADE_ENTERED;
}

function finalizeGrade() {
	console.log('finalizing ' + tempID+ ', ' + tempGrade);
	var idFound = false;
	var emptyGrade = false;
	var rows = document.getElementsByTagName("tr");
	for(var i = 1; i < rows.length - 1; i++) {
		var cells = rows[i].getElementsByTagName("td");
		if(cells[2].innerHTML == tempID) {
		    idFound = true;
		    if (cells[3].innerHTML == ' ') {
		        emptyGrade = true;
		    }
			cells[3].innerHTML = tempGrade;
			break;
		}
	}
		
	if (idFound) {
	    if (emptyGrade == true) {
	        numGradesAdded++;
	    }
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

function promptExport() {
	speakThenStart('Your grade book is now complete.  Would you like to export to Excel? ');
	state = stateEnum.GET_EXPORT_RESPONSE;
}

function processExportResponse() {
	if(matchYes()) {
		speakThenStart('What is the name of the assignment?');
		state = stateEnum.GET_FILE_NAME;
	}
	else {
		state = stateEnum.END_SESSION;
		handleGradeInput();
	}
}

function processFileName() {
	var name = final_transcript;
	var table = document.getElementById('gradeTable');
	tableToExcel(gradeTable, name);
	state = stateEnum.END_SESSION;
	handleGradeInput();
}

function promptEnd() {
	speak('Thanks for using Teacher\'s Helper');
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

function promptEdit() {
	state = stateEnum.WAIT_FOR_EDIT;
    speakThenStart('Would you like to make any changes before finishing this assignment?');
}

function handleEdit() {
	if (matchYes()) {
        state = stateEnum.GRADE;
    } else {
        var min = 100;
        var max = 0;
        var average = 0;
        var median; 
        var rows = document.getElementsByTagName("tr");
        for (var i = 1; i < rows.length - 1; i++) {
            var cells = rows[i].getElementsByTagName("td");
            var temp = cells[3].innerHTML;
            console.log('Row ' + i + ' contains ' + temp);
            console.log('total: ' + average + '& cur val:' + temp  );
            average = Number(average) + Number(temp);
            
            if (min > temp) {
                min = temp;
            }
            if (max < temp) {
                max = temp;
            }
        }
        console.log('numgrades ' + numGradesAdded);
        average = average / numGradesAdded;

        speak('This assignment\'s ranged from a minimum of ' + min + ' to a maximum of ' + max + ' with an average of '  + average + '.');

        state = stateEnum.GRADE_EXPORT_EXCEL;
    }
    handleGradeInput();
}

function promptForAssigment() {
    state = stateEnum.GET_ASSIGNMENT;
    speakThenStart('What is the name of your assignment?');
}

function processAssignment() {
    tempAssignName = final_transcript;
    console.log(tempAssignName);
    state = stateEnum.CORRECT_ASSIGNMENT;
    handleGradeInput();
}

function promptAssignmentConfirmation() {
    state = stateEnum.CHECK_ASSIGN_CORRECT;
    speakThenStart('Is ' + tempAssignName + ' the correct name?');
}

function processAssignmentConfirmation() {
    if (matchYes()) {
        state = stateEnum.GRADE;
        var rows = document.getElementsByTagName("tr");
        var cells = rows[0].getElementsByTagName("th");
        cells[3].innerHTML = tempAssignName;
    } else {
        state = stateEnum.ASK_ASSIGNMENT;
        speak('Sorry for missunderstanding the name of the assignment.')
    }
    handleGradeInput();
}
function handleInput() {
	switch(state)
	{
		case 3:
		gradeHandler();
		break;
		case 6:
		gradeErrorHandler();
		break;
		default:
		console.log(state);
	}
	return;
}

function gradeHandler() {
	var input = final_transcript.spilt(' ');
	
	if (input.length == 3) {
		if (input[0].match(/\d+/) != null) {
			var tempId = input[0];
			console.log(tempId);
		}
	} else {
		state = stateEnum.ERROR_GRADEFORMAT;
		handleInput();
	}
}

function gradeErrorHandler() {
	speak("Sorry we did not understand that format.  Please use id recieved grade");
}
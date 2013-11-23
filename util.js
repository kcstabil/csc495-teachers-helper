var recognizing = false;
var final_transcript = '';
var start_timestamp;
var recognition;

var stateEnum = {
    INITIAL: 0,
    TASKID: 1,
    ATTENDANCE: 2,
    GRADE: 3,
    GRADE_ENTERED: 4,
    ERROR_BOTH_INCORRECT: 5,
    ERROR_GRADEFORMAT: 6,
    ERROR_STUDENT_INCORRECT: 7,
    INPUT_STUDENT: 8,
    ERROR_GRADE_INCORRECT: 9,
    INPUT_GRADE: 10,
    GRADE_FINISHED: 11,
    GRADEBOOK_FINISHED: 12,
    GET_EXPORT_RESPONSE: 13,
    GET_FILE_NAME: 14,
    END_SESSION: 15
};

var state = stateEnum.INITIAL;

//test roster, will be obtained from user in reality
var roster = [new student('Joe', 'Smith', 11), new student('Kristy', 'Boyer', 12),
				new student('Christopher', 'Fox', 13)];

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

        

        speakThenStart('Welcome to Teacher\'s Helper.  Would you like to take attendance or enter grades?');
        state = stateEnum.INITIAL;

        recognition.onstart = function () {
            recognizing = true;
            document.getElementById('message').innerHTML = "Started";
        };

        recognition.onerror = function (event) {
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

        recognition.onend = function () {
            recognizing = false;
            document.getElementById('message').innerHTML = "Recognition ended";
        };

        recognition.onresult = function (event) {
            var interim_transcript = '';
            if (typeof (event.results) == 'undefined') {
                recognition.onend = null;
                recognition.stop();
                document.getElementById('message').innerHTML = "Recognition is not supported by your browser";
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript = event.results[i][0].transcript;
                    document.getElementById('input').innerHTML = final_transcript;
                    document.getElementById('transcript').innerHTML += "User: " + final_transcript + "</br>";
                    
                    if (state == stateEnum.ATTENDANCE || state >= 30 ) {
                        console.log('State:' + state)
                        handleAttendanceInput();
                    } 
                    else if (state >= stateEnum.GRADE) {
                        console.log('State: ' + state);
                        handleGradeInput();
                    } else {
                    	console.log('State:' + state)
                        decisionHandler();

					} 

                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
        };
    }
}

//says the string sent in the parameter
function speak(text) {
    recognition.stop();
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    speechSynthesis.speak(u);
    document.getElementById('transcript').innerHTML += "Helper: " + text + "</br>";
}

//says the string sent in the parameter and then starts recognition
function speakThenStart(text) {
    recognition.stop();
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.onend = function (event) {
        document.getElementById('message').innerHTML = "In on end";
        recognition.start();
    };
    u.onerror = function (event) {
        document.getElementById('message').innerHTML = "In on error";
        recognition.start();
    };

    speechSynthesis.speak(u);
    document.getElementById('transcript').innerHTML += "Helper: " + text + "</br>";
}

// returns whether a user said yes
function matchYes() {
    var yesWords = ["yes", "yep", "okay", "yeah", "affermative", "verily", "correct", "sure"];
    var yes = false;
    var input = final_transcript.toLowerCase().trim().split(' ');

    for (i = 0; i <= yesWords.length; i++) {
        if (yesWords.indexOf(input[i]) > -1) {
            yes = true;
        }
    }
    return yes;
}
//countUpTimer
//Oliver Hickman 2018

autowatch = 1;
inlets = 3;
outlets = 5;

var incrementSpeed = jsarguments[1];

var time = {
  "accum": 0,
  "minutes": 0,
  "seconds": 0,
  "partialSeconds": 0
}


//===========timer logic and functions==========//
function convertAccumTimeToMinutes() {
  if (time.accum >= 60) {
    time.minutes = Math.floor(time.accum / 60)
    outlet(0, time.minutes);
  } else {
    time.minutes = 0;
    outlet(0, time.minutes);
  }
}

function convertAccumTimeToSeconds() {
    var minutesInSeconds = time.minutes * 60;
    var rawSeconds = time.accum - minutesInSeconds;
    time.seconds = Math.floor(rawSeconds);
    time.partialSeconds = (rawSeconds - time.seconds);
    outlet(1, time.seconds);
    outlet(2, time.partialSeconds);
}


//===========timer formatting==========//
function padSeconds(seconds, length) {
  //trailing zeros first
  seconds = seconds.toString();
  var numLen = seconds.length
  if(numLen <= 2){
    seconds = seconds + ".00";
  } else if (numLen == 3 || numLen == 4) {
    seconds = seconds + "0";
  }
  //then do leading zeros
  numLen = seconds.length;
  if (numLen == 4){
    seconds = "0" + seconds;
  }
  return seconds;
}

function formattedTimeString(){
  var combinedSeconds = Math.round((time.seconds + time.partialSeconds)*100)/100;
  combinedSeconds.toFixed(2);
  combinedSeconds = padSeconds(combinedSeconds, 3);
  var formattedTime = time.minutes + ":" + combinedSeconds;
  outlet(4, formattedTime);
}


//===========timer==========//
function countUp() {
  arguments.callee.task.interval = incrementSpeed;
  var incrementAmount = incrementSpeed/1000;
  time.accum += incrementAmount;

  convertAccumTimeToMinutes();
  convertAccumTimeToSeconds();
  outlet(3, time.accum)
  formattedTimeString();
}
var timer = new Task(countUp, this);


//===========timer controls==========//
function msg_int(input) {
  //start and stop the timer
  if (inlet == 0) {
    if (input == 1) { timer.repeat() ;}
    else { timer.cancel(); }
  }
  //starting place
  else if (inlet == 1) {
    time.accum = input * 60;
    convertAccumTimeToMinutes();
  }
  else if (inlet == 2) {
    time.seconds = input;
    time.accum = (time.minutes*60) + input;
    convertAccumTimeToSeconds();
  }
}
//reset the counter
function bang() {
  for (timeChunk in time) {
    time[timeChunk] = 0;
  }
  for (i=0; i<this.outlets; i++) {
    outlet(i, 0);
  }
}

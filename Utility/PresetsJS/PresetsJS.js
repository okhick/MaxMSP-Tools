autowatch = 1;

var preset = "";
var lastIn = 0;
outlets = 2;

//simple interpolating function
function interp(valueNow, valueNext, interpAmount) {
  var range = valueNext - valueNow;
      interpAdder = range * interpAmount;
      newNow = valueNow + interpAdder;
  return newNow.toFixed(3);
}

//load and parse the JSON preset file
function path(path) {
  var string = "";
	    //filename = "/Volumes/MacintoshHD/Music/Max/Tools/Utility/PresetsJS/x.json";
      filename = path;
	    access = "read";
	    typelist = new Array("JSON");
	f = new File(filename, access, typelist);

	while(f.isopen && f.position < f.eof) {
		string += f.readline();
	}

	f.close();
  preset = JSON.parse(string);
	post("New presets loaded! \n")
}

//input desired preset
function msg_float(f) {

  var interpObjects = preset.interpObjects;
  var outerArr = [];
  var changeFlag = false; //change flag to indicate of the object has been interplated
  var presetNum = Math.floor(f);

  //Loop through the params every input
  for (var key in preset) {
    var presetKey = preset[key];
    //interpolate everything that needs to be intepolated
    for (i = 0; i < interpObjects.length; i++) {

      if (interpObjects[i] == key) {
        var valueNow = presetKey[presetNum];
        var valueNext = 0;
        if (presetNum != presetKey.length - 1) {
          valueNext = presetKey[presetNum + 1];
        }
        else {
          valueNext = presetKey[presetNum];
        }

        var interpAmount = f - presetNum;

        var interped = interp(valueNow, valueNext, interpAmount);
        outerArr.push(key + " " + interped);
        changeFlag = true;
        }
      }
      //if it hasn't been interpolated
    if (changeFlag == false) {
      outerArr.push(key + " " + preset[key][presetNum]);
    } else {
      changeFlag = false;
    }
  }
  //bang if preset changes
  if (presetNum != lastIn) {
    outlet(0, "bang");
    lastIn = presetNum;
  }
  //send a value to each Max object
  for (i = 0; i < outerArr.length; i++) {
    var outgoing = outerArr[i].split(" ");
    messnamed(outgoing[0], parseFloat(outgoing[1]));
  }

  //raw dump
  outerArr.shift();
  outlet(1, outerArr);
}

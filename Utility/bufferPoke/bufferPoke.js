autowatch=1;
//BY OLIVER HICKMAN 2018

//This code will update buffer data that in pattr storage which is helpful for getting data in and
//out of Gen~ patchers. This code shouldn't have to change much. Just update the JSON with the
//correct data. The top level keys (buffer1, buffer2, buffer[i]) are needed. The "name" is the
//name of the buffer in Max; likewise for length. The "pattrList" are the associated pattr values
//for that buffer in order.

//create an object with the instatitated buffers needed for the project
var bufferInstance = {};
function createBufferObjects(bufferList){
  var i = 1;
  for (var key in bufferList) {
    var thisBuffer = "buffer" + (i);
    bufferInstance[thisBuffer] = new Buffer(bufferList[thisBuffer].name);
    i++;
  }
}

//load and parse the JSON preset file
var bufferList = "";
function path(path) {
  var string = "";
	    //filename = "/Volumes/MacintoshHD/Music/Max/Tools/Utility/nameList.json";
      filename = path;
	    access = "read";
	    typelist = new Array("JSON");
	f = new File(filename, access, typelist);

	while(f.isopen && f.position < f.eof) {
		string += f.readline();
	}

	f.close();
  bufferList = JSON.parse(string);
  createBufferObjects(bufferList);

	post("New data loaded! \n")
}

//when there's a change, go through each buffer and the pattr associated with it to updated all values
var pattrStorage = this.patcher;
function bang() {
  for(var key in bufferList){

    var thisBuffer = bufferList[key];//the JSON buffer data
    var realBuffer = bufferInstance[key];//the buffer in the patch

    for(i=0; i<thisBuffer.length; i++) {
      var pattrKey = pattrStorage.getnamed(thisBuffer.pattrList[i]); //get the key for pattr
      var pattrData = pattrKey.getvalueof(); //use the key to get the data from pattr
      realBuffer.poke(1, i, pattrData);
    }
  }
  post("Updated Buffers! \n");
}

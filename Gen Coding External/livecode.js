outlets = 2;
var filename = "___";

function bang() {
	sourcefile = new File(filename);
	sourcefile.open();
	var code = sourcefile.readstring(sourcefile.eof);
	outlet(0, "expr", code);
	outlet(1, "bang");
	sourcefile.close();
}

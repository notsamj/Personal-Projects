const fs = require("fs");
const JSFile = require("./js_file.js");
const Lock = require("./lock.js");

async function run(){
	/*
		Reading command line arguments

		Three cases here
		1. Command line arguments contain input and output folders
			Set input folder to argv[2]
			Set output folder to argv[3]
		2. Command line arguments contain input folder
			Set input folder to argv[2]
			Set output folder to argv[2]
		3. Command line arguments contain no input or output folders
			Set input folder to "./"
			Set output folder to "./"
	*/

	let numArgs = process.argv.length;
	let inputFolderRPath = "./";
	let outputFolderRPath = "./";
	// If case 1
	if (numArgs == 4){
		inputFolderRPath = process.argv[2];
		outputFolderRPath = process.argv[3];
	}
	// If case 2
	else if (numArgs == 3){
		inputFolderRPath = process.argv[2];
		outputFolderRPath = process.argv[2];
	}
	// case 3 is the default

	// Read files
	let jsFiles = await readJSFiles(inputFolderRPath);

	// Analyze files
	analyzeJSFiles(jsFiles);

	// Write files
	writeJSFiles(outputFolderRPath, jsFiles)
}

async function readJSFiles(rPath){
	let readLock = new Lock();
	readLock.lock();
	let readFiles;
	let readingError;
	let filesInFolderAtPath = fs.readdir(rPath, (error, files) => {
		readingError = error;
		readFiles = files;
		readLock.unlock();
	});

	// Wait for the reading to finish
	await readLock.awaitUnlock();

	let gotAnError = readingError != null;
	if (gotAnError){
		console.error("Received an error reading folder: " + rPath + "\n", readingError);
		process.exit(1);
	}
	// Else no error
	
	console.log("readFiles", readFiles);
}

function analyzeJSFiles(jsFiles){
	// TODO
}

function writeJSFiles(outputFolderRPath, jsFiles){
	// TODO
}


// Run on start up
run();
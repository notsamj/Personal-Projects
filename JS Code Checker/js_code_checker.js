const fs = require("fs");
const JSFile = require("./js_file.js");
const Lock = require("./lock.js");
const doesFolderExist = require("./helper_functions.js").doesFolderExist;

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
	writeJSFiles(inputFolderRPath.length, outputFolderRPath, jsFiles);
}

async function readJSFiles(rPath){
	let readLock = new Lock();
	readLock.lock();
	let fileNames;
	let readingError;
	fs.readdir(rPath, (error, files) => {
		readingError = error;
		fileNames = files;
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

	let jsFileRegex = /^[a-zA-Z_0-9]+\.js$/;
	let jsFiles = [];
	for (let fileName of fileNames){
		// If folder exists then get al js files
		if (doesFolderExist(rPath + fileName + "/")){
			let jsFilesInDir = await readJSFiles(rPath + fileName + "/");
			for (let jsFile of jsFilesInDir){
				jsFiles.push(jsFile);
			}
		}
		// Else its a file
		
		// If JS File -> Read
		if (jsFileRegex.test(fileName)){
			jsFiles.push(JSFile.read(fileName, rPath));
		}
	}
	return jsFiles;
}

function analyzeJSFiles(jsFiles){
	for (let jsFile of jsFiles){
		console.log(jsFile.getFileName());
		jsFile.handleComments();
	}
}

function writeJSFiles(inputFolderRPathLength, outputFolderRPath, jsFiles){
	for (let jsFile of jsFiles){
		jsFile.writeToOutputFolder(inputFolderRPathLength, outputFolderRPath);
	}
}



// Run on start up
run();
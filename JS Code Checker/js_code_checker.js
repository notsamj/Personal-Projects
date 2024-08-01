const fs = require("fs");
const JSFile = require("./js_file.js");
const Lock = require("./lock.js");
const doesFolderExist = require("./helper_functions.js").doesFolderExist;
const NSLog = require("./ns_log.js");
const multiplyString = require("./helper_functions.js").multiplyString;

async function run(){
	/*
		Reading command line arguments

		argv[0] node
		argv[1] js_code_checker.js
		argv[2] $input_file_name
		argv[3] $output_file_name
		argv[4] $preset_name
	*/
	let settingsJSON = await JSON.parse(fs.readFileSync("settings.json"));
	let settings = settingsJSON["presets"]["default"];
	let numArgs = process.argv.length;

	// if wrong number of args
	if (numArgs != 5){
		console.error("Invalid arguments received. Please see README.md");
		return;
	}

	let inputFolderRPath = process.argv[2];
	let outputFolderRPath = process.argv[3];
	let preset = process.argv[4];

	// Update settings to preset
	for (let key of Object.keys(settingsJSON["presets"][preset])){
		settings[key] = settingsJSON["presets"][preset][key];
	}

	// Read files
	let jsFiles = await readJSFiles(inputFolderRPath);

	// Modify files
	modifyJSFiles(jsFiles, settings);

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

function modifyJSFiles(jsFiles, settings, nsLog){
	nsLog.writeAtBeginning(multiplyString('-', 5) + "Summary" + multiplyString('-', 5));
	let summaryStats = new Stats();
	// TODO
	for (let jsFile of jsFiles){
		jsFile.handleComments();
		jsFile.updateConsoleLogs();
		if (settings["remove_console_logs"]){
			jsFile.removeOldConsoleLogs();
		}

		// Stats
	}
	let summaryString = 
}

function writeJSFiles(inputFolderRPathLength, outputFolderRPath, jsFiles, nsLog){
	for (let jsFile of jsFiles){
		jsFile.writeToOutputFolder(inputFolderRPathLength, outputFolderRPath);
	}
	nsLog.saveToFile();
}



// Run on start up
run();
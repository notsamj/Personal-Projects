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

	// Collect and log DataCollector
	collectAndLogDataCollector(jsFiles, settings);

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

function modifyJSFiles(jsFiles, settings){
	for (let jsFile of jsFiles){
		jsFile.handleComments();
		jsFile.updateConsoleLogs();
		if (settings["remove_console_logs"]){
			jsFile.removeOldConsoleLogs();
		}
		jsFile.countStatements();
		jsFile.checkTODOs();
	}
}

function collectAndLogDataCollector(jsFiles, settings){
	let log = new NSLog();
	let numDashesPerSide = 5;

	let totalFunctionCommentsAdded = 0;
	let totalMethodCommentsAdded = 0;
	let totalClassCommentsAdded = 0;
	let totalLineReferencingConsoleLogsUpdated = 0;
	let totalOldConsoleLogsRemoved = 0;
	let totalNumberOfStatements = 0;
	let totalTodosFound = 0;

	// Log details per file
	for (let jsFile of jsFiles){
		let fileDataCollector = jsFile.getDataCollector();

		// Unimportant DataCollector
		let numberOfStatements = fileDataCollector.getDataValue("number_of_statements");

		// Important DataCollector
		let fCommentsAdded = fileDataCollector.getDataValue("f_comments_added");
		let mCommentsAdded = fileDataCollector.getDataValue("m_comments_added");
		let cCommentsAdded = fileDataCollector.getDataValue("c_comments_added");
		let lineReferencingConsoleLogsUpdated = fileDataCollector.getDataValue("l_r_console_logs_updated");
		let oldConsoleLogsRemoved = fileDataCollector.getDataValue("old_console_logs_removed");
		let todosFound = fileDataCollector.getDataValue("total_todo_count");

		// Update total DataCollector
		totalNumberOfStatements += numberOfStatements;
	
		let sumOfChanges = fCommentsAdded + mCommentsAdded + cCommentsAdded + lineReferencingConsoleLogsUpdated + oldConsoleLogsRemoved + todosFound; 
		
		// Do not add to log if there are no changes
		if (settings["ignore_file_with_zero_changes_in_log"] && sumOfChanges == 0){
			continue;
		}

		totalFunctionCommentsAdded += fCommentsAdded;
		totalMethodCommentsAdded += mCommentsAdded;
		totalClassCommentsAdded += cCommentsAdded;
		totalLineReferencingConsoleLogsUpdated += lineReferencingConsoleLogsUpdated;
		totalOldConsoleLogsRemoved += oldConsoleLogsRemoved; // Number will be zero if the setting is off so doesn't matter I'm adding it
		totalTodosFound += todosFound;

		// Write file name header
		log.write('\n' + multiplyString('-', numDashesPerSide) + " " + jsFile.getFileName() + " " + multiplyString('-', numDashesPerSide))
		
		// Write relative path from output folder
		log.write('\n' + "Relative path: " + jsFile.getRelativePath());

		// Write number of statements found
		log.write('\n' + "Number of statements: " + numberOfStatements.toString());

		// Write number of function comments added
		log.write('\n' + "Number of function comments added: " + fCommentsAdded.toString());

		// Write number of method comments added
		log.write('\n' + "Number of method comments added: " + mCommentsAdded.toString());

		// Write number of class comments added
		log.write('\n' + "Number of class comments added: " + cCommentsAdded.toString());

		// Write number of line-referencing console.logs updated
		log.write('\n' + "Number of line-referencing console.logs updated: " + lineReferencingConsoleLogsUpdated.toString());

		if (settings["remove_console_logs"]){
			// Write number of old console.logs removed
			log.write('\n' + "Number of old console.logs removed: " + oldConsoleLogsRemoved.toString());
		}

		// Write number of todos
		log.write('\n' + "Number of todos found: " + totalTodosFound.toString());
		
		// Go through the TODOs

		// Single line todos
		let singleLineTODOs = this.dataCollector.getValue("single_line_todos");
		for (let todoDataJSON of singleLineTODOs){
			log.write('\n' + "Line " + todoDataJSON["line_number"] + ": " + todoDataJSON["todo_str"]);
		}

		// Multi line todos
		let multiLineTODOs = this.dataCollector.getValue("multi_line_todos");
		for (let todoDataJSON of multiLineTODOs){
			log.write('\n' + "Line " + todoDataJSON["line_number"] + ": " + todoDataJSON["todo_str"]);
		}
	}

	// Summary Details

	let summaryText = "";

	// Summary Title
	summaryText += multiplyString('-', numDashesPerSide) + " Summary " + multiplyString('-', numDashesPerSide);

	// Write number of statements found in files
	summaryText += '\n' + "Number of statements: " + totalNumberOfStatements.toString();

	// Write number of function comments added
	summaryText += '\n' + "Number of function comments added: " + totalFunctionCommentsAdded.toString();

	// Write number of method comments added
	summaryText += '\n' + "Number of method comments added: " + totalMethodCommentsAdded.toString();

	// Write number of class comments added
	summaryText += '\n' + "Number of class comments added: " + totalClassCommentsAdded.toString();

	// Write number of line-referencing console.logs updated
	summaryText += '\n' + "Number of line-referencing console.logs updated: " + totalLineReferencingConsoleLogsUpdated.toString();

	if (settings["remove_console_logs"]){
		// Write number of old console.logs removed
		summaryText += '\n' + "Number of old console.logs removed: " + totalOldConsoleLogsRemoved.toString();
	}

	// Write number of todos
	summaryText += '\n' + "Number of todos found: " + totalTodosFound.toString();

	log.writeAtBeginning(summaryText);

	if (settings["print_summary"]){
		console.log(summaryText);
	}

	log.saveToFile();
}

function writeJSFiles(inputFolderRPathLength, outputFolderRPath, jsFiles){
	for (let jsFile of jsFiles){
		jsFile.writeToOutputFolder(inputFolderRPathLength, outputFolderRPath);
	}
}



// Run on start up
run();
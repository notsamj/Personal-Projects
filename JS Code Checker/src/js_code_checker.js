const fs = require("fs");
const JSFile = require("./js_file.js");
const Lock = require("./lock.js");
const doesFolderExist = require("./helper_functions.js").doesFolderExist;
const NSLog = require("./ns_log.js");
const multiplyString = require("./helper_functions.js").multiplyString;
const listsEqual = require("./helper_functions.js").listsEqual;
const listContainsElement = require("./helper_functions.js").listContainsElement;
const NotSamLinkedSet = require("./notsam_linked_set.js");
/*
    Function Name: run
    Function Parameters: None
    Function Description: Runs the program
    Function Return: void
*/
async function run(){
    /*
        Reading command line arguments

        argv[0] node
        argv[1] js_code_checker.js
        argv[2] $input_file_relative_path
        argv[3] $output_file_relative_path
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

    // Perform additional analysis
    performAditionalAnalysis(jsFiles);

    // Collect and log data
    collectAndLogData(jsFiles, settings, outputFolderRPath);

    // Write files
    writeJSFiles(inputFolderRPath.length, outputFolderRPath, jsFiles);
}

/*
    Function Name: performAditionalAnalysis
    Function Parameters: 
        jsFiles:
            A list of JSFile objects
    Function Description: Performs some analysis on js files
    Function Return: void
*/
function performAditionalAnalysis(jsFiles){
    // Do some analysis
    for (let jsFile of jsFiles){
        jsFile.countStatements();
        jsFile.checkToDos();
        jsFile.identifyFunctionsCalled();
    }

    createDataOnFunctionUse(jsFiles);
}

/*
    Function Name: createDataOnFunctionUse
        jsFiles:
            A list of JSFile objects
    Function Description: Counts unused function declarations/definitions
    Function Return: void
*/
function createDataOnFunctionUse(jsFiles){
    let consolidatedFunctionCallSet = new NotSamLinkedSet();

    // Fill up the set with the name of all functions called
    for (let jsFile of jsFiles){
        let jsFileFunctionCallSet = jsFile.getFunctionsCalled();
        // Add all data from this files set to the total function call set
        for (let [functionName, index] of jsFileFunctionCallSet){
            consolidatedFunctionCallSet.add(functionName);
        }
    }

    // Tell js file to record number of uncalled functions it contains
    for (let jsFile of jsFiles){
        jsFile.findUnusedFunctions(consolidatedFunctionCallSet);
    }
}

/*
    Function Name: checkForAdditionalNSFeatures
    Function Parameters: 
        jsFiles:
            A list of JSFile objects
    Function Description: Checks for additional features such as interfaces and abstract classes
    Function Return: void
*/
function checkForAdditionalNSFeatures(jsFiles){
    let abstractClasses = [];
    let interfaces = [];
    let classesImplementingOrExtending = [];

    // Gather up all abstract classes, interfaces, or classes that implement/extend
    for (let jsFile of jsFiles){
        let nsRequirementData = jsFile.gatherNSRequirementData();
        for (let abstractClass of nsRequirementData["abstract_classes"]){
            abstractClasses.push(abstractClass);
        }
        for (let interface of nsRequirementData["interfaces"]){
            interfaces.push(interface);
        }
        for (let classExtendingOrImplementing of nsRequirementData["classes_extending_or_implementing"]){
            classesImplementingOrExtending.push(classExtendingOrImplementing);
        }
    }

    // Look through each interface
    for (let interfaceToCheck of interfaces){
        let interfaceName = interfaceToCheck["interface_name"];
        // Find all classes implementing the interface
        for (let classToCheck of classesImplementingOrExtending){
            let classToCheckDataCollector = classToCheck["file"].getDataCollector();
            let listOfViolations = classToCheckDataCollector.getValueOrSetTo("violations", []);
            let classImplementsInterface = false;
            for (let implementedInterfaceName of classToCheck["implements"]){
                if (implementedInterfaceName == interfaceName){
                    classImplementsInterface = true;
                    break;
                }
            }
            // If this class implements this interface
            if (classImplementsInterface){
                // Check all interface methods to see if class has them
                for (let methodObjectOfInterface of interfaceToCheck["methods"]){
                    let found = false;
                    let notFoundBecauseOfInvalidParameters = false;
                    for (let methodObjectOfClass of classToCheck["methods"]){
                        if (methodObjectOfInterface["method_name"] == methodObjectOfClass["method_name"]){
                            // If parameters don't match
                            if (!listsEqual(methodObjectOfInterface["method_parameters"], methodObjectOfClass["method_parameters"])){
                                notFoundBecauseOfInvalidParameters = true;
                                break;
                            }
                            found = true;
                        }
                    }
                    // If the expected Function isn't found
                    if (!found){
                        let violationString;
                        if (notFoundBecauseOfInvalidParameters){
                            violationString = "Function \"" + methodObjectOfInterface["method_name"] + "\" from interface \"" + interfaceToCheck["interface_name"] + "\" missing in class \"" + classToCheck["class_name"] + "\" due to parameter mismatch.";
                        }else{
                            violationString = "Function \"" + methodObjectOfInterface["method_name"] + "\" from interface \"" + interfaceToCheck["interface_name"] + "\" missing in class \"" + classToCheck["class_name"] + "\".";
                        }
                        listOfViolations.push(violationString);
                    }    
                }
            }
        }
    }

    // Check through each abstract class
    for (let abstractClassToCheck of abstractClasses){
        let abstractClassName = abstractClassToCheck["class_name"];
        // Find all classes extending the abstract class
        for (let classToCheck of classesImplementingOrExtending){
            let classToCheckDataCollector = classToCheck["file"].getDataCollector();
            let listOfViolations = classToCheckDataCollector.getValueOrSetTo("violations", []);
            let classExtendsAbstractClass = false;
            for (let extendedClassName of classToCheck["extends"]){
                if (extendedClassName == abstractClassName){
                    classExtendsAbstractClass = true;
                    break;
                }
            }
            // If this class extends this abstract class
            if (classExtendsAbstractClass){
                // Check all abstract class methods to see if class has them
                for (let methodObjectOfAbstractClass of abstractClassToCheck["methods"]){
                    let found = false;
                    let notFoundBecauseOfInvalidParameters = false;
                    let notFoundBecauseOfInvalidContents = false;
                    for (let methodObjectOfClass of classToCheck["methods"]){
                        if (methodObjectOfAbstractClass["method_name"] == methodObjectOfClass["method_name"]){
                            // If parameters don't match
                            if (!listsEqual(methodObjectOfAbstractClass["method_parameters"], methodObjectOfClass["method_parameters"])){
                                notFoundBecauseOfInvalidParameters = true;
                                break;
                            }
                            // Otherwise, if expecting an exact match, then check if the content strings match
                            else if (methodObjectOfClass["method_exact_match"] && methodObjectOfAbstractClass["method_contents_string"] != methodObjectOfClass["method_contents_string"]){
                                notFoundBecauseOfInvalidContents = true;
                                break;
                            }
                            found = true;
                        }
                    }
                    // If the expected Function isn't found
                    if (!found){
                        let violationString;
                        if (notFoundBecauseOfInvalidParameters){
                            violationString = "Function \"" + methodObjectOfAbstractClass["method_name"] + "\" from abstract class \"" + abstractClassToCheck["class_name"] + "\" missing in class \"" + classToCheck["class_name"] + "\" due to parameter mismatch.";
                        }else if (notFoundBecauseOfInvalidContents){
                            violationString = "Function \"" + methodObjectOfAbstractClass["method_name"] + "\" from abstract class \"" + abstractClassToCheck["class_name"] + "\" missing in class \"" + classToCheck["class_name"] + "\" due to content mismatch.";
                        }else{
                            violationString = "Function \"" + methodObjectOfAbstractClass["method_name"] + "\" from abstract class \"" + abstractClassToCheck["class_name"] + "\" missing in class \"" + classToCheck["class_name"] + "\".";
                        }
                        listOfViolations.push(violationString);
                    }    
                }

                // Now check the member variables
                for (let memberVariable of abstractClassToCheck["member_variables"]){
                    let variableFoundInSubClass = listContainsElement(classToCheck["member_variables"], memberVariable);
                    if (!variableFoundInSubClass){
                        let violationString = "Member variable \"" + memberVariable + "\" from abstract class \"" + abstractClassToCheck["class_name"] + "\" missing in class \"" + classToCheck["class_name"] + "\"."; 
                        listOfViolations.push(violationString);
                    }
                }
            }
        }
    }
}

/*
    Function Name: readJSFiles
    Function Parameters: 
        rPath:
            Relative path to the input folder
    Function Description: Reads all the js files in a folder
    Function Return: List of JSFile
*/
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

/*
    Function Name: modifyJSFiles
    Function Parameters: 
        jsFiles:
            List of JSFile
        settings:
            A JSON with settings information
    Function Description: Modifies each js file
    Function Return: void
*/
function modifyJSFiles(jsFiles, settings){
    for (let jsFile of jsFiles){
        jsFile.handleComments();
        jsFile.updateConsoleLogs();
        if (settings["remove_console_logs"]){
            jsFile.removeOldConsoleLogs();
        }
    }
}

/*
    Function Name: collectAndLogData
    Function Parameters: 
        jsFiles:
            List of JSFile
        settings:
            A JSON with settings information
        outputFolderRPath:
            String path to output folder
    Function Description: Collects and logs data about the js files
    Function Return: void
*/
function collectAndLogData(jsFiles, settings, outputFolderRPath){
    let log = new NSLog();

    // Check for ns-inferfaces, ns-extensions
    checkForAdditionalNSFeatures(jsFiles);

    let numDashesPerSide = 5;

    let totalFunctionCommentsAdded = 0;
    let totalMethodCommentsAdded = 0;
    let totalClassCommentsAdded = 0;
    let totalLineReferencingConsoleLogsUpdated = 0;
    let totalOldConsoleLogsRemoved = 0;
    let totalNumberOfStatements = 0;
    let totalTodosFound = 0;
    let totalViolationCount = 0;
    let totalUnusedFunctionCount = 0;

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
        let violations = fileDataCollector.getValueOrSetTo("violations", []);
        let violationsFound = violations.length;
        let unusedFunctionNames = fileDataCollector.getDataValue("unused_function_names");
        let unusedFunctionsFound = unusedFunctionNames.length;

        // Update total DataCollector
        totalNumberOfStatements += numberOfStatements;
    
        let sumOfChanges = fCommentsAdded + mCommentsAdded + cCommentsAdded + lineReferencingConsoleLogsUpdated + oldConsoleLogsRemoved + todosFound + violationsFound + unusedFunctionsFound; 
        
        // Do not add to log if there are no changes
        if (settings["ignore_file_with_zero_changes_in_log"] && sumOfChanges == 0){
            continue;
        }

        totalFunctionCommentsAdded += fCommentsAdded;
        totalMethodCommentsAdded += mCommentsAdded;
        totalClassCommentsAdded += cCommentsAdded;
        totalLineReferencingConsoleLogsUpdated += lineReferencingConsoleLogsUpdated;
        totalOldConsoleLogsRemoved += oldConsoleLogsRemoved; // Number will be zero if the setting is off so doesn't matter I'm adding it
        totalUnusedFunctionCount += unusedFunctionsFound;
        totalTodosFound += todosFound;
        totalViolationCount += violationsFound;

        // Write file name header
        log.write('\n' + multiplyString('-', numDashesPerSide) + " " + jsFile.getFileName() + " " + multiplyString('-', numDashesPerSide))
        
        // Write relative path from output folder
        log.write('\n' + "Relative path: " + jsFile.getRelativePath());

        // Write number of statements found
        log.write('\n' + "Number of statements: " + numberOfStatements.toString());

        // Write number of function comments added
        if (!settings["ignore_counters_with_zero_changes_in_log"] || fCommentsAdded > 0){
            log.write('\n' + "Number of function comments added: " + fCommentsAdded.toString());
        }

        // Write number of Function comments added
        if (!settings["ignore_counters_with_zero_changes_in_log"] || mCommentsAdded > 0){
            log.write('\n' + "Number of Function comments added: " + mCommentsAdded.toString());
        }

        // Write number of class comments added
        if (!settings["ignore_counters_with_zero_changes_in_log"] || cCommentsAdded > 0){
            log.write('\n' + "Number of class comments added: " + cCommentsAdded.toString());
        }

        // Write number of line-referencing console.logs updated
        if (!settings["ignore_counters_with_zero_changes_in_log"] || lineReferencingConsoleLogsUpdated > 0){
            log.write('\n' + "Number of line-referencing console.logs updated: " + lineReferencingConsoleLogsUpdated.toString());
        }

        if (settings["remove_console_logs"]){
            // Write number of old console.logs removed
            if (!settings["ignore_counters_with_zero_changes_in_log"] || oldConsoleLogsRemoved > 0){
                log.write('\n' + "Number of old console.logs removed: " + oldConsoleLogsRemoved.toString());
            }

        }

        // Write number of todos
        if (!settings["ignore_counters_with_zero_changes_in_log"] || todosFound > 0){
            log.write('\n' + "Number of todos found: " + todosFound.toString());
        }

        // Write number of todos
        if (!settings["ignore_counters_with_zero_changes_in_log"] || violationsFound > 0){
            log.write('\n' + "Number of violations found: " + violationsFound.toString());
        }

        // Write unused functions
        for (let unusedFunctionName of unusedFunctionNames){
            log.write('\n' + "Unused function: " + unusedFunctionName);
        }

        // Go through the todos

        // Single line todos
        let singleLineToDos = fileDataCollector.getValue("single_line_todos");
        for (let todoDataJSON of singleLineToDos){
            log.write('\n' + "Line " + todoDataJSON["line_number"] + ": " + todoDataJSON["todo_str"]);
        }

        // Multi line todos
        let multiLineToDos = fileDataCollector.getValue("multi_line_todos");
        for (let todoDataJSON of multiLineToDos){
            log.write('\n' + "Line " + todoDataJSON["line_number"] + ": " + todoDataJSON["todo_str"]);
        }

        // Go through violations
        if (violationsFound > 0){
            log.write('\n' + "Violations:");
            for (let violation of violations){
                log.write('\n' + violation);
            }
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

    // Write number of Function comments added
    summaryText += '\n' + "Number of Function comments added: " + totalMethodCommentsAdded.toString();

    // Write number of class comments added
    summaryText += '\n' + "Number of class comments added: " + totalClassCommentsAdded.toString();

    // Write number of line-referencing console.logs updated
    summaryText += '\n' + "Number of line-referencing console.logs updated: " + totalLineReferencingConsoleLogsUpdated.toString();

    if (settings["remove_console_logs"]){
        // Write number of old console.logs removed
        summaryText += '\n' + "Number of old console.logs removed: " + totalOldConsoleLogsRemoved.toString();
    }

    // Write number of unused functions
    summaryText += '\n' + "Number of unused functions found: " + totalUnusedFunctionCount.toString();

    // Write number of todos
    summaryText += '\n' + "Number of todos found: " + totalTodosFound.toString();

    // Write number of violations
    summaryText += '\n' + "Number of violations found: " + totalViolationCount.toString();

    log.writeAtBeginning(summaryText);

    if (settings["print_summary"]){
        console.log(summaryText);
    }

    log.saveToFile(outputFolderRPath);
}

/*
    Function Name: writeJSFiles
    Function Parameters: 
        inputFolderRPathLength:
            String path to the input folder
        outputFolderRPath:
            String path to the output folder
        jsFiles:
            List of jsFile
    Function Description: Writes each js file to the output folder
    Function Return: void
*/
function writeJSFiles(inputFolderRPathLength, outputFolderRPath, jsFiles){
    for (let jsFile of jsFiles){
        jsFile.writeToOutputFolder(inputFolderRPathLength, outputFolderRPath);
    }
}



// Run on start up
run();
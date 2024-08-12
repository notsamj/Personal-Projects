const fs = require("fs");
const DataCollector = require("./data_collector.js");

const doesFolderExist = require("./helper_functions.js").doesFolderExist;
const findIndexOfChar = require("./helper_functions.js").findIndexOfChar;
const findNextIndexOfChar = require("./helper_functions.js").findNextIndexOfChar;
const copyArray = require("./helper_functions.js").copyArray;
const insertStringIntoStringBeforeCharIndex = require("./helper_functions.js").insertStringIntoStringBeforeCharIndex;
const searchForSubstringInString = require("./helper_functions.js").searchForSubstringInString;
const measureIndentingBefore = require("./helper_functions.js").measureIndentingBefore;
const createIndenting = require("./helper_functions.js").createIndenting;
const isPrecededBy = require("./helper_functions.js").isPrecededBy;
const isPrecededByIgnoreWhiteSpace = require("./helper_functions.js").isPrecededByIgnoreWhiteSpace;
const searchForSubstringInStringAfter = require("./helper_functions.js").searchForSubstringInStringAfter; 
const deleteXCharsAt = require("./helper_functions.js").deleteXCharsAt; 
const whatLineInString = require("./helper_functions.js").whatLineInString; 
const insertIntoStringBefore = require("./helper_functions.js").insertIntoStringBefore;
const collectCharactersUntilMeetingChar = require("./helper_functions.js").collectCharactersUntilMeetingChar;
const collectCharactersUntilMeetingStr = require("./helper_functions.js").collectCharactersUntilMeetingStr;
const countOccurancesOfSubString = require("./helper_functions.js").countOccurancesOfSubString;
const objectHasKey = require("./helper_functions.js").objectHasKey;
const getLineBefore = require("./helper_functions.js").getLineBefore;
const listContainsElement = require("./helper_functions.js").listContainsElement;

/*
    Class Name: JSFile
    Class Description: A class representing a file of javascript code
*/
class JSFile {
    /*
        Method Name: constructor
        Method Parameters: 
            fileName:
                The name of the js file
             rPath:
                The relative path to the js file
             fileDataStr:
                A string of the file contents
        Method Description: constructor
        Method Return: constructor
    */
    constructor(fileName, rPath, fileDataStr){
        this.fileName = fileName;
        this.rPath = rPath;
        this.fileDataStr = fileDataStr.toString();

        this.dataCollector = new DataCollector();

        this.functionsAndMethods = [];
        this.classes = [];
    }

    /*
        Method Name: gatherNSRequirementData
        Method Parameters: None
        Method Description: Gathers infroamtion about interfaces, abstract classes in this file
        Method Return: JSON Object
    */
    gatherNSRequirementData(){
        let requirementData = {
            "classes_extending_or_implementing": [],
            "abstract_classes": [],
            "interfaces": []
        }

        let extractClassName = (str, searchStartIndex) => {
            let className = "";
            let stage = "findingClass";
            let whiteSpace = /\s/;
            for (let i = searchStartIndex; i < str.length; i++){
                let char = str[i];
                if (stage == "findingClass"){
                    if (!whiteSpace.test(char)){
                        stage = "skippingClassKeyword";
                    }
                }
                else if (stage == "skippingClassKeyword"){
                    if (whiteSpace.test(char)){
                        stage = "skippingWhiteSpaceAfterClassKeyword";
                    }
                }else if (stage == "skippingWhiteSpaceAfterClassKeyword"){
                    if (!whiteSpace.test(char)){
                        stage = "readingClassName";
                    }
                }
                if (stage == "readingClassName"){
                    if (char != " " && char != "{"){
                        className += char;
                    }else{
                        break;
                    }
                }
            }
            return className;
        }
        // Index of { at the start of the class
        let findClassInteriorStartIndex = (str, searchStartIndex) => {
            for (let i = searchStartIndex; i < str.length; i++){
                if (str[i] == "{"){
                    return i;
                }
            }
            return -1;
        }

        let findPositionOfClosingBrace = (openingBraceIndex, sourceString) => {
            let openCount = 0;
            let closedCount = 0;
            for (let i = openingBraceIndex; i < sourceString.length; i++){
                let char = sourceString[i];
                if (char == '{'){
                    openCount++;
                }else if (char == '}'){
                    closedCount++;
                    if (openCount == closedCount){
                        return i;
                    }
                }
            }
            // Never closed just return sourceString length - 1
            return sourceString.length - 1;
        }

        let extractClassVariablesAndMethods = (sourceString, classStartIndex) => {
            let classSubString = sourceString.substring(classStartIndex, findPositionOfClosingBrace(classStartIndex, sourceString)+1);
            let returnJSON = {
                "member_variables": [],
                "methods": []
            }

            // Find methods
            let methodRegex = /[a-z][a-zA-Z0-9]+\(([a-zA-Z0-9.=]+(, ?[a-zA-Z0-9.=]+)*)?\)\{/g;
            let methodMatches = [...classSubString.matchAll(methodRegex)];
            for (let methodMatch of methodMatches){
                let methodHeader = methodMatch[0];
                // Note: Assuming there are no two functions with the same name / header
                let charIndex = methodMatch["index"];
                let name = methodHeader.substring(0, findIndexOfChar(methodHeader, '('));

                let parametersString = methodHeader.substring(findIndexOfChar(methodHeader, '(') + 1, methodHeader.length - 2);
                let parametersStringList = parametersString.split(',');
                // If empty then use an empty array
                if (parametersStringList.length == 1 && parametersStringList[0] === ''){
                    parametersStringList = [];
                }
                let methodOpeningBraceIndex = findNextIndexOfChar(classSubString, '{', charIndex);
                let methodClosingBraceIndex = findPositionOfClosingBrace(methodOpeningBraceIndex, classSubString);
                let methodContentsStr = classSubString.substring(methodOpeningBraceIndex, methodClosingBraceIndex+1);
                let methodExactMatch = isPrecededByIgnoreWhiteSpace(classSubString, charIndex, "//nsMethodExactMatch");
                returnJSON["methods"].push({"method_name": name, "method_parameters": parametersStringList, "method_contents_string": methodContentsStr, "method_exact_match": methodExactMatch});
            }

            // Find member variables

            let constructorRegex = /(^|\n) *constructor\(/g;
            let constructorMatches = [...classSubString.matchAll(constructorRegex)];
            // If constructor not found
            if (constructorMatches.length == 0){
                console.error("Constructor not found in: " + this.getFileName() + ".");
                process.exit(1);
            }
            let constructorMatch = constructorMatches[0];
            let constructorBraceStartIndex = findNextIndexOfChar(classSubString, '{', constructorMatch["index"]);
            let constructorBraceEndIndex = findPositionOfClosingBrace(constructorBraceStartIndex, classSubString);
            let constructorSubString = classSubString.substring(constructorBraceStartIndex, constructorBraceEndIndex+1);
            let memberVariableRegex = /this\.([a-zA-Z0-9]+) ?=/g;
            let memberVariableMatches = [...constructorSubString.matchAll(memberVariableRegex)];
            for (let memberVariableMatch of memberVariableMatches){
                let memberVariableName = memberVariableMatch[1];
                // Sometimes there will be duplicates, so check here
                if (!listContainsElement(returnJSON["member_variables"], memberVariableName)){
                    returnJSON["member_variables"].push(memberVariableName);
                }
            }
            return returnJSON;
        }

        /*
        *    Three valid examples
        *    // nsRequire { "nsExtends": ["nsHumanCharacter"], "nsImplements": ["myInterface"]}
        *    // nsRequire { "nsExtends": ["nsHumanCharacter"] }
        *    // nsRequire {"nsImplements": ["myInterface"]}
        */
        let nsRequireRegex = /(^|\n) *\/\/ nsRequire \{ ?"[a-zA-Z]+\": [\"[a-zA-Z]+](, ?"[a-zA-Z]+\": [\"[a-zA-Z]+])? ?}/g;
        let requireMatches = [...this.fileDataStr.matchAll(nsRequireRegex)];
        let startOfNsRequireStringLength = "// nsRequire ".length;

        // find all nsRequire matches and record
        for (let match of requireMatches){
            let matchStr = match[0];
            let jsonStr = matchStr.substring(startOfNsRequireStringLength, matchStr.length);
            let jsonObj = JSON.parse(jsonStr);
            let className = extractClassName(this.fileDataStr, match["index"] + matchStr.length);
            // The start index is probably an underestimate, it's not meant to be perfect, just prior to { which is expected but if the file is in an improper format then may not exist and result in errors but whatever, use at your own risk of error 
            let classInteriorStartIndex = findClassInteriorStartIndex(this.fileDataStr, match["index"] + matchStr.length + className.length);
            let classVariablesAndMethods = extractClassVariablesAndMethods(this.fileDataStr, classInteriorStartIndex);
            requirementData["classes_extending_or_implementing"].push({
                "class_name": className,
                "member_variables": classVariablesAndMethods["member_variables"],
                "methods": classVariablesAndMethods["methods"],
                "extends": objectHasKey(jsonObj, "extends") ? jsonObj["extends"] : [],
                "implements": objectHasKey(jsonObj, "implements") ? jsonObj["implements"] : [],
                "file": this,
            });
        }

        // Now find all abstract class definitions and get data
        let nsAbstractClassRegex = /(^|\n) *\/\/ nsAbstractClass/g;
        let abstractClassMatches = [...this.fileDataStr.matchAll(nsAbstractClassRegex)];

        // Record all abstract classes
        for (let match of abstractClassMatches){
            let matchStr = match[0];
            let className = extractClassName(this.fileDataStr, match["index"] + matchStr.length);
            let classInteriorStartIndex = findClassInteriorStartIndex(this.fileDataStr, match["index"] + matchStr.length + className.length);
            let classVariablesAndMethods = extractClassVariablesAndMethods(this.fileDataStr, classInteriorStartIndex);
            /*console.log("New abstract class", {
                "class_name": className,
                "member_variables": classVariablesAndMethods["member_variables"],
                "methods": classVariablesAndMethods["methods"],
                "file": this
            })*/
            requirementData["abstract_classes"].push({
                "class_name": className,
                "member_variables": classVariablesAndMethods["member_variables"],
                "methods": classVariablesAndMethods["methods"],
                "file": this
            });
        }

        // Find interfaces

        let extractInterfaceName = extractClassName;
        let findInterfaceInteriorStartIndex = findClassInteriorStartIndex;
        let findInterfaceMethods = extractClassVariablesAndMethods;

        let nsInterfaceRegex = /(^|\n) *\/\/ nsInterface/g;
        let interfaceMatches = [...this.fileDataStr.matchAll(nsInterfaceRegex)];

        // Record all interfaces
        for (let match of interfaceMatches){
            let matchStr = match[0];
            let interfaceName = extractInterfaceName(this.fileDataStr, match["index"] + matchStr.length);
            let interfaceInteriorStartIndex = findInterfaceInteriorStartIndex(this.fileDataStr, match["index"] + matchStr.length + interfaceName.length);
            let interfaceMethods = findInterfaceMethods(this.fileDataStr, interfaceInteriorStartIndex);
            requirementData["interfaces"].push({
                "interface_name": interfaceName,
                "methods": interfaceMethods["methods"],
                "file": this
            });
        }

        return requirementData;
    }

    /*
        Method Name: getRelativePath
        Method Parameters: None
        Method Description: Getter
        Method Return: String
    */
    getRelativePath(){
        return this.rPath;
    }

    /*
        Method Name: checkToDos
        Method Parameters: None
        Method Description: Counts and records ToDos in the file
        Method Return: void
    */
    checkToDos(){
        // Collect all single line todos
        let singleLineToDoRegex = /\/\/ *TODO/g;
        let singleLineToDos = [...this.fileDataStr.matchAll(singleLineToDoRegex)];
        let singleLineToDoData = [];

        for (let singleLineToDoMatch of singleLineToDos){
            let singleLineToDoStr = singleLineToDoMatch[0];
            let charIndex = singleLineToDoMatch["index"];
            let lineNumber = whatLineInString(this.fileDataStr, charIndex);
            let toDoContentsStr = collectCharactersUntilMeetingChar(this.fileDataStr, charIndex, '\n');
            singleLineToDoData.push({"line_number": lineNumber, "todo_str": toDoContentsStr});
        }
        this.dataCollector.setValue("single_line_todos", singleLineToDoData);

        // Collect all multi line todos
        let multiLineToDoRegex = /\/\*\s*TODO/g;
        let multiLineTODOs = [...this.fileDataStr.matchAll(multiLineToDoRegex)];
        let multiLineToDoData = [];

        for (let multiLineTODOMatch of multiLineTODOs){
            let multiLineTODOStr = multiLineTODOMatch[0];
            let charIndex = multiLineTODOMatch["index"];
            let lineNumber = whatLineInString(this.fileDataStr, charIndex);
            let toDoContentsStr = collectCharactersUntilMeetingStr(this.fileDataStr, charIndex, "*/"); 
            multiLineToDoData.push({"line_number": lineNumber, "todo_str": toDoContentsStr});
        }
        this.dataCollector.setValue("multi_line_todos", multiLineToDoData);

        // Count total number of todos
        let totalToDoCount = countOccurancesOfSubString(this.fileDataStr, "TODO");
        this.dataCollector.setValue("total_todo_count", totalToDoCount);
    }

    /*
        Method Name: countStatements
        Method Parameters: None
        Method Description: Counts the number of statements in a file
        Method Return: void
    */
    countStatements(){
        let statementRegex = /; *($|\n)/g;
        let statements = [...this.fileDataStr.matchAll(statementRegex)];
        this.dataCollector.setValue("number_of_statements", statements.length);
    }

    /*
        Method Name: getDataCollector
        Method Parameters: None
        Method Description: Getter
        Method Return: DataCollector
    */
    getDataCollector(){
        return this.dataCollector;
    }

    /*
        Method Name: removeOldConsoleLogs
        Method Parameters: None
        Method Description: Removes commented out console log statements
        Method Return: void
    */
    removeOldConsoleLogs(){
        let oldConsoleLogRegex = / *\/\/console\.log([^\n])+\n/g;
        // Add number being removed to DataCollector
        this.dataCollector.setValue("old_console_logs_removed", [...this.fileDataStr.matchAll(oldConsoleLogRegex)].length);
        // Delete them
        this.fileDataStr = this.fileDataStr.replace(oldConsoleLogRegex, '');
    }

    /*
        Method Name: handleComments
        Method Parameters: None
        Method Description: Identifies needed comment places and adds comments
        Method Return: void
    */
    handleComments(){
        this.identifyMethodsAndFunctions();
        this.indentifyClasses();
        this.addClassAndMethodComments();
    }

    /*
        Method Name: updateConsoleLogs
        Method Parameters: None
        Method Description: Updates console log statements that are associated with a certain line
        Method Return: void
    */
    updateConsoleLogs(){
        let consoleLogRegex = /console\.log\("((\$FL)|([a-zA-Z_]+\.js \(L[0-9]+\)))/g;
        let consoleLogStatements = [...this.fileDataStr.matchAll(consoleLogRegex)];
        // Loop through all matching console logs and update
        for (let i = 0; i < consoleLogStatements.length; i++){
            let consoleLogStatement = consoleLogStatements[i][0];
            let charIndex = searchForSubstringInString(consoleLogStatement, this.fileDataStr);
            // Delete old part of the statement
            this.fileDataStr = deleteXCharsAt(this.fileDataStr, charIndex, consoleLogStatement.length);
            let lineCount = whatLineInString(this.fileDataStr, charIndex);
            this.fileDataStr = insertIntoStringBefore("console.log(\"" + this.fileName + " (L" + lineCount.toString() + ")", this.fileDataStr, charIndex);
        }
        // Add work done to DataCollector
        this.dataCollector.setValue("l_r_console_logs_updated", consoleLogStatements.length);
    }

    /*
        Method Name: identifyMethodsAndFunctions
        Method Parameters: None
        Method Description: Identifies all methods and functions in the file
        Method Return: void
    */
    identifyMethodsAndFunctions(){
        let functionMethodRegex = /[a-z][a-zA-Z0-9]+\(([a-zA-Z0-9.=]+(, ?[a-zA-Z0-9.=]+)*)?\)\{/g;
        let functionsAndMethodHeaders = [...this.fileDataStr.matchAll(functionMethodRegex)];
        // Looping through a bunch of these ["function myFunction(a, b)", ...]
        for (let i = 0; i < functionsAndMethodHeaders.length; i++){
            let fOrMethodHeader = functionsAndMethodHeaders[i][0];
            // Note: Assuming there are no two functions with the same name / header
            let charIndex = searchForSubstringInString(fOrMethodHeader, this.fileDataStr);
            let name = fOrMethodHeader.substring(0, findIndexOfChar(fOrMethodHeader, '('));

            // Check banned method names (hard coding this)

            // Easier than changing how methods are identified to just include this case and not comment catch
            if (name == "catch"){ continue; }

            // Check for other functions with the same name and adjust char index to the next occurance
            for (let fOrMethod of this.functionsAndMethods){
                if (fOrMethod["name"] == name && charIndex >= fOrMethod["char_index"]){
                    charIndex = searchForSubstringInStringAfter(fOrMethodHeader, this.fileDataStr, fOrMethod["char_index"]);
                }
            }

            let parametersString = fOrMethodHeader.substring(findIndexOfChar(fOrMethodHeader, '(') + 1, fOrMethodHeader.length - 2);
            let parametersStringList = parametersString.split(',');
            // If empty then use an empty array
            if (parametersStringList.length == 1 && parametersStringList[0] === ''){
                parametersStringList = [];
            }
            // Remove leading and/or trailing spaces from parameter names
            for (let i = 0; i < parametersStringList.length; i++){
                parametersStringList[i] = parametersStringList[i].trim();
            }
            // Note: not doing things like checking if the same parameter name is used twice like function test$(a, a, b){}
            this.functionsAndMethods.push({"type": "method/function", "char_index": charIndex, "name": name, "parameters": parametersStringList});
        }
    }

    /*
        Method Name: addClassAndMethodComments
        Method Parameters: None
        Method Description: Adds class and method (and function) comments to the file
        Method Return: void
    */
    addClassAndMethodComments(){
        let headersInNeedOfComments = [];

        let fHIndex = this.functionsAndMethods.length - 1;
        let cIndex = this.classes.length - 1;
        // Loop until we have run out of both these lists
        while (fHIndex >= 0 || cIndex >= 0){
            let fhCharIndex = -1;
            let cCharIndex = -1;

            // Find the character index of the start of the function or class
            if (fHIndex >= 0){
                fhCharIndex = this.functionsAndMethods[fHIndex]["char_index"];
            }
            if (cIndex >= 0){
                cCharIndex = this.classes[cIndex]["char_index"];
            }

            // The next one to comment will be the highest character index
            let nextToComment = (fhCharIndex > cCharIndex) ? this.functionsAndMethods[fHIndex] : this.classes[cIndex];
                
            // Go to the next function/method or class
            if (fhCharIndex > cCharIndex){
                fHIndex--;
            }else{
                cIndex--;
            }

            // Comment the current one
            if (nextToComment["type"] == "class"){
                this.commentClass(nextToComment);
            }else{
                this.commentMethodOrFunction(nextToComment);
            }
        }
    }

    /*
        Method Name: commentClass
        Method Parameters: 
            classDetailsJSON:
                Information about a class in the JSON format
        Method Description: Creates comments for a class
        Method Return: void
    */
    commentClass(classDetailsJSON){
        let charIndex = classDetailsJSON["char_index"];
        // If comment already exists then ignore.
        if (isPrecededByIgnoreWhiteSpace(this.fileDataStr, charIndex, "*/")){
            return;
        }

        // If it is an abstract class
        if (isPrecededBy(this.fileDataStr, charIndex, "// nsAbstractClass\n")){
            charIndex -= "// nsAbstractClass\n".length;
        }
        // if it is an interface
        else if (isPrecededBy(this.fileDataStr, charIndex, "// nsInterface\n")){
            charIndex -= "// nsInterface\n".length;
        }
        let lineBefore = getLineBefore(this.fileDataStr, charIndex);
        let nsRequireRegex = /\/\/ nsRequire \{ ?"[a-zA-Z]+\": [\"[a-zA-Z]+](, ?"[a-zA-Z]+\": [\"[a-zA-Z]+])? ?}/g;
        let matchesInLineBefore = [...lineBefore.matchAll(nsRequireRegex)];
        // if there is a match in the line before for an nsRequire then move before that
        if (matchesInLineBefore.length > 0){
            charIndex -= matchesInLineBefore[0][0].length - 1; // -1 is for a newline
        }

        // Add to DataCollector
        this.dataCollector.incrementCounter("c_comments_added");
        let numSpaces = measureIndentingBefore(this.fileDataStr, charIndex);
        let indenting = createIndenting(numSpaces);
        let commentString = "/*\n" + indenting + "    Class Name: " + classDetailsJSON["name"] + "\n" + indenting + "    Class Description: TODO\n" + indenting + "*/\n" + indenting;
        this.fileDataStr = insertStringIntoStringBeforeCharIndex(commentString, this.fileDataStr, charIndex); 
    }

    /*
        Method Name: commentMethodOrFunction
        Method Parameters: 
            mFDetails:
                Information about a method or function in the json format
        Method Description: Adds a comment before a method or function
        Method Return: void
    */
    commentMethodOrFunction(mFDetails){
        let charIndex = mFDetails["char_index"];
        let isMethod = true;
        if (isPrecededBy(this.fileDataStr, charIndex, "async function ")){
            charIndex -= "async function ".length;
            isMethod = false;
        }else if (isPrecededBy(this.fileDataStr, charIndex, "static async ")){
            charIndex -= "static async ".length;
        }else if (isPrecededBy(this.fileDataStr, charIndex, "async ")){
            charIndex -= "async ".length;
        }else if (isPrecededBy(this.fileDataStr, charIndex, "function ")){
            charIndex -= "function ".length;
            isMethod = false;
        }else if (isPrecededBy(this.fileDataStr, charIndex, "static ")){
            charIndex -= "static ".length;
        }

        // Check if preceded by a // nsMethodExactMatch
        if (isPrecededByIgnoreWhiteSpace(this.fileDataStr, charIndex, "//nsMethodExactMatch")){
            charIndex -= ("// nsMethodExactMatch\n".length + measureIndentingBefore(this.fileDataStr, charIndex));
        }

        // If comment already exists then ignore.
        if (isPrecededByIgnoreWhiteSpace(this.fileDataStr, charIndex, "*/")){
            return;
        }

        // Record in DataCollector
        if (isMethod){
            this.dataCollector.incrementCounter("m_comments_added");
        }else{
            this.dataCollector.incrementCounter("f_comments_added");
        }

        let numSpaces = measureIndentingBefore(this.fileDataStr, charIndex);
        let indenting = createIndenting(numSpaces);
        let typeStr = (isMethod ? "Method" : "Function");
        let commentString = "/*\n" + indenting + "    " + typeStr + " Name: " + mFDetails["name"] + "\n" + indenting + "    " + typeStr + " Parameters: ";
        if (mFDetails["parameters"].length == 0){
            commentString += "None";
        }else{
            for (let parameterName of mFDetails["parameters"]){
                commentString += "\n";
                commentString += indenting;
                commentString += "        " + parameterName + ":\n";
                commentString += indenting;
                commentString += "            TODO";
            }
        }
        commentString += "\n" + indenting + "    " + typeStr + " Description: TODO\n" + indenting + "    " + typeStr + " Return: TODO\n" + indenting + "*/\n" + indenting;
        this.fileDataStr = insertStringIntoStringBeforeCharIndex(commentString, this.fileDataStr, charIndex); 
    }

    /*
        Method Name: indentifyClasses
        Method Parameters: None
        Method Description: Identifies all classes in the file
        Method Return: void
    */
    indentifyClasses(){
        let classRegex = /class [a-zA-Z]+ ?{/g;

        let classHeaders = [...this.fileDataStr.matchAll(classRegex)];
        // Looping through a bunch of these ["function myFunction(a, b)", ...]
        for (let i = 0; i < classHeaders.length; i++){
            let classHeader = classHeaders[i][0];
            // Note: Assuming there are no two functions with the same name / header
            let charIndex = searchForSubstringInString(classHeader, this.fileDataStr);
            let hasSpace = findIndexOfChar(classHeader, ' ') != -1;
            let name = classHeader.substring("class ".length, hasSpace ? ("class ".length + findIndexOfChar(classHeader.substring("class ".length), ' ')) : findIndexOfChar(classHeader, '{'));
            this.classes.push({"type": "class", "char_index": charIndex, "name": name});
        }
    }

    /*
        Method Name: getFileName
        Method Parameters: None
        Method Description: Getter
        Method Return: String
    */
    getFileName(){
        return this.fileName;
    }

    /*
        Method Name: writeToOutputFolder
        Method Parameters: 
            inputFolderRPathLength:
                String, path to the input folder
             outputFolderRPath:
                String, path to the output folder
        Method Description: Writes this file to the output folder
        Method Return: void
    */
    writeToOutputFolder(inputFolderRPathLength, outputFolderRPath){
        let subPath = this.rPath.substring(inputFolderRPathLength, this.rPath.length);

        // Create folders in output folder from sub path

        let subPathFolderNames = subPath.split('/');
        let currentRPath = outputFolderRPath;
        // Create all folders leading to file
        for (let folderName of subPathFolderNames){
            currentRPath += folderName + '/';
            let folderExists = doesFolderExist(currentRPath);
            if (!folderExists){
                // Create folder
                fs.mkdirSync(currentRPath);
            }
        }

        let newPath = outputFolderRPath + subPath;
        fs.writeFileSync(newPath + this.getFileName(), this.fileDataStr);
    }

    /*
        Method Name: read
        Method Parameters: 
            fileName:
                Name of a js file
             rPath:
                Path to a js file
        Method Description: Reads a js file and returns a JSFile instance related to it
        Method Return: JSFile
    */
    static read(fileName, rPath){
        return new JSFile(fileName, rPath, fs.readFileSync(rPath + fileName));
    }
}

module.exports = JSFile;
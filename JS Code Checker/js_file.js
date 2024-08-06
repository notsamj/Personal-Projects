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

class JSFile {
	constructor(fileName, rPath, fileDataStr){
		this.fileName = fileName;
		this.rPath = rPath;
		this.fileDataStr = fileDataStr.toString();

		this.dataCollector = new DataCollector();

		this.functionsAndMethods = [];
		this.classes = [];
	}

	gatherNSRequirementData(){
		let requirementData = {
			"classes_extending_or_implementing": [],
			"abstract_classes": [],
			"interfaces": []
		}

		let extractClassName = (str, searchStartIndex) => {
			let className = "";
			let stage = "findingClass";
			let whiteSpace = /\w/;
			for (let i = startIndex; i < str.length; i++){
				let char = str[i];
				if (stage == "findingClass"){
					if (!whiteSpace.test(char)){
						stage = "skippingClassKeyword";
					}
				}
				if (stage == "skippingClassKeyword"){
					if (char != " "){
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

		/*
			Three valid examples
			// nsRequire { "nsExtends": ["nsHumanCharacter"], "nsImplements": ["myInterface"]}
			// nsRequire { "nsExtends": ["nsHumanCharacter"] }
			// nsRequire {"nsImplements": ["myInterface"]}
		*/
		let nsRequireRegex = /\/\/ nsRequire \{ ?"[a-zA-Z]+\": [\"[a-zA-Z]+](, ?"[a-zA-Z]+\": [\"[a-zA-Z]+])? ?}/g;
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
			requirementData["classes_extending_or_implementing"].push({
				"class_name": className,
				"class_interior_start_index": classInteriorStartIndex,
				"nsExtends": objectHasKey(jsonObj, "nsExtends") ? jsonObj["nsExtends"] : [],
				"nsImplements": objectHasKey(jsonObj, "nsImplements") ? jsonObj["nsImplements"] : [],
				"file": this
			});
		}

		// Now find all abstract class definitions and get data
		let nsAbstractClassRegex = /\/\/ nsAbstractClass/g;
		let abstractClassMatches = [...this.fileDataStr.matchAll(nsAbstractClassRegex)];

		let findPositionOfClosingBrace = (openingParenthesisIndex, sourceString) => {
			let openCount = 1; // Assuming openParenthesisIndex is a '('
			let closedCount = 0;
			for (let i = openingParenthesisIndex; i < sourceString.length; i++){
				let char = sourceString[i];
				if (char == '('){
					openCount++;
				}else if (char == ')'){
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
			let methodRegex = /[a-zA-Z]+\(([a-zA-Z0-9.=]+(, ?[a-zA-Z0-9.=]+)*)?\)\{/g;
			let methodMatches = [...classSubString.matchAll(methodRegex)];
			for (let methodMatch of methodMatches){
				let methodHeader = methodMatch[i][0];
				// Note: Assuming there are no two functions with the same name / header
				let charIndex = methodMatch["index"];
				let name = methodHeader.substring(0, findIndexOfChar(methodHeader, '('));

				let parametersString = methodHeader.substring(findIndexOfChar(methodHeader, '(') + 1, fOrMethodHeader.length - 2);
				let parametersStringList = parametersString.split(',');
				// If empty then use an empty array
				if (parametersStringList.length == 1 && parametersStringList[0] === ''){
					parametersStringList = [];
				}
				let methodOpeningBraceIndex = findNextIndexOfChar(classSubString, '{', charIndex);
				let methodClosingBraceIndex = findPositionOfClosingBrace(methodOpeningBraceIndex, classSubString);
				let methodContentsStr = this.fileDataStr.substring(methodOpeningBraceIndex, methodClosingBraceIndex+1);
				returnJSON["methods"].push({"method_name": methodHeader, "method_parameters": parametersStringList, "method_contents_string": methodContentsStr});
			}

			// Find member variables

			let constructorRegex = /constructor/g;
			let constructorMatchs = [...classSubString.matchAll(constructorRegex)];
			let constructorMatch = constructorMatches[0];
			let constructorBraceStartIndex = findNextIndexOfChar(classSubString, '{', constructorMatch["index"]);
			let constructorBraceEndIndex = findPositionOfClosingBrace(classSubString, constructorBraceStartIndex);
			let constructorSubString = classSubString.substring(constructorBraceStartIndex, constructorBraceEndIndex+1);

			let memberVariableRegex = /this\.([a-zA-Z0-9]) ?= ?null;/g;
			let memberVariableMatches = [...constructorSubString.matchAll(memberVariableRegex)];
			for (let memberVariableMatch of memberVariableMatches){
				returnJSON["member_variables"].push(memberVariableMatch[1])''
			}
			return returnJSON;
		}

		// Record all abstract classes
		for (let match of abstractClassMatches){
			let matchStr = match[0];
			let className = extractClassName(this.fileDataStr, match["index"] + matchStr.length);
			let classInteriorStartIndex = findClassInteriorStartIndex(this.fileDataStr, match["index"] + matchStr.length + className.length);
			let classVariablesAndMethods = extractClassVariablesAndMethods(this.fileDataStr, classInteriorStartIndex);
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

		let nsInterfaceRegex = /\/\/ nsInterface/g;
		let interfaceMatches = [...this.fileDataStr.matchAll(nsInterfaceRegex)];

		// Record all interfaces
		for (let match of abstractClassMatches){
			let matchStr = match[0];
			let interfaceName = extractInterfaceName(this.fileDataStr, match["index"] + matchStr.length);
			let interfaceInteriorStartIndex = findInterfaceInteriorStartIndex(this.fileDataStr, match["index"] + matchStr.length + interfaceName.length);
			let interfaceMethods = findInterfaceMethods(this.fileDataStr, classInteriorStartIndex);
			requirementData["interfaces"].push({
				"interface_name": interfaceName,
				"methods": interfaceMethods["methods"],
				"file": this
			});
		}

		return requirementData;
	}

	getRelativePath(){
		return this.rPath;
	}

	checkTODOs(){
		// Collect all single line todos
		let singleLineTODORegex = /\/\/ *TODO/g;
		let singleLineTODOs = [...this.fileDataStr.matchAll(singleLineTODORegex)];
		let singleLineTODOData = [];

		for (let singleLineTODOMatch of singleLineTODOs){
			let singleLineTODOStr = singleLineTODOMatch[0];
			let charIndex = singleLineTODOMatch["index"];
			let lineNumber = whatLineInString(this.fileDataStr, charIndex);
			let todoContentsStr = collectCharactersUntilMeetingChar(this.fileDataStr, charIndex, '\n');
			singleLineTODOData.push({"line_number": lineNumber, "todo_str": todoContentsStr});
		}
		this.dataCollector.setValue("single_line_todos", singleLineTODOData);

		// Collect all multi line todos
		let multiLineTODORegex = /\/\*\s*TODO/g;
		let multiLineTODOs = [...this.fileDataStr.matchAll(multiLineTODORegex)];
		let multiLineTODOData = [];

		for (let multiLineTODOMatch of multiLineTODOs){
			let multiLineTODOStr = multiLineTODOMatch[0];
			let charIndex = multiLineTODOMatch["index"];
			let lineNumber = whatLineInString(this.fileDataStr, charIndex);
			let todoContentsStr = collectCharactersUntilMeetingStr(this.fileDataStr, charIndex, "*/"); 
			multiLineTODOData.push({"line_number": lineNumber, "todo_str": todoContentsStr});
		}
		this.dataCollector.setValue("multi_line_todos", multiLineTODOData);

		// Count total number of todos
		let totalTODOCount = countOccurancesOfSubString(this.fileDataStr, "TODO");
		this.dataCollector.setValue("total_todo_count", totalTODOCount);
	}

	countStatements(){
		let statementRegex = /; *($|\n)/g;
		let statements = [...this.fileDataStr.matchAll(statementRegex)];
		this.dataCollector.setValue("number_of_statements", statements.length);
	}

	getDataCollector(){
		return this.dataCollector;
	}

	removeOldConsoleLogs(){
		let oldConsoleLogRegex = / *\/\/console\.log([^\n])+\n/g;
		// Add number being removed to DataCollector
		this.dataCollector.setValue("old_console_logs_removed", [...this.fileDataStr.matchAll(oldConsoleLogRegex)].length);
		// Delete them
		this.fileDataStr = this.fileDataStr.replace(oldConsoleLogRegex, '');
	}

	handleComments(){
		this.identifyMethodsAndFunctions();
		this.indentifyClasses();
		this.addClassAndMethodComments();
	}

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

	identifyMethodsAndFunctions(){
		let functionMethodRegex = /[a-zA-Z]+\(([a-zA-Z0-9.=]+(, ?[a-zA-Z0-9.=]+)*)?\)\{/g;
		let functionsAndMethodHeaders = [...this.fileDataStr.matchAll(functionMethodRegex)];
		// Looping through a bunch of these ["function myFunction(a, b)", ...]
		for (let i = 0; i < functionsAndMethodHeaders.length; i++){
			let fOrMethodHeader = functionsAndMethodHeaders[i][0];
			//console.log(fOrMethodHeader, typeof fOrMethodHeader)
			// Note: Assuming there are no two functions with the same name / header
			let charIndex = searchForSubstringInString(fOrMethodHeader, this.fileDataStr);
			let name = fOrMethodHeader.substring(0, findIndexOfChar(fOrMethodHeader, '('));

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
			// Note: not doing things like checking if the same parameter name is used twice like function test(a, a, b){}
			//console.log(fOrMethodHeader, name, parametersStringList)
			this.functionsAndMethods.push({"type": "method/function", "char_index": charIndex, "name": name, "parameters": parametersStringList});
		}
	}

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
			//console.log(nextToComment, fhCharIndex, cCharIndex, cIndex, fHIndex)
			if (nextToComment["type"] == "class"){
				this.commentClass(nextToComment);
			}else{
				this.commentMethodOrFunction(nextToComment);
			}
		}
	}

	commentClass(classDetailsJSON){
		// If comment already exists then ignore
		if (searchForSubstringInString("Class Name: " + classDetailsJSON["name"], this.fileDataStr) != -1){
			return;
		}
		// Add to DataCollector
		this.dataCollector.incrementCounter("c_comments_added");
		let numSpaces = measureIndentingBefore(this.fileDataStr, classDetailsJSON["char_index"]);
		let indenting = createIndenting(numSpaces);
		let commentString = "/*\n" + indenting + "    Class Name: " + classDetailsJSON["name"] + "\n" + indenting + "    Class Description: TODO\n" + indenting + "*/\n" + indenting;
		this.fileDataStr = insertStringIntoStringBeforeCharIndex(commentString, this.fileDataStr, classDetailsJSON["char_index"]); 
	}

	commentMethodOrFunction(mFDetails){
		let charIndex = mFDetails["char_index"];
		//console.log(mFDetails["name"], isPrecededByIgnoreWhiteSpace(this.fileDataStr, mFDetails["char_index"], "*/"))
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
		let commentString = "/*\n" + indenting + "    Method Name: " + mFDetails["name"] + "\n" + indenting + "    Method Parameters: ";
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
		commentString += "\n" + indenting + "    Method Description: TODO\n" + indenting + "    Method Return: TODO\n" + indenting + "*/\n" + indenting;
		this.fileDataStr = insertStringIntoStringBeforeCharIndex(commentString, this.fileDataStr, charIndex); 
	}

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

	getFileName(){
		return this.fileName;
	}

	writeToOutputFolder(inputFolderRPathLength, outputFolderRPath){
		let subPath = this.rPath.substring(inputFolderRPathLength, this.rPath.length);

		// Create folders in output folder from sub path

		let subPathFolderNames = subPath.split("/");
		let currentRPath = outputFolderRPath;
		// Create all folders leading to file
		for (let folderName of subPathFolderNames){
			currentRPath += folderName + "/";
			let folderExists = doesFolderExist(currentRPath);
			if (!folderExists){
				// Create folder
				fs.mkdirSync(currentRPath);
			}
		}

		let newPath = outputFolderRPath + subPath;
		fs.writeFileSync(newPath + this.getFileName(), this.fileDataStr);
	}

	static read(fileName, rPath){
		return new JSFile(fileName, rPath, fs.readFileSync(rPath + fileName));
	}
}

module.exports = JSFile;
const fs = require("fs");
const doesFolderExist = require("./helper_functions.js").doesFolderExist;
const findIndexOfChar = require("./helper_functions.js").findIndexOfChar;
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

class JSFile {
	constructor(fileName, rPath, fileDataStr){
		this.fileName = fileName;
		this.rPath = rPath;
		this.fileDataStr = fileDataStr.toString();

		this.functionsAndMethods = [];
		this.classes = [];
	}

	removeOldConsoleLogs(){
		let oldConsoleLogRegex = / *\/\/console\.log([^\n])+\n/g;
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
		let numSpaces = measureIndentingBefore(this.fileDataStr, classDetailsJSON["char_index"]);
		let indenting = createIndenting(numSpaces);
		let commentString = "/*\n" + indenting + "    Class Name: " + classDetailsJSON["name"] + "\n" + indenting + "    Class Description: TODO\n" + indenting + "*/\n" + indenting;
		this.fileDataStr = insertStringIntoStringBeforeCharIndex(commentString, this.fileDataStr, classDetailsJSON["char_index"]); 
	}

	commentMethodOrFunction(mFDetails){
		let charIndex = mFDetails["char_index"];
		//console.log(mFDetails["name"], isPrecededByIgnoreWhiteSpace(this.fileDataStr, mFDetails["char_index"], "*/"))
		// If comment already exists then ignore.
		if (isPrecededByIgnoreWhiteSpace(this.fileDataStr, mFDetails["char_index"], "*/")){
			return;
		}
		if (isPrecededBy(this.fileDataStr, mFDetails["char_index"], "async function ")){
			charIndex -= "async function ".length;
		}else if (isPrecededBy(this.fileDataStr, mFDetails["char_index"], "static async ")){
			charIndex -= "static async ".length;
		}else if (isPrecededBy(this.fileDataStr, mFDetails["char_index"], "async ")){
			charIndex -= "async ".length;
		}else if (isPrecededBy(this.fileDataStr, mFDetails["char_index"], "function ")){
			charIndex -= "function ".length;
		}else if (isPrecededBy(this.fileDataStr, mFDetails["char_index"], "static ")){
			charIndex -= "static ".length;
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
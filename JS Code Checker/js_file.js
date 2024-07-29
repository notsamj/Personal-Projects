const fs = require("fs");
const doesFolderExist = require("./helper_functions.js").doesFolderExist;
const findIndexOfChar = require("./helper_functions.js").findIndexOfChar;
const copyArray = require("./helper_functions.js").copyArray;
const insertStringIntoStringBeforeCharIndex = require("./helper_functions.js").insertStringIntoStringBeforeCharIndex;
const searchForSubstringInString = require("./helper_functions.js").searchForSubstringInString;
class JSFile {
	constructor(fileName, rPath, fileDataStr){
		this.fileName = fileName;
		this.rPath = rPath;
		this.fileDataStr = fileDataStr.toString();

		this.functionsAndMethods = [];
		this.classes = [];
	}

	handleComments(){
		this.identifyMethodsAndFunctions();
		this.indentifyClasses();
		this.addClassAndMethodComments();
	}

	identifyMethodsAndFunctions(){
		let functionMethodRegex = /[a-zA-Z]+\(([a-zA-Z0-9](, ?[a-zA-Z0-9])*)?\)\{/g;
		let functionsAndMethodHeaders = [...this.fileDataStr.matchAll(functionMethodRegex)];

		// Looping through a bunch of these ["function myFunction(a, b)", ...]
		for (let i = 0; i < functionsAndMethodHeaders.length; i++){
			let fOrMethodHeader = functionsAndMethodHeaders[i][0];
			//console.log(fOrMethodHeader, typeof fOrMethodHeader)
			// Note: Assuming there are no two functions with the same name / header
			let charIndex = searchForSubstringInString(fOrMethodHeader, this.fileDataStr);
			let name = fOrMethodHeader.substring(0, findIndexOfChar(fOrMethodHeader, '('));
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
			if (nextToComment["type"] == "class"){
				this.commentClass(nextToComment);
			}else{
				this.commentMethodOrFunction(nextToComment);
			}
		}
	}

	// Note: This destroys the indenting of nested classes
	commentClass(classDetailsJSON){
		let commentString = "/*\n    Class Name: " + classDetailsJSON["name"] + "\n    Class Description: TODO\n*/\n";
		this.fileDataStr = insertStringIntoStringBeforeCharIndex(commentString, this.fileDataStr, classDetailsJSON["char_index"]); 
	}

	commentMethodOrFunction(mFDetails){
		// Note: This won't handle say a method within a class within a class well because of the indenting
		let commentString = "/*\nMethod Name: " + mFDetails["name"] + "\nMethod Parameters: ";
		if (mFDetails["parameters"].length == 0){
			commentString += "None";
		}else{
			for (let parameterName of mFDetails["parameters"]){
				commentString += "\n";
				commentString += "		";
				commentString += parameterName + ":\n";
				commentString += "		    TODO";
			}
		}
		commentString += "Method Description: TODO\nMethod Return: TODO\n*/\n"
		this.fileDataStr = insertStringIntoStringBeforeCharIndex(commentString, this.fileDataStr, mFDetails["char_index"]); 
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
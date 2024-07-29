function doesFolderExist(path){
	let fs = require("fs");
	try {
		// If file is a directory then explore it
		if (fs.statSync(path).isDirectory()){
			return true;
		}
	}catch(error){} // Nothing needed because I don't care? 
	return false;
}

/*
	Method Name: findIndexOfChar
	Method Parameters:

*/
function findIndexOfChar(str, chr){
	for (let i = 0; i < str.length; i++){
		if (str[i] === chr){
			return i;
		}
	}
	return -1; // not found
}

function copyArray(array){
	let newArray = [];
	for (let element of array){ newArray.push(element); }
	return newArray;
}

function insertStringIntoStringBeforeCharIndex(insertString, sourceString, charIndex){
	return sourceString.substring(0, charIndex) + insertString + sourceString.substring(charIndex, sourceString.length);
}

function searchForSubstringInString(subString, sourceString){
	for (let i = 0; i < sourceString.length - subString.length; i++){
		let notAMatch = false;
		let c = 0;
		for (let j = i; j < i + subString.length; j++){
			if (sourceString[j] != subString[c]){
				notAMatch = true;
				break;
			}
			c++;
		}
		if (notAMatch){ continue; }
		return i;
	}
	return -1;
}

module.exports = {
	doesFolderExist,
	findIndexOfChar,
	copyArray,
	insertStringIntoStringBeforeCharIndex,
	searchForSubstringInString
}
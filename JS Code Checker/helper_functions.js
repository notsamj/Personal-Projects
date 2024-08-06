function objectHasKey(obj, key){
	for (let objKey of Object.keys(obj)){
		if (objKey === key){
			return true;
		}
	}
	return false;
}

function multiplyString(str, count){
	let multipliedString = "";
	for (let i = 0; i < count; i++){
		multipliedString += str;
	}
	return multipliedString;
}

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

function findIndexOfChar(str, char){
	for (let i = 0; i < str.length; i++){
		if (str[i] === char){
			return i;
		}
	}
	return -1; // not found
}

function findNextIndexOfChar(str, char, startingIndex){
	for (let i = startingIndex; i < str.length; i++){
		if (str[i] === char){
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

function measureIndentingBefore(sourceString, charIndex){
	let c = 0;
	for (let i = charIndex - 1; i >= 0; i--){
		if (sourceString[i] === ' '){
			c++;
		}else{
			break;
		}
	}
	return c;
}

function createIndenting(size){
	let indenting = "";
	for (let i = 0; i < size; i++){
		indenting += " ";
	}
	return indenting;
}

function isPrecededBy(sourceString, characterIndex, subString){
	if (characterIndex < subString.length){ return false; }
	for (let i = characterIndex - 1; i >= characterIndex - subString.length; i--){
		if (sourceString[i] != subString[subString.length - (characterIndex - i)]){
			return false;
		}
	}
	return true;
}

/*
TODO: Remove I think this has some issues
function isPrecededByIgnoreWhiteSpace(sourceString, characterIndex, subString){
	let whiteSpace = /\s/;
	if (characterIndex < subString.length){ return false; }
	let j = 1;
	let wsCount = 0;
	for (let i = characterIndex - 1; i >= characterIndex - subString.length - wsCount; i--){
		// Ignore white space
		if (whiteSpace.test(sourceString[i])){
			wsCount++;
			continue;
		}
		if (sourceString[i] != subString[subString.length - j]){
			return false;
		}
		j++;
	}
	return true;
}
*/
function isPrecededByIgnoreWhiteSpace(sourceString, characterIndex, subString){
	let whiteSpace = /\s/;
	let i = characterIndex - 1;
	let matchCount = 0;
	let requiredMatches = subString.length;
	while (i >= 0){
		let currentCharacter = sourceString[i];
		let isWhiteSpace = whiteSpace.test(currentCharacter);
		if (isWhiteSpace){
			i--;
			continue;
		}
		// If the character does not match then it doesn't precede
		if (currentCharacter != subString[subString.length - 1 - matchCount]){
			return false;
		}
		matchCount++;
		if (matchCount == requiredMatches){
			return true;
		}
		i--;
	}
	return false;
}

function searchForSubstringInStringAfter(subString, sourceString, startPoint){
	for (let i = startPoint+1; i < sourceString.length - subString.length; i++){
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

function deleteXCharsAt(sourceString, charIndex, x){
	return sourceString.substring(0, charIndex) + sourceString.substring(charIndex + x, sourceString.length);
}

function whatLineInString(sourceString, characterIndex){
	let lineCount = 1;
	for (let i = 0; i < characterIndex; i++){
		if (sourceString[i] === '\n'){
			lineCount++;
		}
	}
	return lineCount;
}

function insertIntoStringBefore(insertString, sourceString, charIndex){
	return sourceString.substring(0, charIndex) + insertString + sourceString.substring(charIndex, sourceString.length);
}

function collectCharactersUntilMeetingChar(sourceString, charIndex, charToLookFor){
	let subString = "";
	for (let i = charIndex; i < sourceString.length; i++){
		if (sourceString[i] == charToLookFor){
			break;
		}
		subString += sourceString[i];
	}
	return subString;
}

function collectCharactersUntilMeetingStr(sourceString, characterIndex, str){
	let subString = "";
	for (let i = characterIndex; i < sourceString.length - str.length + 1; i++){
		let meetingStr = true;
		for (let j = i; j < i + str.length; j++){
			if (sourceString[j] != str[j-i]){
				meetingStr = false;
				break;
			}
		}

		if (meetingStr){ break; }
		
		subString += sourceString[i];
	}
	return subString;	
}

function countOccurancesOfSubString(sourceString, subString){
	let occurances = 0;
	for (let i = 0; i < sourceString.length - subString.length + 1; i++){
		let match = true;
		for (let j = i; j < i + subString.length; j++){
			if (sourceString[j] != subString[j-i]){
				match = false;
				break;
			}
		}
		if (match){
			occurances++;
		}
	}
	return occurances;
}

function appendLists(list1, list2){
	let newList = [];
	for (let item of list1){
		newList.push(list1);
	}
	for (let item of list2){
		newList.push(list2);
	}
	return newList;
}

module.exports = {
	doesFolderExist,
	findIndexOfChar,
	findNextIndexOfChar,
	copyArray,
	insertStringIntoStringBeforeCharIndex,
	searchForSubstringInString,
	measureIndentingBefore,
	createIndenting,
	isPrecededBy,
	isPrecededByIgnoreWhiteSpace,
	searchForSubstringInStringAfter,
	deleteXCharsAt,
	whatLineInString,
	insertIntoStringBefore,
	multiplyString,
	objectHasKey,
	collectCharactersUntilMeetingChar,
	collectCharactersUntilMeetingStr,
	countOccurancesOfSubString,
	appendLists
}
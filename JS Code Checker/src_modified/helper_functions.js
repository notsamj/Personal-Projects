/*
    Function Name: objectHasKey
    Function Parameters: 
        obj:
            A JSON object
         key:
            A key
    Function Description: Checks if a JSON object has a given key
    Function Return: Boolean
*/
function objectHasKey(obj, key){
    for (let objKey of Object.keys(obj)){
        if (objKey === key){
            return true;
        }
    }
    return false;
}

/*
    Function Name: multiplyString
    Function Parameters: 
        str:
            A string
         count:
            The desired number of occurances of the string
    Function Description: Repeats a string a given number of times
    Function Return: String
*/
function multiplyString(str, count){
    let multipliedString = "";
    for (let i = 0; i < count; i++){
        multipliedString += str;
    }
    return multipliedString;
}

/*
    Function Name: doesFolderExist
    Function Parameters: 
        path:
            A string, path to a folder
    Function Description: Checks if a folder with a given path exists
    Function Return: Boolean
*/
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
    Function Name: findIndexOfChar
    Function Parameters: 
        str:
            A string to search through
         char:
            A character to find
    Function Description: Searchs a string for a character
    Function Return: Integer, index in the string or -1 if not found
*/
function findIndexOfChar(str, char){
    for (let i = 0; i < str.length; i++){
        if (str[i] === char){
            return i;
        }
    }
    return -1; // not found
}

/*
    Function Name: findNextIndexOfChar
    Function Parameters: 
        str:
            A string to search through
         char:
            A character to find
         startingIndex:
            The index at which to start the search
    Function Description: Searchs a string for a character. Starting from a provided index
    Function Return: Integer, index in the string or -1 if not found
*/
function findNextIndexOfChar(str, char, startingIndex){
    for (let i = startingIndex; i < str.length; i++){
        if (str[i] === char){
            return i;
        }
    }
    return -1; // not found
}

/*
    Function Name: copyArray
    Function Parameters: 
        array:
            An array
    Function Description: Coppies an array into a new array
    Function Return: Array
*/
function copyArray(array){
    let newArray = [];
    for (let element of array){ newArray.push(element); }
    return newArray;
}

/*
    Function Name: insertStringIntoStringBeforeCharIndex
    Function Parameters: 
        insertString:
            A string to insert
         sourceString:
            A string to have the other string inserted into
         charIndex:
            A character index at which to insert the string
    Function Description: Inserts one string into another at a given position
    Function Return: String
*/
function insertStringIntoStringBeforeCharIndex(insertString, sourceString, charIndex){
    return sourceString.substring(0, charIndex) + insertString + sourceString.substring(charIndex, sourceString.length);
}

/*
    Function Name: searchForSubstringInString
    Function Parameters: 
        subString:
            A substring
         sourceString:
            A string which may contain the substring
    Function Description: Finds the location of a given substring inside a string
    Function Return: Integer, the index of the start of the substring, -1 if not found
*/
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

/*
    Function Name: measureIndentingBefore
    Function Parameters: 
        sourceString:
            A string
        charIndex:
            The index at which to check for indenting prior
    Function Description: Counts how many spaces are ahead of a point in a string until it reaches a non-space
    Function Return: Integer, the number of spaces
*/
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

/*
    Function Name: createIndenting
    Function Parameters: 
        size:
            The number of spaces to include
    Function Description: Creates a string of spaces of the given size
    Function Return: String
*/
function createIndenting(size){
    let indenting = "";
    for (let i = 0; i < size; i++){
        indenting += " ";
    }
    return indenting;
}

/*
    Function Name: isPrecededBy
    Function Parameters: 
        sourceString:
            A string
        characterIndex:
            An index in the source string
        subString:
            A substring to look for
    Function Description: Checks if a character index in the source string is preceded by a substring
    Function Return: Boolean
*/
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
    Function Name: isPrecededByIgnoreWhiteSpace
    Function Parameters: 
        sourceString:
            A string
        characterIndex:
            An index in the source string
        subString:
            A substring to look for
    Function Description: Checks if a character index in the source string is preceded by a substring. Ignores all white space.
    Function Return: Boolean
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

/*
    Function Name: searchForSubstringInStringAfter
    Function Parameters: 
        subString:
            A string
        sourceString:
            A string
        startPoint:
            Integer, character index in source string
    Function Description: Finds a substring in a source string after a given point
    Function Return: Integer, character index if found, -1 if not found
*/
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

/*
    Function Name: deleteXCharsAt
    Function Parameters: 
        sourceString:
            A string
        charIndex:
            A location in the source string
        x:
            The number of characters to delete
    Function Description: Removes x characters from a string at a given location
    Function Return: String
*/
function deleteXCharsAt(sourceString, charIndex, x){
    return sourceString.substring(0, charIndex) + sourceString.substring(charIndex + x, sourceString.length);
}

/*
    Function Name: whatLineInString
    Function Parameters: 
        sourceString:
            A string
         characterIndex:
            A location in the source string
    Function Description: Counts the lines at determines what line of the string a character index is on
    Function Return: Integer
*/
function whatLineInString(sourceString, characterIndex){
    let lineCount = 1;
    for (let i = 0; i < characterIndex; i++){
        if (sourceString[i] === '\n'){
            lineCount++;
        }
    }
    return lineCount;
}

/*
    Function Name: insertIntoStringBefore
    Function Parameters: 
        insertString:
            A string
        sourceString:
            A string
        charIndex:
            A location in the source string
    Function Description: Inserts a string into the source string
    Function Return: String
*/
function insertIntoStringBefore(insertString, sourceString, charIndex){
    return sourceString.substring(0, charIndex) + insertString + sourceString.substring(charIndex, sourceString.length);
}

/*
    Function Name: collectCharactersUntilMeetingChar
    Function Parameters: 
        sourceString:
            A string
         charIndex:
            An index at which to start collecting characters
         charToLookFor:
            The character at which to end the collection
    Function Description: Collects characters in a string from a point until it meets a given character
    Function Return: String
*/
function collectCharactersUntilMeetingChar(sourceString, charIndex, charToLookFor){
    let subString = "";
    for (let i = charIndex; i < sourceString.length; i++){
        if (sourceString[i] === charToLookFor){
            break;
        }
        subString += sourceString[i];
    }
    return subString;
}

/*
    Function Name: collectCharactersUntilMeetingStr
    Function Parameters: 
        sourceString:
            A string
         characterIndex:
            A location in the source string
         str:
            A string to look for
    Function Description: Collects character in a string until meeting a provided substring
    Function Return: String
*/
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

/*
    Function Name: countOccurancesOfSubString
    Function Parameters: 
        sourceString:
            A string
         subString:
            A string
    Function Description: Counts occurances of a substring in a string
    Function Return: Integer
*/
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

/*
    Function Name: appendLists
    Function Parameters: 
        list1:
            A list
         list2:
            A list
    Function Description: Appends two lists to make a new list
    Function Return: List
*/
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

/*
    Function Name: listsEqual
    Function Parameters: 
        list1:
            A list
         list2:
            A list
    Function Description: Checks if two lists are identical
    Function Return: Boolean
*/
function listsEqual(list1, list2){
    if (list1.length != list2.length){
        return false;
    }
    for (let i = 0; i < list1.length; i++){
        if (list1[i] != list2[i]){
            return false;
        }
    }
    return true;
}

/*
    Function Name: listContainsElement
    Function Parameters: 
        myList:
            A list
         element:
            A value
    Function Description: Checks if a list contains a given value
    Function Return: Boolean
*/
function listContainsElement(myList, element){
    for (let elementInList of myList){
        if (element == elementInList){
            return true;
        }
    }
    return false;
}

/*
    Function Name: getLineBefore
    Function Parameters: 
        str:
            A string
        charIndex:
            A location in the string
    Function Description: Collects a string of the line before the current line (at charIndex) in a string
    Function Return: String
*/
function getLineBefore(str, charIndex){
    let linesBefore = 0;
    let lineBefore = "";
    for (let i = charIndex; i >= 0; i--){
        let char = str[i];
        if (char == '\n'){
            linesBefore++;
            if (linesBefore > 1){
                break;
            }
            continue;
        }else if (linesBefore == 1){
            lineBefore += char;
        }
    }
    return reverseString(lineBefore);
}

/*
    Function Name: reverseString
    Function Parameters: 
        str:
            A string
    Function Description: Reverses a string
    Function Return: String
*/
function reverseString(str){
    let reversedString = "";
    for (let i = str.length - 1; i >= 0; i--){
        reversedString += str[i];
    }
    return reversedString;
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
    appendLists,
    listsEqual,
    listContainsElement,
    getLineBefore,
    reverseString
}
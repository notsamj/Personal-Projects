const fs = require("fs");
const collectCharactersUntilMeetingChar = require("./helper_functions.js").collectCharactersUntilMeetingChar;
const searchForSubstringInString = require("./helper_functions.js").searchForSubstringInString;
const whatLineInString = require("./helper_functions.js").whatLineInString;
let str = fs.readFileSync("./in/scripts/gamemodes/gamemode_remote_translator.js").toString();
let sourceStr = "*/\n    // TODO: Do something else\n    /*";
//let result = collectCharactersUntilMeetingChar(sourceStr, "*/\n    ".length, '\n');
//console.log(result)
let singleLineTODORegex = /\/\/ *TODO/g;
let singleLineTODOs = [...sourceStr.matchAll(singleLineTODORegex)];
let singleLineTODOData = [];

for (let singleLineTODOMatch of singleLineTODOs){
	let singleLineTODOStr = singleLineTODOMatch[0];
	console.log("substring", singleLineTODOStr)
	let charIndex = searchForSubstringInString(singleLineTODOStr, sourceStr);
	let lineNumber = whatLineInString(sourceStr, charIndex);
	let todoContentsStr = collectCharactersUntilMeetingChar(sourceStr, charIndex, '\n');
	console.log("got", todoContentsStr, charIndex)
	singleLineTODOData.push({"line_number": lineNumber, "todo_str": todoContentsStr});
}
const fs = require("fs");
const doesFolderExist = require("./helper_functions.js").doesFolderExist;
class JSFile {
	constructor(fileName, rPath, fileDataStr){
		this.fileName = fileName;
		this.rPath = rPath;
		this.fileDataStr = fileDataStr;
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
		console.log("Writing", newPath + this.getFileName())
		fs.writeFileSync(newPath + this.getFileName(), this.fileDataStr);
	}

	static read(fileName, rPath){
		return new JSFile(fileName, rPath, fs.readFileSync(rPath + fileName));
	}
}

module.exports = JSFile;
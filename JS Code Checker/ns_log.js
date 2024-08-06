const fs = require("fs");
class NSLog {
	constructor(){
		this.logData = "";
	}

	write(str){
		this.logData += str;
	}

	writeAtBeginning(str){
		this.logData = str + this.logData;
	}

	saveToFile(outputFolderRPath){
		fs.writeFileSync(outputFolderRPath + "js_code_checker_log.txt", this.logData);
	}
}

module.exports = NSLog;
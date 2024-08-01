const fs = require("fs");
class NSLog {
	constructor(){
		this.logData = "";
	}

	write(str){
		this.logData += str;
	}

	writeAtBeginning(str){
		this.logData = str + logData;
	}

	saveToFile(){
		fs.writeFileSync("log.txt", this.logData);
	}
}

module.exports = NSLog;
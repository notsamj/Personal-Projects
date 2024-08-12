const fs = require("fs");
/*
    Class Name: NSLog
    Class Description: TODO
*/
class NSLog {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    constructor(){
        this.logData = "";
    }

    /*
        Method Name: write
        Method Parameters: 
            str:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    write(str){
        this.logData += str;
    }

    /*
        Method Name: writeAtBeginning
        Method Parameters: 
            str:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    writeAtBeginning(str){
        this.logData = str + this.logData;
    }

    /*
        Method Name: saveToFile
        Method Parameters: 
            outputFolderRPath:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    saveToFile(outputFolderRPath){
        fs.writeFileSync(outputFolderRPath + "js_code_checker_log.txt", this.logData);
    }
}

module.exports = NSLog;
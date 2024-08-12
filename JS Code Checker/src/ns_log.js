const fs = require("fs");
const doesFolderExist = require("./helper_functions.js").doesFolderExist;
/*
    Class Name: NSLog
    Class Description: A log of information
*/
class NSLog {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: Constructor
        Method Return: Constructor
    */
    constructor(){
        this.logData = "";
    }

    /*
        Method Name: write
        Method Parameters: 
            str:
                A string
        Method Description: Adds a string to the log data
        Method Return: void
    */
    write(str){
        this.logData += str;
    }

    /*
        Method Name: writeAtBeginning
        Method Parameters: 
            str:
                A string
        Method Description: Adds a string to the start of the log data
        Method Return: void
    */
    writeAtBeginning(str){
        this.logData = str + this.logData;
    }

    /*
        Method Name: saveToFile
        Method Parameters: 
            outputFolderRPath:
                String. A relative path to the output folder.
        Method Description: Writes the log to a file
        Method Return: void
    */
    saveToFile(outputFolderRPath){
        let folderExists = doesFolderExist(outputFolderRPath);
        if (!folderExists){
            // Create folder
            fs.mkdirSync(outputFolderRPath);
        }
        fs.writeFileSync(outputFolderRPath + "js_code_checker_log.txt", this.logData);
    }
}

module.exports = NSLog;
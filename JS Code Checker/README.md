# JS Code Checker
##### Written by: Samuel Jones
####

## Application purpose
The purpose of JS Code Checker is to modify and analyze JavaScript files.

## Application features
  ### Class comments
  After running the application, code blocks such as
  ```
    class DataCollector {
  ```
  will automatically receive class block comments like
  ```
    /*
        Class Name: DataCollector
        Class Description: TODO
    */
    class DataCollector {
  ```
  ### Function Comments
    After running the application, code blocks such as
  ```
function objectHasKey(obj, key){
  ```
  will automatically receive function block comments like
  ```
/*
    Function Name: objectHasKey
    Function Parameters: 
        obj:
            TODO
         key:
            TODO
    Function Description: TODO
    Function Return: TODO
*/
function objectHasKey(obj, key){
  ```
  ### Method Comments
    After running the application, code blocks such as
  ```
    getValueOrSetTo(valueName, value){
  ```
  will automatically receive method block comments like
  ```
    /*
        Method Name: getValueOrSetTo
        Method Parameters: 
            valueName:
                TODO
             value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getValueOrSetTo(valueName, value){
  ```
  ### Updating console.logs
    After running the application, code blocks such as
  ```
    console.log("$FL"); // Assume this is on line 9
    console.log("console_log_showcase.js (L5)"); // Assume this is on line 10
  ```
  will automatically receive updates like
  ```
    console.log("console_log_showcase.js (L9)"); // Assume this is on line 9
    console.log("console_log_showcase.js (L10)"); // Assume this is on line 10
  ```
  ### Counting statements
  The summary provided by the application provides an estimated number of statements in the code.

  ### Old console logs
  This application removes statements like `//console.log("Here");`.

  ### TODO counting
  This application counts the substring "TODO" (case-sensitive) in files.

  ### TODO Capturing
  This application records TODOs it finds in files and saves them to the log for convinient viewing.

  ### Logging
  This application may summarize its findings to the console, it will always save the full record of it's results to a log file "js_code_checker_log.txt".

  ### Safe-output
  This application lets the user specify their desired output directory. If the program screws up with its modifications, it will only affect the specified output folder.

  ### Configuration
  This application allows for configuration with the settings.json in "/src/". Presets can be created in the JSON format, default settings are used with overrides from whatever preset is selected.

  ### Abstract Classes
  This application allows classes to be specified as abstract classes by including a comment before.
  ```
  // nsAbstractClass
  class AbstractClassOne {
  ```
  An abstract class can be implemented like this
  ```
  // nsRequire {"extends": ["AbstractClassOne"]}
  class myTestClass3 {
  ```
  This is useful for ensuring classes have member variables from their extended Abstract Class, if they don't, it'll show up in the log. It also ensures all methods are implemented (and the parameters).
  ```
  // nsMethodExactMatch
  myAbstractMethod2(a,b){
      console.log("testing2!!!");
  }
  ```
  This code tells the code checker to ensure myAbstractMethod2 code matches the code provided in the abstract class.

  ### Interfaces
  This application allows classes to be specified as Interfaces by including a comment before.
  ```
  // nsInterface
  class InterfaceOne {
  ```
  An abstract class can be implemented like this
  ```
  // nsRequire {"implements": ["InterfaceOne"]}
  class myTestClass8 {
  ```
  This is useful for ensuring classes implement the expected methods from an interface.
## How to run the application
Code for run.sh
```
clear
cd src
node js_code_checker ../in/ ../out/ default_with_no_logs
```
When running the application call `ns_code_checker.js` with arguments 
1. Relative path to the input folder
2. Relative path to the output folder
3. Name of the preset being used

## Application warnings
This application may have some bugs that will wreck js files. It is recommended the output folder used is different than the input folder to prevent breaking the files.

Some known issues are recorded in `current_todo.txt`

## Future application development
I will continue to use this application to help me write JavaScript applications. If I see fit, I will update it in the future.

## Application background
I made this app because I was sick of writing block comments for functions, methods and classes. I felt that I could reduce the workload by having most of the comment written automatically.

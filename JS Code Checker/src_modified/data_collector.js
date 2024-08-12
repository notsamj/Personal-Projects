const objectHasKey = require("./helper_functions.js").objectHasKey;
/*
    Class Name: DataCollector
    Class Description: Collects and stores data
*/
class DataCollector {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: Constructor
        Method Return: Constructor
    */
    constructor(){
        this.storage = {};
    }

    /*
        Method Name: getValueOrSetTo
        Method Parameters: 
            valueName:
                The name of the value
             value:
                The value to store
        Method Description: Finds a value with a given name, if this does not exist, stores and returns provided value
        Method Return: Variable type
    */
    getValueOrSetTo(valueName, value){
        if (!this.hasValue(valueName)){
            this.setValue(valueName, value);
        }
        return this.getDataValue(valueName);
    }

    /*
        Method Name: setValue
        Method Parameters: 
            valueName:
                The name of the value to store
             value:
                The value to store
        Method Description: Stores a value
        Method Return: None
    */
    setValue(valueName, value){
        this.storage[valueName] = value;
    }

    /*
        Method Name: hasValue
        Method Parameters: 
            valueName:
                The name of the value to check for
        Method Description: Determines if this data collector is storing a value with the provided name
        Method Return: Boolean
    */
    hasValue(valueName){
        return objectHasKey(this.storage, valueName);
    }

    /*
        Method Name: incrementCounter
        Method Parameters: 
            valueName:
                The name of the value to increment
        Method Description: Increments a counter value
        Method Return: void
    */
    incrementCounter(valueName){
        // 0 if doesn't exist
        if (!this.hasValue(valueName)){
            this.setValue(valueName, 0);
        }
        this.storage[valueName]++;
    }

    /*
        Method Name: getDataValue
        Method Parameters: 
            valueName:
                The name of the value to find
        Method Description: Finds a value, if not found, returns zero
        Method Return: Variable type
    */
    getDataValue(valueName){
        // 0 if doesn't exist
        if (!this.hasValue(valueName)){
            return 0;
        }
        return this.storage[valueName];
    }
    
    /*
        Method Name: getValue
        Method Parameters: 
            valueName:
                The name of the value to find
        Method Description: An alias for the method 
        Method Return: Variable type
    */
    getValue(valueName){
        return this.getDataValue(valueName);
    }
}

module.exports = DataCollector;
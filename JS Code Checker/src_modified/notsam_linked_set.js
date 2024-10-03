// If using NodeJS then import
if (typeof window === "undefined"){
    NotSamLinkedList = require("./notsam_linked_list.js");
}
/*
    Class Name: NotSamLinkedSet
    Description: A doubly linked list functioning as a set
*/
class NotSamLinkedSet extends NotSamLinkedList {
    /*
        Method Name: constructor
        Method Parameters:
            array:
                An array used to initialize the data for this linked list
        Method Description: Constructor
        Method Return: Constructor
    */
    constructor(array=null){
        super(array);
    }

    /*
        Method Name: append
        Method Parameters: 
            value:
                Unknown type. A value to add to the set
        Method Description: Adds a value to the set
        Method Return: void
    */
    append(value){
        if (this.has(value)){ return; }
        super.append(value);
    }
}

// If using NodeJS then export the class
if (typeof window === "undefined"){
    module.exports = NotSamLinkedSet;
}
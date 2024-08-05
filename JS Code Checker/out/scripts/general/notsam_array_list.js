/*
    Class Name: NotSamArrayList
    Description: An implementation of the ArrayList pattern.
    Note:
    This implementation was initially created in 2020 / 2021 by Samuel
    using the moniker NotSam for reasons that I chose not to disclose.
    It has been reappropriated for this program in 2023 and keeps the 'NotSam' to differentiate it 
    from a non-custom ArrayList.
*/
class NotSamArrayList {
    /*
        Method Name: constructor
        Method Parameters:
            array:
                An array used to initialize the data for this array list
            size:
                The current size of the array list
            size_inc:
                A function used to increase the size when the space limit is met
        Method Description: Constructor
        Method Return: Constructor
    */
    constructor(array=null, size=1, size_inc=(size) => size * 2){
        this.size_inc = size_inc;
        if (array == null){
            this.size = size;
            this.array = new Array(this.size);
            this.length = 0;
        }else{
            this.size = array.length;
            this.length = array.length;
            this.array = new Array(this.size);
            this.convert_from_array(array);
        }
    }

    /*
        Method Name: countCondition
        Method Parameters:
            conditionFunction:
                A function taking one parameter and returning true or flase
        Method Description: Counts the number of elements satisfying a condition
        Method Return: Integer
    */
    /*
        Method Name: countCondition
        Method Parameters: 
            conditionFunction:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    countCondition(conditionFunction){
        let count = 0;
        for (let i = 0; i < this.length; i++){
            if (conditionFunction(this.array[i])){
                count++;
            }
        }
        return count;
    }

    /*
        Method Name: clear
        Method Parameters: None
        Method Description: Effectively clear the array of elements (not in terms of actual storage use)
        Method Return: void
    */
    /*
        Method Name: clear
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    clear(){
        this.length = 0;
    }

    /*
        Method Name: convert_from_array
        Method Parameters:
            array:
                An array used to initialize the data for this array list
        Method Description: Adds all elements from array to the array list
        Method Return: void
    */
    convert_from_/*
    Method Name: array
    Method Parameters: 
        array:
            TODO
    Method Description: TODO
    Method Return: TODO
*/
array(array){
        for (var i = 0; i < array.length; i++){
            this.add(array[i]);
        }
    }

    /*
        Method Name: resize
        Method Parameters: None
        Method Description: Increases the maximum size of the array list
        Method Return: void
    */
    /*
        Method Name: resize
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    resize(){
        this.size = this.size_inc(this.size);
        var newArray = new Array(this.size);
        for (var i = 0; i < this.length; i++){
            newArray[i] = this.array[i];
        }
        this.array = newArray;
    }

    /*
        Method Name: getLength
        Method Parameters: None
        Method Description: Getter
        Method Return: int
    */
    /*
        Method Name: getLength
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getLength(){
        return this.length;
    }

    /*
        Method Name: add
        Method Parameters:
            value:
                Value to add
        Method Description: Add a value to the end of the array list
        Method Return: void
    */
    /*
        Method Name: add
        Method Parameters: 
            value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    add(value){
        if (this.getLength() == this.getSize()){
            this.resize();
        }

        this.array[this.getLength()] = value;
        this.length++;
    }

    /*
        Method Name: add
        Method Parameters:
            value:
                Value to add
        Method Description: Add a value to the end of the array list
        Method Return: void
    */
    /*
        Method Name: append
        Method Parameters: 
            value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    append(value){
        this.add(value);
    }

    /*
        Method Name: push
        Method Parameters:
            value:
                Value to add
        Method Description: Add a value to the end of the array list
        Method Return: void
    */
    /*
        Method Name: push
        Method Parameters: 
            value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    push(value){
        this.add(value);
    }

    /*
        Method Name: has
        Method Parameters:
            value:
                Value to be checked
        Method Description: Check if the arraylist includes a value
        Method Return: boolean, true -> array list has the value, false -> array list does NOT have the value
    */
    /*
        Method Name: has
        Method Parameters: 
            value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    has(value){
        var index = this.search(value);
        return !(index == -1);
    }

    /*
        Method Name: search
        Method Parameters:
            value:
                Value to be checked
        Method Description: Search the array list for a value and return the index found (-1 if not found)
        Method Return: int
    */
    /*
        Method Name: search
        Method Parameters: 
            value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    search(value){
        for (var i = 0; i < this.getLength(); i++){
            if (this.array[i] === value){
                return i;
            }  
        }

        return -1;
    }

    /*
        Method Name: getSize
        Method Parameters: None
        Method Description: Getter
        Method Return: int
    */
    /*
        Method Name: getSize
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getSize(){
        return this.size;
    }


    /*
        Method Name: getElement
        Method Parameters:
            e:
                Element to find
        Method Description: Find an element by its value
        Method Return: Object (unknown type)
        Note: Assume element exists. Also I realize this method is really stupid and pointless? Whatever 
        CAUTION DO NOT USE (but I won't bother to delete it)
    */
    /*
        Method Name: getElement
        Method Parameters: 
            e:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    getElement(e){
        var index = this.search(e);
        return this.get(index)
    }

    /*
        Method Name: get
        Method Parameters:
            index:
                Index at which to find element that is being looked for
        Method Description: Get the element @ index {index}
        Method Return: Object (unknown type)
    */
    /*
        Method Name: get
        Method Parameters: 
            index:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    get(index){
        if (!((index >= 0 && index < this.getLength()))){
            return null;
        }
        return this.array[index];
    }

    /*
        Method Name: remove
        Method Parameters:
            index:
                Index at which to find element that is being looked for
        Method Description: Remove the element @ index {index}
        Method Return: void
    */
    /*
        Method Name: remove
        Method Parameters: 
            index:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    remove(index){
        if (!((index >= 0 && index < this.getLength()))){
            return;
        }
        this.array[index] = null;
        for (var i = index; i < this.getLength(); i++){
            this.array[i] = this.array[i+1];
        }
        this.length -= 1;
    }

    /*
        Method Name: copy
        Method Parameters: None
        Method Description: Create a copy of the array list
        Method Return: NotSamArrayList
    */
    /*
        Method Name: copy
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    copy(){
        var newArr = new NotSamArrayList();
        for (var i = 0; i < this.getLength(); i++){
            newArr.add(this.array[i]);
        }
        return newArr;
    }

    /*
        Method Name: print
        Method Parameters: None
        Method Description: Print out all the elements of the array list
        Method Return: void
    */
    /*
        Method Name: print
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    print(){
        console.log("s")
        for (var i = 0; i < this.getLength(); i++){
            console.log(i, this.get(i));
        }
        console.log("f")
    }

    /*
        Method Name: isEmpty
        Method Parameters: None
        Method Description: Determine if the array list is empty
        Method Return: boolean, true -> empty, false -> not empty
    */
    /*
        Method Name: isEmpty
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    isEmpty(){ return this.getLength() == 0; }

    /*
        Method Name: set
        Method Parameters:
            index:
                index at which to set the value
            value:
                value to put @ {index}
        Method Description: Put value into position {index}
        Method Return: void
    */
    /*
        Method Name: set
        Method Parameters: 
            index:
                TODO
             value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    set(index, value){
        this.array[index] = value;
    }

    /*
        Method Name: put
        Method Parameters:
            index:
                index at which to set the value
            value:
                value to put @ {index}
        Method Description: Put value into position {index}
        Method Return: void
    */
    /*
        Method Name: put
        Method Parameters: 
            index:
                TODO
             value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    put(index, value){
        this.set(index, value);
    }

    /*
        Method Name: fillWithPlaceholder
        Method Parameters:
            value:
                value to put in all array slots
        Method Description: Fill the arraylist with a placeholder value
        Method Return: void
    */
    /*
        Method Name: fillWithPlaceholder
        Method Parameters: 
            value:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    fillWithPlaceholder(value){
        while (this.getLength() < this.getSize()){
            this.add(value);
        }
    }

    /*
        Method Name: *[Symbol.iterator]
        Method Parameters: None
        Method Description: Provide each element of the arraylist and its index
        Method Return: N/A
    */
    *[Symbol.iterator](){
        for (let i = 0; i < this.getLength(); i++){
            yield [this.array[i], i];
        }
    }
}
// If using NodeJS -> Export the class
if (typeof window === "undefined"){
    module.exports = NotSamArrayList;
}
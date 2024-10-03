/*
    Function Name: timeStampToSeconds
    Function Parameters: 
        timeStampString:
            A time stamp string
    Function Description: Converts a time stamp string to a float
    Function Return: Float
*/
function timeStampToSeconds(timeStampString){
    let split = timeStampString.split(":");
    return 60 * 60 * parseInt(split[0]) + 60 * parseInt(split[1]) + parseInt(split[2]);
}

/*
    Function Name: secondsToTimeStamp
    Function Parameters: 
        audioSecondsLength:
            Float seconds audio length
    Function Description: Creates a time stamp string from a float representing an amount of seconds
    Function Return: String
*/
function secondsToTimeStamp(audioSecondsLength){
    let hours = Math.floor(audioSecondsLength / (60 * 60));
    let minutes = Math.floor((audioSecondsLength - hours * (60 * 60)) / 60);
    let seconds = audioSecondsLength - hours * (60 * 60) - minutes * 60;
    let hoursString;
    if (hours >= 10){
        hoursString = hours.toString();
    }else{
        hoursString = "0" + hours.toString();
    }

    let minutesString;
    if (minutes >= 10){
        minutesString = minutes.toString();
    }else{
        minutesString = "0" + minutes.toString();
    }

    let secondsString;
    if (seconds >= 10){
        secondsString = Math.floor(seconds).toString();
    }else{
        secondsString = "0" + Math.floor(seconds).toString();
    }
    return hoursString + ":" + minutesString + ":" + secondsString;
}

/*
    Method Name: getLocalStorage
    Method Parameters:
        key:
            Key of the item in local storage
        valueIfNotFound:
            Value to return if the item cannot be found
    Method Description: Finds a value from storage, returns valueIfNotFound if not found.
    Method Return: void
*/
function getLocalStorage(key, valueIfNotFound=null){
    // In node js, you can't access this storage
    if (typeof window === "undefined"){ return valueIfNotFound; }
    let value = localStorage.getItem(key);
    if (value == null){
        return valueIfNotFound;
    }
    return value;
}

/*
    Method Name: setLocalStorage
    Method Parameters:
        key:
            Key of the item in local storage
        value:
            Value to put in local storage
    Method Description: Assignes a key to a value in local storage. Errors are not *really* handled.
    Method Return: void
*/
function setLocalStorage(key, value){
    // In node js, you can't access this storage
    if (typeof window === "undefined"){ return; }
    try {
        localStorage.setItem(key, value);
    }catch(e){}
}

/*
    Method Name: getScreenWidth
    Method Parameters: None
    Method Description: Determines the screen width in real pixels
    Method Return: void
*/
function getScreenWidth(){
    return window.innerWidth; // * pixelSomething density in the future?
}
/*
    Method Name: getScreenHeight
    Method Parameters: None
    Method Description: Determines the screen height in real pixels
    Method Return: void
*/
function getScreenHeight(){
    return window.innerHeight;
}
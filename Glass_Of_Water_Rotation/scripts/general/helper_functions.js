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

/*
    Method Name: toRadians
    Method Parameters:
        degrees:
            The number of degrees to convert to radians
    Method Description: Converts degrees to radians
    Method Return: float
*/
function toRadians(degrees){
    return degrees * Math.PI / 180;
}

/*
    Method Name: angleBetweenCCWRAD
    Method Parameters:
        angle:
            An angle in radians
        eAngle1:
            An angle on one edge of a range (radians)
        eAngle2:
            An angle on the other edge of a range (radians)
    Method Description: Determines if angle is between eAngle1 and eAngle2 in the counter clockwise direction
    Method Return: boolean, true -> angle is between, false -> angle is not between
*/
function angleBetweenCCWRAD(angle, eAngle1, eAngle2){
    if (angle < eAngle1){
        angle += 2 * Math.PI;
    }
    if (eAngle2 < eAngle1){
        eAngle2 += 2 * Math.PI;
    }
    let distanceFromEAngle1ToAngleCCW = angle - eAngle1;
    let distanceFromEAngle1ToEAngle2CCW = eAngle2 - eAngle1;
    return distanceFromEAngle1ToAngleCCW <= distanceFromEAngle1ToEAngle2CCW;
}

/*
    Method Name: rotateCCWRAD
    Method Parameters:
        angle:
            Angle to rotate
        amount:
            Amount to rotate by
    Method Description: Rotates an angle counter clockwise by an amount
    Method Return: float
*/
function rotateCCWRAD(angle, amount){
    return fixRadians(angle + amount);
}

/*
    Method Name: fixRadians
    Method Parameters:
        angle:
            An angle to "fix"
    Method Description: Fixes an angle to the range [0,2*PI)
    Method Return: float
*/
function fixRadians(angle){
    while (angle < 0){
        angle += 2 * Math.PI;
    }
    while (angle >= 2 * Math.PI){
        angle -= 2 * Math.PI;
    }
    return angle;
}

/*
    Method Name: isClose
    Method Parameters:
        num1:
            A number
        num2:
            A number
        closeNumber:
            A small number
    Method Description: Converts degrees to radians
    Method Return: float
*/
function isClose(num1, num2, closeNumber){
    return Math.abs(num1 - num2) < closeNumber;
}

function roundInDirection(number, direction){
    if (direction > 0){
        return Math.ceil(number);
    }else if (direction < 0){
        return Math.floor(number);
    }
    throw new Error("Zero is an invalid direction. Please select a position or negative number.");
}
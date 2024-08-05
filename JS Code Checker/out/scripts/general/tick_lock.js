// When this is opened in NodeJS, import the required files
if (typeof window === "undefined"){
    Lock = require("./lock.js");
}
/*
    Class Name: TickLock
    Description: Subclass of Lock, unlocks after a given number of ticks
*/
class TickLock extends Lock {
    /*
        Method Name: constructor
        Method Parameters:
            numTicks:
                The number of ticks between unlocks
            ready:
                Whether the lock is currently ready
        Method Description: Constructor
        Method Return: Constructor
    */
    /*
        Method Name: constructor
        Method Parameters: 
            numTicks:
                TODO
             ready=true:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    constructor(numTicks, ready=true){
        super(ready);
        this.numTicks = numTicks;
        this.ticksLeft = 0;
        if (!ready){
            this.lock();
        }
    }
    
    /*
        Method Name: tick
        Method Parameters: None
        Method Description: Locks the lock and sets the last locked time
        Method Return: void
    */
    /*
        Method Name: tick
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    tick(){
        if (!this.isReady()){
            this.ticksLeft--;
        }
    }

    /*
        Method Name: isReady
        Method Parameters: None
        Method Description: Determines if the lock is ready to be unlocked and returns the result
        Method Return: boolean, true -> ready, false -> not ready
    */
    /*
        Method Name: isReady
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    isReady(){
        return this.ticksLeft <= 0;
    }

    /*
        Method Name: lock
        Method Parameters: None
        Method Description: Adds the lock time to the time left, locking the lock for some time
        Method Return: void
    */
    /*
        Method Name: lock
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    lock(){
        this.ticksLeft += this.numTicks;
    }

    /*
        Method Name: getTicksLeft
        Method Parameters: None
        Method Description: Getter
        Method Return: Number
    */
    /*
        Method Name: getTicksLeft
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getTicksLeft(){
        return this.ticksLeft;
    }

    /*
        Method Name: setTicksLeft
        Method Parameters:
            tickLeft:
                Number of ticks left
        Method Description: Setter
        Method Return: void
    */
    /*
        Method Name: setTicksLeft
        Method Parameters: 
            ticksLeft:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    setTicksLeft(ticksLeft){
        this.ticksLeft = ticksLeft;
    }

    /*
        Method Name: getCooldown
        Method Parameters: None
        Method Description: Getter
        Method Return: long, the cooldown of the lock
    */
    /*
        Method Name: getCooldown
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getCooldown(){
        return this.numTicks;
    }
}
// When this is opened in NodeJS, export the class
if (typeof window === "undefined"){
    module.exports = TickLock;
}
/*
    Class Name: Lock
    Description: A lock that provides information on its state
*/
class Lock {
    private:
        bool ready;
        NotSamLinkedList promiseUnlock;
    public:
    Lock(bool ready){
        this.ready = ready;
        this.promiseUnlock = new NotSamLinkedList();
    }
    Lock(){
        Lock(true);
    }
    /*
        Method Name: constructor
        Method Parameters:
            ready:
                Whether or not the lock starts out unlocked
        Method Description: Constructor
        Method Return: Constructor
    */

    /*
        Method Name: isReady
        Method Parameters: None
        Method Description: Provide information whether the lock is ready (unlocked)
        Method Return: Boolean
    */
    bool isReady(){
        return this.ready;
    }

    /*
        Method Name: notReady
        Method Parameters: None
        Method Description: Provide information whether the lock not is ready (locked)
        Method Return: Boolean
    */
    bool notReady(){
        return !this.isReady();
    }

    /*
        Method Name: notLocked
        Method Parameters: None
        Method Description: Determines if the lock is not locked
        Method Return: Boolean
    */
    bool notLocked(){
        return this.isReady();
    }

    /*
        Method Name: isLocked
        Method Parameters: None
        Method Description: Checks if the lock is locked
        Method Return: Boolean
    */
    bool isLocked(){
        return !this.isReady();
    }

    /*
        Method Name: isOpen
        Method Parameters: None
        Method Description: Checks if the lock is open
        Method Return: Boolean
    */
    bool isOpen(){
        return this.isReady();
    }

    /*
        Method Name: isUnlocked
        Method Parameters: None
        Method Description: Checks if the lock is unlocked
        Method Return: Boolean
    */
    bool isUnlocked(){
        return this.isReady();
    }

    /*
        Method Name: lock
        Method Parameters: None
        Method Description: Lock the lock
        Method Return: void
    */
    void lock(){
        this.ready = false;
    }

    /*
        Method Name: unlock
        Method Parameters: None
        Method Description: Unlock the lock and handle those awaiting the unlock
        Method Return: void
    */
    void unlock(){
        this.ready = true;
        // Do the promised unlock
        if (this.promiseUnlock.getLength() > 0){
            // TODO awaitingObject = this.promiseUnlock.get(0);
            // TODO awaitingResolve = awaitingObject["resolve"];
            // TODO relock = awaitingObject["relock"];
            this.ready = !relock;
            this.promiseUnlock.remove(0);
            awaitingResolve();
        }
    }

    /*
        Method Name: awaitUnlock
        Method Parameters: 
            relock:
                Lock as soon as unlocked to prevent sync issues
        Method Description: Provide a promise to await that will resolve when the lock is unlocked
        Method Return: Promise
    */
    TODO awaitUnlock(bool relock){
        if (this.ready){ return; }
        let instance = this;
        return new Promise((resolve, reject) => {
            instance.promiseUnlock.append({"resolve": resolve, "relock": relock});
        });
    }

    TODO awaitUnlock(){
        return this.awaitUnlock(false);
    }
}
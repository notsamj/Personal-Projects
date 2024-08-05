/*
    Class Name: MailBox
    Description: A mail box to send from and deliver to and to wait for. Handles messages.
*/
class MailBox {
    /*
        Method Name: constructor
        Method Parameters:
            sendFunc:
                A function to call when sending information
        Method Description: Constructor
        Method Return: Constructor
    */
    /*
        Method Name: constructor
        Method Parameters: 
            sendFunc:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    constructor(sendFunc){
        this.sendFunc = sendFunc;
        this.promiseResolve = null;
        this.awaiting = false;
    }

    /*
        Method Name: isAwaiting
        Method Parameters: None
        Method Description: Provide information whether the mailbox is awaiting a response
        Method Return: Boolean
    */
    /*
        Method Name: isAwaiting
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    isAwaiting(){
        return this.awaiting;
    }

    /*
        Method Name: deliver
        Method Parameters: 
            message:
                A message to deliver
        Method Description: Deliver a message received and stop waiting
        Method Return: void
    */
    /*
        Method Name: deliver
        Method Parameters: 
            message:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    deliver(message){
        if (this.promiseResolve != null){
            this.promiseResolve(message);
        }
        this.awaiting = false;
    }

    /*
        Method Name: send
        Method Parameters: 
            message:
                A message to deliver
        Method Description: Send a message and await for a response
        Method Return: void
    */
    /*
        Method Name: send
        Method Parameters: 
            message:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    send(message){
        this.awaiting = true;
        return new Promise((resolve, reject) => {
            this.sendFunc(message);
            this.promiseResolve = resolve;
        })
    }

    /*
        Method Name: await
        Method Parameters: None
        Method Description: Wait for a message to come
        Method Return: void
    */
    /*
        Method Name: await
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    await(){
        this.awaiting = true;
        return new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
        })
    }
}
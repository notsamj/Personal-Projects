// nsRequire {"implements": ["InterfaceOne"]}
class myTestClass8 {
    /*
        Expect Violations: Missing myIMethod2
    */
    constructor(){
        this.memberVariable1 = "test5";
        this.memberVariable2 = "test266";
    }

    /*
        Method Name: myAbstractMethod1
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    myAbstractMethod1(){}
    
    /*
        Method Name: myIMethod1
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    myIMethod1(){
        console.log("sadasdads")
    }
}
// nsRequire {"implements": ["InterfaceOne"]}
class myTestClass8 {
    /*
        Expect Violations: Missing myIMethod2
    */
    constructor(){
        this.memberVariable1 = "test5";
        this.memberVariable2 = "test266";
    }

    myAbstractMethod1(){}
    
    myIMethod1(){
        console.log("sadasdads")
    }
}
// nsRequire {"extends": ["AbstractClassOne"], "implements": ["InterfaceOne"]}
class myTestClass6 {
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
        Method Name: myAbstractMethod2
        Method Parameters: 
            a:
                TODO
            b:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    myAbstractMethod2(a,b){
        console.log("testing2!!!");
    }

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
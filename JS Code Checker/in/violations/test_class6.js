// nsRequire {"extends": ["AbstractClassOne"], "implements": ["InterfaceOne"]}
class myTestClass6 {
    /*
        Expect Violations: Missing myIMethod2
    */
    constructor(){
        this.memberVariable1 = "test5";
        this.memberVariable2 = "test266";
    }

    myAbstractMethod1(){}

    myAbstractMethod2(a,b){
        console.log("testing2!!!");
    }

    myIMethod1(){
        console.log("sadasdads")
    }
}
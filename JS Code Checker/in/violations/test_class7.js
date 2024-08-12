// nsRequire {"extends": ["AbstractClassOne"], "implements": ["InterfaceOne"]}
class myTestClass7 {
    /*
        Expect Violations: None
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

    myIMethod2(){}
}
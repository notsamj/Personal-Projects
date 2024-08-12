// nsRequire {"extends": ["AbstractClassOne"]}
class myTestClass3 {
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
}
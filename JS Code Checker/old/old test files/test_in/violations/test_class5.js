// nsRequire {"extends": ["AbstractClassOne"]}
class myTestClass5 {
    /*
        Expect Violations: Invalid parameter match for myAbstractMethod2
    */
    constructor(){
        this.memberVariable1 = "test5";
        this.memberVariable2 = "test266";
    }

    myAbstractMethod1(){}

    myAbstractMethod2(a){
        console.log("testing2asdasd!!!");
    }
}
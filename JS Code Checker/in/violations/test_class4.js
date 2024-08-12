// nsRequire {"extends": ["AbstractClassOne"]}
class myTestClass4 {
    /*
        Expect Violations: Invalid content match for myAbstractMethod2
    */
    constructor(){
        this.memberVariable1 = "test5";
        this.memberVariable2 = "test266";
    }

    myAbstractMethod1(){}

    // nsMethodExactMatch
    myAbstractMethod2(a,b){
        console.log("testing2!!!");
    }
}
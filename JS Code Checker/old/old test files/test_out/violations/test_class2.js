// nsRequire {"extends": ["AbstractClassOne"]}
class myTestClass2 {
    /*
        Expect Violations: No second member varible, no methods
    */
    constructor(){
        this.memberVariable1 = "test";
    }
}
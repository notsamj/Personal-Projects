// nsRequire {"extends": ["AbstractClassOne"]}
class myTestClass4 {
    /*
        Expect Violations: Invalid content match for myAbstractMethod2
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
    // nsMethodExactMatch
    myAbstractMethod2(a,b){
        console.log("testing2!!!");
    }
}
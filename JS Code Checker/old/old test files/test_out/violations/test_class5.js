// nsRequire {"extends": ["AbstractClassOne"]}
class myTestClass5 {
    /*
        Expect Violations: Invalid parameter match for myAbstractMethod2
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
        Method Description: TODO
        Method Return: TODO
    */
    myAbstractMethod2(a){
        console.log("testing2asdasd!!!");
    }
}
// nsRequire {"extends": ["AbstractClassOne"]}
class myTestClass3 {
    /*
        Expect Violations: None
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
}
/*
    Class Name: LocalDogfightClient
    Description: A client for a local dogfight
*/
class LocalDogfightClient extends LocalClient {
    /*
        Method Name: constructor
        Method Parameters:
            dogfightJSON:
                A json object with information about the dogfight
        Method Description: Constructor
        Method Return: Constructor
    */
    /*
        Method Name: constructor
        Method Parameters: 
            dogfightJSON:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    constructor(dogfightJSON){
        super(new LocalDogfight(dogfightJSON));
    }
}
/*
    Class Name: GamemodeManager
    Description: A tool for managing the current game mode and client
*/
class GamemodeManager {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: Constructor
        Method Return: Constructor
    */
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    constructor(){
        this.gamemodeClient = null;
    }

    /*
        Method Name: hasActiveGamemode
        Method Parameters: None
        Method Description: Checks if there is a gamemode running at the moment
        Method Return: Boolean
    */
    /*
        Method Name: hasActiveGamemode
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    hasActiveGamemode(){
        return this.gamemodeClient != null;
    }

    /*
        Method Name: getActiveGamemode
        Method Parameters: None
        Method Description: Getter
        Method Return: GamemodeClient
    */
    /*
        Method Name: getActiveGamemode
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getActiveGamemode(){
        return this.gamemodeClient;
    }

    /*
        Method Name: setActiveGamemode
        Method Parameters:
            newGamemodeClient:
                A new game mode client that is running a game
        Method Description: Setter
        Method Return: void
    */
    /*
        Method Name: setActiveGamemode
        Method Parameters: 
            newGamemodeClient:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    setActiveGamemode(newGamemodeClient){
        this.gamemodeClient = newGamemodeClient;
    }

    /*
        Method Name: deleteActiveGamemode
        Method Parameters: None
        Method Description: Removes the active gamemode
        Method Return: void
    */
    /*
        Method Name: deleteActiveGamemode
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    deleteActiveGamemode(){
        this.gamemodeClient = null;
    }

    /*
        Method Name: tick
        Method Parameters: None
        Method Description: Tells the current client to run a tick
        Method Return: void
    */
    /*
        Method Name: tick
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    async tick(){
        if (!this.hasActiveGamemode()){ return; }
        // Fix num ticks if running a huge defecit
        if (this.gamemodeClient.getNumTicks() < this.gamemodeClient.getExpectedTicks() - PROGRAM_DATA["settings"]["max_tick_deficit"]){ this.gamemodeClient.correctTicks(); }
        await this.gamemodeClient.tick();
    }

    /*
        Method Name: display
        Method Parameters: None
        Method Description: Tells the gamemode client to display
        Method Return: void
    */
    /*
        Method Name: display
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    display(){
        this.gamemodeClient.display();
    }
}
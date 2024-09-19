/*
    Class Name: MainMenu
    Description: The main menu inferface
*/
class MainMenu extends Menu {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: Constructor
        Method Return: Constructor
    */
    constructor(){
        super();
        this.playSongButton = null; // Declaration
        this.lockSongLock = new Lock();
        this.setup();
    }

    /*
        Method Name: setup
        Method Parameters: None
        Method Description: Setup components in the menu
        Method Return: void
    */
    setup(){
        let buttonSizeX = 800;
        let buttonSizeY = 120;
        let gapSize = 40;
        let buttonX = (innerWidth) => { return (innerWidth - buttonSizeX)/2; }
            
        // Background
        //this.components.push(new AnimatedCloudBackground())

        // Play Song
        let playSongButtonY = (innerHeight) => { return innerHeight - gapSize; };
        this.playSongButton = new RectangleButton("Play Song", "#3bc44b", "#e6f5f4", buttonX, playSongButtonY, buttonSizeX, buttonSizeY, (menuInstance) => {
            MENU_MANAGER.getMenuByName("player").reset();
            MENU_MANAGER.switchTo("player");
        });
        this.playSongButton.disable();
        this.components.push(this.playSongButton);

        // Information
        let infoY = 250;
        let infoXSize = (PROGRAM_DATA["general"]["expected_canvas_width"] - buttonSizeX)/2;
        let infoYSize = 200;
        this.components.push(new TextComponent("Made by notsamj.", "#000000", 0, infoY, infoXSize, infoYSize));

        // Load Song Data
        let loadSongDataButtonY = (innerHeight) => { return playSongButtonY(innerHeight) - buttonSizeY - gapSize; }
        this.components.push(new RectangleButton("Load Song Data", "#3bc44b", "#e6f5f4", buttonX, loadSongDataButtonY, buttonSizeX, buttonSizeY, async (menuInstance) => {
            if (this.lockSongLock.isLocked()){
                return;
            }
            this.lockSongLock.lock();
            activeSong = await Song.create(document.getElementById("song_file_submission").value);
            this.playSongButton.setDisabled(activeSong === null);
            this.lockSongLock.unlock();
        }));


        // Sound
        let soundButtonY = (innerHeight) => { return loadSongDataButtonY(innerHeight) - buttonSizeY - gapSize; }
        this.components.push(new RectangleButton("Sound", "#3bc44b", "#e6f5f4", buttonX, soundButtonY, buttonSizeX, buttonSizeY, async (menuInstance) => {
            MENU_MANAGER.switchTo("sound");
        }));
    }

}
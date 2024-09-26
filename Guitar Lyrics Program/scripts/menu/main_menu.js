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
        let buttonSizeX = PROGRAM_DATA["menu"]["main_menu"]["component_details"]["play_button"]["x_size"];
        let buttonSizeY = PROGRAM_DATA["menu"]["main_menu"]["component_details"]["play_button"]["y_size"];
        let gapSize = PROGRAM_DATA["menu"]["main_menu"]["gap_size"];
        let buttonX = (innerWidth) => { return (innerWidth - buttonSizeX)/2; }
            
        // Background
        // Note: No background in this program but this is where it would go

        // Play Song
        let playSongButtonY = (innerHeight) => { return innerHeight - gapSize; };
        this.playSongButton = new RectangleButton("Play Song", PROGRAM_DATA["menu"]["main_menu"]["component_details"]["play_button"]["fill_colour"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["play_button"]["text_colour"], buttonX, playSongButtonY, buttonSizeX, buttonSizeY, (menuInstance) => {
            MENU_MANAGER.getMenuByName("player").reset();
            MENU_MANAGER.switchTo("player");
        });
        this.playSongButton.disable();
        this.components.push(this.playSongButton);

        // Information
        let infoY = PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["y"];
        let infoXSize = (PROGRAM_DATA["general"]["expected_canvas_width"] - buttonSizeX)/2;
        let infoYSize = PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["y_size"];
        this.components.push(new TextComponent(PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["text"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["colour"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["x"], infoY, infoXSize, infoYSize));

        // Load Song Data
        let loadSongDataButtonY = (innerHeight) => { return playSongButtonY(innerHeight) - buttonSizeY - gapSize; }
        this.components.push(new RectangleButton(PROGRAM_DATA["menu"]["main_menu"]["component_details"]["load_button"]["text"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["load_button"]["fill_colour"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["load_button"]["text_colour"], buttonX, loadSongDataButtonY, buttonSizeX, buttonSizeY, async (menuInstance) => {
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
        this.components.push(new RectangleButton(PROGRAM_DATA["menu"]["main_menu"]["component_details"]["sound_settings_button"]["text"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["sound_settings_button"]["fill_colour"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["sound_settings_button"]["text_colour"], buttonX, soundButtonY, buttonSizeX, buttonSizeY, async (menuInstance) => {
            MENU_MANAGER.switchTo("sound");
        }));
    }

}
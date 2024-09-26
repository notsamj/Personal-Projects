/*
    Class Name: SoundMenu
    Description: A subclass of Menu specific to setting the game volume
*/
class SoundMenu extends Menu {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: Constructor
        Method Return: Constructor
    */
    constructor(){
        super();
        this.setup();
    }

    /*
        Method Name: setup
        Method Parameters: None
        Method Description: Sets up the menu interface
        Method Return: void
    */
    setup(){
        let sectionYSize = 50;

        // Background
        // Note: No background in this program but this is where it would go

        // Back Button
        let backButtonX = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["back_button"]["x"];
        let backButtonY = (innerHeight) => { return innerHeight-PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["back_button"]["back_button_y_gap"]; }
        let backButtonXSize = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["back_button"]["x_size"];
        let backButtonYSize = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["back_button"]["y_size"];
        this.components.push(new RectangleButton(PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["back_button"]["text"], PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["back_button"]["fill_colour"], PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["back_button"]["text_colour"], backButtonX, backButtonY, backButtonXSize, backButtonYSize, (playerMenuInstance) => {
            MENU_MANAGER.switchTo("main");
        }));

        // Interface for sound amounts
        let i = 0;
        this.createSoundSettings("main volume", i++);
        for (let soundData of PROGRAM_DATA["sound_data"]["sounds"]){
            this.createSoundSettings(soundData["name"], i++);
        }

    }

    /*
        Method Name: createSoundSettings
        Method Parameters:
            soundName:
                The name of the sound
            offSetIndex:
                The index of the sound relative to other sounds
        Method Description: Creates the settings menu elements for a given sound
        Method Return: void
    */
    createSoundSettings(soundName, offSetIndex){
        let width = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["width"];
        let height = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["height"];
        let sectionYSize = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["y_size"];
        let sectionYStart = sectionYSize * offSetIndex;

        let soundLabelXSize = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["label_x_size"];
        let soundLabelX = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["label_x"];
        let soundLabelYSize = PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["label_y_size"];
        let soundLabelY = (innerHeight) => { return innerHeight - PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["top_gap"] - sectionYStart - sectionYSize/2 - height/2; }

        let soundScaleX = soundLabelX + soundLabelXSize;
        let soundScaleY = (innerHeight) => { return innerHeight - PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["top_gap"] - sectionYStart; }

        // Components

        // Sound Name
        this.components.push(new TextComponent(soundName, PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["theme_colour_code"], soundLabelX, soundLabelY, soundLabelXSize, soundLabelYSize, PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["position_x"], PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["position_y"]));

        let getValueFunction = () => {
            return SOUND_MANAGER.getVolume(soundName);
        }

        let setValueFunction = (newVolume) => {
            SOUND_MANAGER.updateVolume(soundName, newVolume);
        }

        let quantitySlider = new QuantitySlider(soundScaleX, soundScaleY, width, height, getValueFunction, setValueFunction, 0, 100, false, PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["000000"], PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["theme_colour_code"], PROGRAM_DATA["menu"]["sound_menu"]["component_details"]["sound_changer"]["theme_colour_code"]);
        this.components.push(quantitySlider);
    }

    /*
        Method Name: goToMainMenu
        Method Parameters: None
        Method Description: Switches from this menu to the main menu
        Method Return: void
    */
    goToMainMenu(){
        MENU_MANAGER.switchTo("main");
    }
}
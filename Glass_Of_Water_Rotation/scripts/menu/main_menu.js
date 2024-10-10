/*
    Class Name: MainMenu
    Description: The main menu
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
        this.quizButton = null; // Declaration
        this.setup();
    }

    /*
        Method Name: setup
        Method Parameters: None
        Method Description: Setup components in the menu
        Method Return: void
    */
    setup(){
        let buttonSizeX = PROGRAM_DATA["menu"]["main_menu"]["component_details"]["quiz_button"]["x_size"];
        let buttonSizeY = PROGRAM_DATA["menu"]["main_menu"]["component_details"]["quiz_button"]["y_size"];
        let gapSize = PROGRAM_DATA["menu"]["main_menu"]["gap_size"];
        let buttonX = (innerWidth) => { return (innerWidth - buttonSizeX)/2; }
            
        // Background
        // Note: No background in this program but this is where it would go

        // Quiz Button
        let quizButtonY = (innerHeight) => { return innerHeight - gapSize; };
        this.quizButton = new RectangleButton(PROGRAM_DATA["menu"]["main_menu"]["component_details"]["quiz_button"]["text"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["quiz_button"]["fill_colour"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["quiz_button"]["text_colour"], buttonX, quizButtonY, buttonSizeX, buttonSizeY, (menuInstance) => {
            MENU_MANAGER.getMenuByName("quiz").reset();
            MENU_MANAGER.switchTo("quiz");
        });
        this.components.push(this.quizButton);

        // Information
        let infoY = PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["y"];
        let infoXSize = (PROGRAM_DATA["general"]["expected_canvas_width"] - buttonSizeX)/2;
        let infoYSize = PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["y_size"];
        this.components.push(new TextComponent(PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["text"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["colour"], PROGRAM_DATA["menu"]["main_menu"]["component_details"]["credits"]["x"], infoY, infoXSize, infoYSize));
    }

}
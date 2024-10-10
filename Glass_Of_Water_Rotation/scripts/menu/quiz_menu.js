class QuizMenu extends Menu {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: Constructor
        Method Return: Constructor
    */
    constructor(){
        super();
        this.waterGlasses = [];
        this.setup();
    }

    /*
        Method Name: setup
        Method Parameters: None
        Method Description: Sets up the menu interface
        Method Return: void
    */
    setup(){
        // Background
        // Note: No background in this program but this is where it would go
        //let waterGlass = new WaterGlassComponent(900, 500, 200, 400); // Need more optimization for this
        let waterGlass = new WaterGlassComponent(900, 500, 10, 75);
        //let waterGlass = new WaterGlassComponent(900, 500, 20, 40);
        waterGlass.updateFillAndAngle(0.5, toRadians(0));
        this.waterGlasses.push(waterGlass);
        this.components.push(waterGlass);
    }

    /*
        Method Name: reset
        Method Parameters: None
        Method Description: Resets the menu to the active song
        Method Return: void
    */
    reset(){

    }
}
/*
    Class Name: Component
    Description: An abstract class of a component of a visual interface
*/
class Component {
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
        this.enabled = true;
        this.displayEnabled = true;
    }

    /*
        Method Name: enable
        Method Parameters: None
        Method Description: Enables the component
        Method Return: void
    */
    /*
        Method Name: enable
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    enable(){
        this.enabled = true;
    }

    /*
        Method Name: disable
        Method Parameters: None
        Method Description: Disables the component
        Method Return: void
    */
    /*
        Method Name: disable
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    disable(){
        this.enabled = false;
    }

    /*
        Method Name: isDisabled
        Method Parameters: None
        Method Description: Reports whether the component is disabled
        Method Return: Boolean
    */
    /*
        Method Name: isDisabled
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    isDisabled(){
        return !this.enabled;
    }

    /*
        Method Name: isEnabled
        Method Parameters: None
        Method Description: Reports whether the component is enabled
        Method Return: Boolean
    */
    /*
        Method Name: isEnabled
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    isEnabled(){
        return this.enabled;
    }

    /*
        Method Name: isDisplayEnabled
        Method Parameters: None
        Method Description: Reports whether the component has its display enabled
        Method Return: Boolean
    */
    /*
        Method Name: isDisplayEnabled
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    isDisplayEnabled(){
        return this.displayEnabled;
    }

    /*
        Method Name: enableDisplay
        Method Parameters: None
        Method Description: Enables the display of the component
        Method Return: void
    */
    /*
        Method Name: enableDisplay
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    enableDisplay(){
        this.displayEnabled = true;
    }

    /*
        Method Name: disableDisplay
        Method Parameters: None
        Method Description: Disables the display of the component
        Method Return: void
    */
    /*
        Method Name: disableDisplay
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    disableDisplay(){
        this.displayEnabled = false;
    }

    /*
        Method Name: fullDisable
        Method Parameters: None
        Method Description: Disables the component, including display
        Method Return: void
    */
    /*
        Method Name: fullDisable
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    fullDisable(){
        this.disableDisplay();
        this.disable();
    }

    /*
        Method Name: fullEnable
        Method Parameters: None
        Method Description: Enables the component, including display
        Method Return: void
    */
    /*
        Method Name: fullEnable
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    fullEnable(){
        this.enableDisplay();
        this.enable();
    }


    // Either meant to be blank or meant to be overridden
    /*
        Method Name: covers
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    covers(){}
    /*
        Method Name: clicked
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    clicked(){}

    // Abstract Method
    /*
        Method Name: display
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    display(){}
}
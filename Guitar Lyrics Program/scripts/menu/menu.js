/*
    Class Name: Menu
    Description: An abstract class for making menus
*/
class Menu {
    /*
        Method Name: constructor
        Method Parameters: None
        Method Description: Constructor
        Method Return: Constructor
    */
    constructor(){
        this.visible = false;
        this.components = [];
    }

    /*
        Method Name: getWidth
        Method Parameters: None
        Method Description: Finds the width of the screen and returns it
        Method Return: int
    */
    getWidth(){
        return getScreenWidth();
    }

    /*
        Method Name: getHeight
        Method Parameters: None
        Method Description: Finds the height of the screen and returns it
        Method Return: int
    */
    getHeight(){
        return getScreenHeight();
    }

    /*
        Method Name: makeRectangleWithText
        Method Parameters:
        textStr:
            String of text inside the rectangle
        colour:
            The colour of the rectangle
        textColour:
            The colour of the text insid the rectangle
        x:
            The x location of the top left of the rectangle
        y:
            The y location of the top left of the rectangle
        width:
            The width of the rectangle
        height:
            The height of the rectangle

        Method Description: Create a rectangle with text inside
        Method Return: void
    */
    static makeRectangleWithText(textStr, colour, textColour, x, y, width, height){
        let screenX = x;
        let screenY = MENU_MANAGER.changeToScreenY(y);

        // Make the rectangle
        let rectColour = Colour.fromCode(colour);
        strokeRectangle(rectColour, screenX, screenY, width, height);

        // Make the text
        Menu.makeText(textStr, textColour, x+width/2, y-height/2, width, height, "center", "middle");
    }

    /*
        Method Name: determineMaxTextSizeByWidth
        Method Parameters:
        textLines:
            Array of strings, lines of text
        boxWidth:
            The width of the text box
        Method Description: Determines the maximum text size based on the width of the text
        Method Return: int
    */
    static determineMaxTextSizeByWidth(textLines, boxWidth){
        let currentTextSize = 10; // Using as a standard
        updateFontSize(currentTextSize);
        let longestLine;
        let longestLineWidth = -1;
        
        // Find the longest line
        for (let i = 0; i < textLines.length; i++){
            let currentLineWidth = measureTextWidth(textLines[i]);
            if (currentLineWidth > longestLineWidth){
                longestLine = textLines[i];
                longestLineWidth = currentLineWidth;
            }
        }
        // If invalid data then use 10
        if (longestLineWidth <= 0){
            return currentTextSize;
        }

        // Loop until the text is too big
        let safeMaxTextSize = 250;
        while (measureTextWidth(longestLine) + PROGRAM_DATA["ui"]["text_box_padding_proportion"] * boxWidth < boxWidth){
            if (currentTextSize > safeMaxTextSize){
                return safeMaxTextSize;
            }
            updateFontSize(++currentTextSize);
        }
        return currentTextSize - 1; // -1 because we've established that this is 1 size too big for the width
    }

    /*
        Method Name: makeText
        Method Parameters:
        textStr:
            String of text inside the rectangle
        textColour:
            The colour of the text insid the rectangle
        x:
            The x location of the top left of the text box
        y:
            The y location of the top left of the text box
        boxWidth:
            The width of the text box
        boxHeight:
            The height of the text box

        Method Description: Create text box filled with text
        Method Return: void
    */
    static makeText(textStr, textColour, x, y, boxWidth, boxHeight, alignLR="left", alignTB="top"){
        if (textStr === ""){ return; }
        let splitByLine = textStr.split("\n");
        let numLines = splitByLine.length;
        let screenX = x;
        let screenY = MENU_MANAGER.changeToScreenY(y);
        let calculatedTextSize = Menu.calculateTextSize(textStr, boxWidth, boxHeight);
        makeText(textStr, screenX, screenY, boxWidth, boxHeight, textColour, calculatedTextSize, alignLR, alignTB);
    }

    /*
        Method Name: calculateTextSize
        Method Parameters: 
            textString:
                The string to calculate the size of
            boxWidth:
                The width of the box in which to display the text
            boxHeight:
                The height of the box in which to display the text
        Method Description: Calculates an appropriate text size to fit the given text in a box
        Method Return: Integer
    */
    static calculateTextSize(textString, boxWidth, boxHeight){
        let splitByLine = textString.split('\n');
        let numLines = splitByLine.length;
        let maxTextSizeW = Menu.determineMaxTextSizeByWidth(splitByLine, boxWidth);
        let maxTextSizeH = Math.floor((boxHeight - PROGRAM_DATA["ui"]["text_box_padding_proportion"] * boxHeight) / numLines);
        let calculatedTextSize = Math.min(maxTextSizeW, maxTextSizeH);
        calculatedTextSize = Math.max(calculatedTextSize, 1);
        return calculatedTextSize;
    }

    /*
        Method Name: display
        Method Parameters: None
        Method Description: Display all components
        Method Return: void
    */
    display(){
        for (let component of this.components){
            if (!component.isDisplayEnabled()){ continue; }
            component.display();
        }
    }

    /*
        Method Name: click
        Method Parameters:
        x:
            The x location of the click
        y:
            The y location of the click

        Method Description: Determine if any component was clicked (from most recently added to least)
        Method Return: void
    */
    click(x, y){
        for (let i = this.components.length - 1; i >= 0; i--){
            let component = this.components[i];
            if (component.covers(x, y) && !component.isDisabled()){
                component.clicked(this);
                break;
            }
        }
    }

    /*
        Method Name: addComponent
        Method Parameters: None
        Method Description: Adds a component to the menu
        Method Return: void
    */
    addComponent(component){
        this.components.push(component);
    }
}
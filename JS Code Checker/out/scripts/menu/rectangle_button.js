/*
    Class Name: RectangleButton
    Description: A subclass of Component. A rectangular button.
*/
class RectangleButton extends Component {
    /*
        Method Name: constructor
        Method Parameters:
            textStr:
                String of text inside the rectangle
            colour:
                The colour of the rectangle
            textColour:
                The colour of the text insid the rectangle
            x:
                The x location of the top left of the rectangle or a function that returns the x given the screen width
            y:
                The y location of the top left of the rectangle or a function that returns the y given the screen height
            width:
                The width of the rectangle or a function that returns the width given the screen width
            height:
                The height of the rectangle or a function that returns the height given the screen height
            callBack:
                Function to call when clicked on
        Method Description: Constructor
        Method Return: Constructor
    */
    /*
        Method Name: constructor
        Method Parameters: 
            textStr:
                TODO
             colour:
                TODO
             textColour:
                TODO
             x:
                TODO
             y:
                TODO
             width:
                TODO
             height:
                TODO
             callBack:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    constructor(textStr, colour, textColour, x, y, width, height, callBack){
        super();
        this.textStr = textStr;
        this.colour = colour;
        this.textColour = textColour;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.callBack = callBack;
    }

    /*
        Method Name: getText
        Method Parameters: None
        Method Description: Determines the text value of this component. Depends on whether it is set as a function or a value.
        Method Return: String
    */
    /*
        Method Name: getText
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getText(){
        if (typeof this.textStr === "function"){
            return this.textStr();
        }else{
            return this.textStr;
        }
    }

    /*
        Method Name: setText
        Method Parameters: None
        Method Description: Setter
        Method Return: void
    */
    /*
        Method Name: setText
        Method Parameters: 
            textStr:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    setText(textStr){
        this.textStr = textStr;
    }

    /*
        Method Name: getX
        Method Parameters: None
        Method Description: Determines the x value of this component. Depends on whether it is set as a function of the screen dimensions or static.
        Method Return: int
    */
    /*
        Method Name: getX
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getX(){
        if (typeof this.x === "function"){
            return this.x(getScreenWidth());
        }else{
            return this.x;
        }
    }

    /*
        Method Name: getY
        Method Parameters: None
        Method Description: Determines the y value of this component. Depends on whether it is set as a function of the screen dimensions or static.
        Method Return: int
    */
    /*
        Method Name: getY
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getY(){
        if (typeof this.y === "function"){
            return this.y(getScreenHeight());
        }else{
            return this.y;
        }
    }

    /*
        Method Name: getWidth
        Method Parameters: None
        Method Description: Determines the width value of this component. Depends on whether it is set as a function of the screen dimensions or static.
        Method Return: int
    */
    /*
        Method Name: getWidth
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getWidth(){
        if (typeof this.width === "function"){
            return this.width(getScreenWidth());
        }else{
            return this.width;
        }
    }

    /*
        Method Name: getHeight
        Method Parameters: None
        Method Description: Determines the height value of this component. Depends on whether it is set as a function of the screen dimensions or static.
        Method Return: int
    */
    /*
        Method Name: getHeight
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    getHeight(){
        if (typeof this.height === "function"){
            return this.height(getScreenHeight());
        }else{
            return this.height;
        }
    }

    /*
        Method Name: display
        Method Parameters: None
        Method Description: Displays the rectangle on the screen
        Method Return: void
    */
    /*
        Method Name: display
        Method Parameters: None
        Method Description: TODO
        Method Return: TODO
    */
    display(){
        Menu.makeRectangleWithText(this.getText(), this.colour, this.textColour, this.getX(), this.getY(), this.getWidth(), this.getHeight());
    }

    /*
        Method Name: covers
        Method Parameters:
            x:
                Screen coordinate x
            y:
                Screen coordinate y
        Method Description: Determines whether the rectangle covers a point on the screen
        Method Return: boolean, true -> covers, false -> does not cover
    */
    /*
        Method Name: covers
        Method Parameters: 
            x:
                TODO
             y:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    covers(x, y){
        return x >= this.getX() && x <= this.getX() + this.getWidth() && y <= this.getY() && y >= this.getY() - this.getHeight();
    }

    /*
        Method Name: clicked
        Method Parameters:
            instance:
                The menu responsible for the click
        Method Description: Handles what occurs when clicked on
        Method Return: void
    */
    /*
        Method Name: clicked
        Method Parameters: 
            instance:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    clicked(instance){
        if (this.isDisabled() || !this.isDisplayEnabled()){ return; }
        this.callBack(instance);
    }

    /*
        Method Name: setColour
        Method Parameters:
            colour:
                A string representing a colour
        Method Description: Setter
        Method Return: void
    */
    /*
        Method Name: setColour
        Method Parameters: 
            colour:
                TODO
        Method Description: TODO
        Method Return: TODO
    */
    setColour(colour){
        this.colour = colour; 
    }
}
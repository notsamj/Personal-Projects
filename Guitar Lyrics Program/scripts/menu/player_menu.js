class PlayerMenu extends Menu {
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
        //this.components.push(new AnimatedCloudBackground())

        // Back Button
        let backButtonX = () => { return 50; }
        let backButtonY = (innerHeight) => { return innerHeight-27; }
        let backButtonXSize = 200;
        let backButtonYSize = 76;
        this.components.push(new RectangleButton("Main Menu", "#3bc44b", "#e6f5f4", backButtonX, backButtonY, backButtonXSize, backButtonYSize, (playerMenuInstance) => {
            playerMenuInstance.pause();
            MENU_MANAGER.switchTo("main");
        }));

        // Song text
        let songTextWidth = 800;
        let songTextHeight = 200;
        let songTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let songTextY = (innerHeight) => { return innerHeight-songTextHeight/2; }
        let songTextColour = Colour.fromCode("#6f279c");
        this.songTextComponent = new TextComponent("Song Name", songTextColour, songTextX, songTextY, songTextWidth, songTextHeight, "center", "center");
        this.components.push(this.songTextComponent);

        // Play button
        let playPauseX = 50;
        let playPauseY = 80;
        let playPauseWidth = 100;
        let playPauseHeight = 50;
        this.playButton = new RectangleButton("Play", "#61ed68", "#ffffff", playPauseX, playPauseY, playPauseWidth, playPauseHeight, (playerMenuInstance) => {
            playerMenuInstance.unpause();
        });
        this.components.push(this.playButton);

        // Pause button
        this.pauseButton = new RectangleButton("Pause", "#eb4034", "#ffffff", playPauseX, playPauseY, playPauseWidth, playPauseHeight, (playerMenuInstance) => {
            playerMenuInstance.pause();
        });
        this.components.push(this.pauseButton);

        // Slider
        let dudFunction = () => {};
        let sliderHeight = 50;
        let sliderWidth = 1620;
        let sliderX = 150;
        let sliderY = 80 + sliderHeight;
        this.optionSlider = new SelectionSlider(sliderX, sliderY, sliderWidth, sliderHeight, dudFunction, dudFunction, [], "#000000", "#94151d", "#000000")
        this.components.push(this.optionSlider);
        
        // Current line text

        // Next line text
    }

    pause(){
        this.playButton.fullEnable();
        this.pauseButton.fullDisable();
        this.optionSlider.enable();
        activeSong.pause();
    }

    unpause(){
        this.playButton.fullDisable();
        this.pauseButton.fullEnable();
        this.optionSlider.disable();
        activeSong.play();
    }

    reset(){
        // Set song title display
        this.songTextComponent.setText(activeSong.getSoundName());

        // Create options for option slider
        this.optionSlider.setOptions(activeSong.getOptionsForSlider());
        this.optionSlider.setGetter(() => { return activeSong.getCurrentTimeStamp(); });
        this.optionSlider.setSetter((value) => { activeSong.updateTimeFromTimeStamp(value); })
        this.optionSlider.updateSliderX();

        // Make sure the song is paused
        this.pause();
    }

    display(){
        // Update slider position
        this.optionSlider.updateSliderX();

        // Set updating texts
        super.display();
    }
}
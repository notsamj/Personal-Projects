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

        // Song name
        let songNameWidth = 800;
        let songNameHeight = 200;
        let songNameTopBuffer = 100;
        let songNameX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let songNameY = (innerHeight) => { return innerHeight; }
        let songNameColour = Colour.fromCode("#6f279c");
        this.songNameComponent = new TextComponent("Song Name", songNameColour, songNameX, songNameY, songNameWidth, songNameHeight, "center", "top");
        this.components.push(this.songNameComponent);

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
        this.optionSlider = new QuantitySlider(sliderX, sliderY, sliderWidth, sliderHeight, dudFunction, dudFunction, 0, 0, true, "#000000", "#94151d", "#000000")
        this.optionSlider.setToStringFunction((value) => {
            return secondsToTimeStamp(value);
        });        
        this.components.push(this.optionSlider);

        // Current lyric text
        let lyricTextWidth = 1200;
        let lyricTextHeight = 400;
        let lyricTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let lyricTextY = (innerHeight) => { return songNameY(innerHeight) - songNameHeight; }
        let lyricTextColour = Colour.fromCode("#32e34c");
        this.lyricTextComponent = new TextComponent("", lyricTextColour, lyricTextX, lyricTextY, lyricTextWidth, lyricTextHeight, "center", "top");
        this.components.push(this.lyricTextComponent);

        // Next lyric text
        let nextLyricTextWidth = 1200;
        let nextLyricTextHeight = 100;
        let nextLyricTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let nextLyricTextY = (innerHeight) => { return lyricTextY(innerHeight) - lyricTextHeight/2; }
        let nextLyricTextColour = Colour.fromCode("#f0f0f0");
        this.nextLyricTextComponent = new TextComponent("", nextLyricTextColour, nextLyricTextX, nextLyricTextY, nextLyricTextWidth, nextLyricTextHeight, "center", "top");
        this.components.push(this.nextLyricTextComponent);

        // Chord text
        let chordTextWidth = 400;
        let chordTextHeight = 90;
        let chordTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let chordTextY = (innerHeight) => { return nextLyricTextY(innerHeight) - nextLyricTextHeight; }
        let chordTextColour = Colour.fromCode("#5972ff");
        this.chordTextComponent = new TextComponent("", chordTextColour, chordTextX, chordTextY, chordTextWidth, chordTextHeight, "center", "top");
        this.components.push(this.chordTextComponent);

        // Strum style text
        let strumStyleTextWidth = 800;
        let strumStyleTextHeight = 120;
        let strumStyleTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let strumStyleTextY = (innerHeight) => { return chordTextY(innerHeight) - chordTextHeight; }
        let strumStyleTextColour = Colour.fromCode("#f06718");
        this.strumStyleTextComponent = new TextComponent("", strumStyleTextColour, strumStyleTextX, strumStyleTextY, strumStyleTextWidth, strumStyleTextHeight, "center", "top");
        this.components.push(this.strumStyleTextComponent);
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
        this.songNameComponent.setText(activeSong.getSoundName());

        // Create options for option slider
        this.optionSlider.setMaxValue(activeSong.getDuration());
        this.optionSlider.setGetter(() => { return activeSong.getCurrentTimeInSeconds(); });
        this.optionSlider.setSetter((value) => { activeSong.updateTime(value); })
        this.optionSlider.updateSliderX();

        // Make sure the song is paused
        this.pause();
    }

    display(){
        // Update slider position
        this.optionSlider.updateSliderX();

        // Set updating texts
        let textValues = activeSong.getTextDisplayValues();

        // Update y values of components
        this.updateComponentYValues(textValues);

        this.lyricTextComponent.setText(textValues["lyric"]);
        this.nextLyricTextComponent.setText(textValues["next_lyric"]);
        this.chordTextComponent.setText(textValues["chord"]);
        this.strumStyleTextComponent.setText(textValues["strum_style"]);

        super.display();
    }

    updateComponentYValues(textValues){
        let screenHeight = getScreenHeight();

        // Calculate size of all text
        let lyricSize = Menu.calculateTextSize(textValues["lyric"], this.lyricTextComponent.getWidth(), this.lyricTextComponent.getHeight());
        let nextLyricSize = Menu.calculateTextSize(textValues["next_lyric"], this.nextLyricTextComponent.getWidth(), this.nextLyricTextComponent.getHeight());
        let chordSize = Menu.calculateTextSize(textValues["chord"], this.chordTextComponent.getWidth(), this.chordTextComponent.getHeight());
        //let strumStyleSize = Menu.calculateTextSize(textValues["strum_style"], this.strumStyleTextComponent.getWidth(), this.strumStyleTextComponent.getHeight());
    
        // Determine y of lyric text top
        let lyricTopBuffer = 50;
        let topYOfLyricText = this.songNameComponent.getY() - this.songNameComponent.getHeight() - lyricTopBuffer;
        this.lyricTextComponent.setY(topYOfLyricText);

        // Determine y of next lyric text top
        let nextLyricBuffer = 20;
        let topYOfNextLyricText = topYOfLyricText - nextLyricBuffer - lyricSize;
        this.nextLyricTextComponent.setY(topYOfNextLyricText);


        // Determine y of chord text top
        let chordBuffer = 20;
        let topYOfChordText = topYOfNextLyricText - chordBuffer - nextLyricSize;
        this.chordTextComponent.setY(topYOfChordText);


        // Determine y of strumStyle text top
        let strumStyleBuffer = 20;
        let topYOfStrumStyleText = topYOfChordText - strumStyleBuffer - chordSize;
        this.strumStyleTextComponent.setY(topYOfStrumStyleText);
    }
}
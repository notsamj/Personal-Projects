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
        let sectionYSize = PROGRAM_DATA["menu"]["player_menu"]["gap_size"];

        // Background
        // Note: No background in this program but this is where it would go

        // Back Button
        let backButtonX = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["back_button"]["x"];
        let backButtonY = (innerHeight) => { return innerHeight-PROGRAM_DATA["menu"]["player_menu"]["component_details"]["back_button"]["back_button_y_gap"]; }
        let backButtonXSize = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["back_button"]["x_size"];
        let backButtonYSize = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["back_button"]["y_size"];
        this.components.push(new RectangleButton(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["back_button"]["text"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["back_button"]["fill_colour"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["back_button"]["text_colour"], backButtonX, backButtonY, backButtonXSize, backButtonYSize, (playerMenuInstance) => {
            playerMenuInstance.pause();
            MENU_MANAGER.switchTo("main");
        }));

        // Song name
        let songNameWidth = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["song_name"]["width"];
        let songNameHeight = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["song_name"]["height"];
        let songNameTopBuffer = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["song_name"]["top_buffer"];
        let songNameX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let songNameY = (innerHeight) => { return innerHeight; }
        let songNameColour = Colour.fromCode(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["song_name"]["colour_code"]);
        this.songNameComponent = new TextComponent(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["song_name"]["text"], songNameColour, songNameX, songNameY, songNameWidth, songNameHeight, PROGRAM_DATA["menu"]["player_menu"]["component_details"]["song_name"]["position_x"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["song_name"]["position_y"]);
        this.components.push(this.songNameComponent);

        // Play button
        let playPauseX = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["x"];
        let playPauseY = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["y"];
        let playPauseWidth = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["width"];
        let playPauseHeight = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["height"];
        this.playButton = new RectangleButton(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["play_text"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["play_colour"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["text_colour"], playPauseX, playPauseY, playPauseWidth, playPauseHeight, (playerMenuInstance) => {
            playerMenuInstance.unpause();
        });
        this.components.push(this.playButton);

        // Pause button
        this.pauseButton = new RectangleButton(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["pause_text"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["play_colour"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["text_colour"], playPauseX, playPauseY, playPauseWidth, playPauseHeight, (playerMenuInstance) => {
            playerMenuInstance.pause();
        });
        this.components.push(this.pauseButton);

        // Slider
        let dudFunction = () => {};
        let sliderHeight = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["slider"]["height"];
        let sliderWidth = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["slider"]["width"];
        let sliderX = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["slider"]["x"];
        let sliderY = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["slider"]["y"] + sliderHeight;
        this.optionSlider = new QuantitySlider(sliderX, sliderY, sliderWidth, sliderHeight, dudFunction, dudFunction, 0, 0, true, PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["background_colour"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["slider_colour"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["play_button"]["text_colour"]);
        this.optionSlider.setToStringFunction((value) => {
            return secondsToTimeStamp(value);
        });        
        this.components.push(this.optionSlider);

        // Current lyric text
        let lyricTextWidth = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["current_lyric"]["width"];
        let lyricTextHeight = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["current_lyric"]["height"];
        let lyricTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let lyricTextY = (innerHeight) => { return songNameY(innerHeight) - songNameHeight; }
        let lyricTextColour = Colour.fromCode(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["current_lyric"]["colour_code"]);
        this.lyricTextComponent = new TextComponent("", lyricTextColour, lyricTextX, lyricTextY, lyricTextWidth, lyricTextHeight, PROGRAM_DATA["menu"]["player_menu"]["component_details"]["current_lyric"]["position_x"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["current_lyric"]["position_y"]);
        this.components.push(this.lyricTextComponent);

        // Next lyric text
        let nextLyricTextWidth = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["next_lyric"]["width"];
        let nextLyricTextHeight = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["next_lyric"]["height"];
        let nextLyricTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let nextLyricTextY = (innerHeight) => { return lyricTextY(innerHeight) - lyricTextHeight/2; }
        let nextLyricTextColour = Colour.fromCode(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["next_lyric"]["colour_code"]);
        this.nextLyricTextComponent = new TextComponent("", nextLyricTextColour, nextLyricTextX, nextLyricTextY, nextLyricTextWidth, nextLyricTextHeight, PROGRAM_DATA["menu"]["player_menu"]["component_details"]["next_lyric"]["position_x"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["next_lyric"]["position_y"];
        this.components.push(this.nextLyricTextComponent);

        // Chord text
        let chordTextWidth = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["chord"]["width"];
        let chordTextHeight = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["chord"]["height"];
        let chordTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let chordTextY = (innerHeight) => { return nextLyricTextY(innerHeight) - nextLyricTextHeight; }
        let chordTextColour = Colour.fromCode(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["chord"]["colour_code"]);
        this.chordTextComponent = new TextComponent("", chordTextColour, chordTextX, chordTextY, chordTextWidth, chordTextHeight, PROGRAM_DATA["menu"]["player_menu"]["component_details"]["chord"]["position_x"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["chord"]["position_y"]);
        this.components.push(this.chordTextComponent);

        // Strum style text
        let strumStyleTextWidth = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["strum_style"]["width"];
        let strumStyleTextHeight = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["strum_style"]["height"];
        let strumStyleTextX = (innerWidth) => { return Math.floor(innerWidth/2); }
        let strumStyleTextY = (innerHeight) => { return chordTextY(innerHeight) - chordTextHeight; }
        let strumStyleTextColour = Colour.fromCode(PROGRAM_DATA["menu"]["player_menu"]["component_details"]["strum_style"]["colour_code"]);
        this.strumStyleTextComponent = new TextComponent("", strumStyleTextColour, strumStyleTextX, strumStyleTextY, strumStyleTextWidth, strumStyleTextHeight, PROGRAM_DATA["menu"]["player_menu"]["component_details"]["strum_style"]["position_x"], PROGRAM_DATA["menu"]["player_menu"]["component_details"]["strum_style"]["position_y"]);
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

        // Check end
        if (activeSong.isAtTheEnd()){
            this.pause();
        }

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
        let lyricTopBuffer = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["lyric"]["buffer"];
        let topYOfLyricText = this.songNameComponent.getY() - this.songNameComponent.getHeight() - lyricTopBuffer;
        this.lyricTextComponent.setY(topYOfLyricText);

        // Determine y of next lyric text top
        let nextLyricBuffer = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["next_lyric"]["buffer"];
        let topYOfNextLyricText = topYOfLyricText - nextLyricBuffer - lyricSize;
        this.nextLyricTextComponent.setY(topYOfNextLyricText);


        // Determine y of chord text top
        let chordBuffer = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["chord"]["buffer"];
        let topYOfChordText = topYOfNextLyricText - chordBuffer - nextLyricSize;
        this.chordTextComponent.setY(topYOfChordText);


        // Determine y of strumStyle text top
        let strumStyleBuffer = PROGRAM_DATA["menu"]["player_menu"]["component_details"]["strum_style"]["buffer"];
        let topYOfStrumStyleText = topYOfChordText - strumStyleBuffer - chordSize;
        this.strumStyleTextComponent.setY(topYOfStrumStyleText);
    }
}
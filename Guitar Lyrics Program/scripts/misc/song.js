class Song {
    constructor(soundName, textContents){
        this.soundName = soundName;
        this.parseTextContents(textContents);
        this.textDisplayValues = {"calculated_at_time": null};
    }

    getTextDisplayValues(){
        let currentTimeInSeconds = this.getCurrentTimeInSeconds();
        // Save on calculation if already created
        if (currentTimeInSeconds === this.textDisplayValues["calculated_at_time"]){
            return this.textDisplayValues;
        }
        let nextLyric = "";
        let lyric = "";
        let chord = "";
        let strumStyle = "";

        // Find the lyric and next lyric
        for (let lyricIndex = this.lyrics.length - 1; lyricIndex >= 0; lyricIndex--){
            let lyricObject = this.lyrics[lyricIndex];
            // If the current lyric has been found then set it
            if (lyricObject["time_in_seconds"] <= currentTimeInSeconds){
                lyric = lyricObject["lyric"];
                if (lyricIndex + 1 < this.lyrics.length){
                    nextLyric = this.lyrics[lyricIndex+1]["lyric"];
                }
                break;
            }
        }

        // Find the chord
        for (let chordIndex = this.chords.length - 1; chordIndex >= 0; chordIndex--){
            let chordObject = this.chords[chordIndex];
            // If the current chord has been found then set it
            if (chordObject["time_in_seconds"] <= currentTimeInSeconds){
                chord = chordObject["chord"];
                break;
            }
        }

        // Find the strum style
        for (let strumStyleIndex = this.strumStyles.length - 1; strumStyleIndex >= 0; strumStyleIndex--){
            let strumStyleObject = this.strumStyles[strumStyleIndex];
            // If the current chord has been found then set it
            if (strumStyleObject["time_in_seconds"] <= currentTimeInSeconds){
                strumStyle = strumStyleObject["strum_style"];
                break;
            }
        }

        this.textDisplayValues = {
            "calculated_at_time": currentTimeInSeconds,
            "next_lyric": nextLyric,
            "lyric": lyric,
            "chord": chord,
            "strum_style": strumStyle
        };
        return this.textDisplayValues;
    }

    getDuration(){
        return SOUND_MANAGER.findSound(this.getSoundName()).getDuration();
    }

    isAtTheEnd(){
        return this.getDuration() === this.getCurrentTimeInSeconds();
    }

    reset(){
        this.updateTime(0);
    }

    getSoundName(){
        return this.soundName;
    }

    pause(){
        SOUND_MANAGER.findSound(this.getSoundName()).pause();
    }

    play(){
        SOUND_MANAGER.findSound(this.getSoundName()).play();
    }

    getCurrentTimeInSeconds(){
        let sound = SOUND_MANAGER.findSound(this.getSoundName());
        return sound.getCurrentTime();
    }

    getCurrentTimeStamp(){
        return secondsToTimeStamp(this.getCurrentTimeInSeconds());
    }

    updateTimeFromTimeStamp(timeStampString){
        this.updateTime(timeStampToSeconds(timeStampString));
    }

    updateTime(numSeconds){
        let sound = SOUND_MANAGER.findSound(this.getSoundName());
        sound.setCurrentTime(numSeconds);
    }

    parseTextContents(textContents){
        let lines = textContents.split('\n');

        // Note: Allowing things like 99:99:99 I don't care

        let lyrics = [];
        let chords = [];
        let strumStyles = [];

        // Note: I could add groups do I don't need to .split(',')
        let lyricsLineRegex = /^([0-9][0-9]:[0-9][0-9]:[0-9][0-9](\.[0-9]+)?),lyrics,([a-zA-Z0-9 \-_'’\(\),]+)$/;
        let chordLineRegex = /^([0-9][0-9]:[0-9][0-9]:[0-9][0-9](\.[0-9]+)?),chord,([a-zA-Z0-9 \-_]+)$/;
        let strumStyleLineRegex = /^([0-9][0-9]:[0-9][0-9]:[0-9][0-9](\.[0-9]+))?,strum_style,([a-zA-Z0-9 \-_]+)$/;
        
        let parseError = false;
        // Read lines
        for (let line of lines){
            // Allow them to add extra spaces so trim
            line = line.trim();
            // Ignore blank lines
            if (line.length === 0){ continue; }
            
            // If lyrics line
            let lyricMatch = line.match(lyricsLineRegex);
            let chordMatch = line.match(chordLineRegex);
            let strumStyleMatch = line.match(strumStyleLineRegex);
            if (lyricMatch){
                let timeStampInSeconds = timeStampToSeconds(lyricMatch[1]);
                let lyricString = lyricMatch[3];
                lyrics.push({"time_in_seconds": timeStampInSeconds, "lyric": lyricString});
            }
            // If chord line
            else if (chordMatch){
                let timeStampInSeconds = timeStampToSeconds(chordMatch[1]);
                let chordString = chordMatch[3];
                chords.push({"time_in_seconds": timeStampInSeconds, "chord": chordString});
            }
            // If strum style line
            else if (strumStyleMatch){
                let timeStampInSeconds = timeStampToSeconds(strumStyleMatch[1]);
                let strumStyleString = strumStyleMatch[3];
                strumStyles.push({"time_in_seconds": timeStampInSeconds, "strum_style": strumStyleString});
            }else{
                parseError = true;
                console.error("Failed to parse:", line);
            }
        }

        // Provide feedback if error
        if (parseError){
            MENU_MANAGER.addTemporaryMessage("Failed to parse some of the text contents.\nSee console for additional information.", "#ff7300", 5000);
        }

        // Sort these arrays
        let comparisonFunction = (objA, objB) => {
            if (objA["value"] > objB["value"]){
                return 1;
            }else if (objA["value"] < objB["value"]){
                return -1;
            }else{
                return 0;
            }
        }
        lyrics.sort(comparisonFunction);
        chords.sort(comparisonFunction);
        strumStyles.sort(comparisonFunction);

        this.lyrics = lyrics;
        this.chords = chords;
        this.strumStyles = strumStyles;
    }

    static async create(songFileNameUncleaned){
        if (songFileNameUncleaned === undefined){ return null; }
        // Expect: "C:\fakepath\${fileName}"
        let songFileName = songFileNameUncleaned.substring(12, songFileNameUncleaned.length);
        // Load the sound
        let result = await SOUND_MANAGER.loadSound(songFileName);
        /*
            Expected codes:
                -1 failure
                 0 song already present
                 1 success
        */
        // If failed to load song
        if (result["code"] == -1){
            console.error("Failed to load:", songFileName);
            MENU_MANAGER.addTemporaryMessage("Failed to load song file.\nSee console for additional information.", "#ff0000", 5000);
            return null;
        }
        let soundName = result["sound_name"];
        let textArea = document.getElementById("data_submission");
        let text = textArea.value;
        return new Song(soundName, text);
    }
}
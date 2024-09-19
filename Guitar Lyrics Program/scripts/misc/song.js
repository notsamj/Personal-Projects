class Song {
    constructor(soundName, textContents){
        this.soundName = soundName;
        this.parseTextContents(textContents);
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

    getOptionsForSlider(){
        let options = [];
        
        let sound = SOUND_MANAGER.findSound(this.getSoundName());

        let songLengthInSeconds = sound.getDuration();
        for (let i = 0; i <= songLengthInSeconds; i++){
            options.push(secondsToTimeStamp(i));
        }
        
        return options;
    }
    getCurrentTimeStamp(){
        let sound = SOUND_MANAGER.findSound(this.getSoundName());
        return secondsToTimeStamp(sound.getCurrentTime());
    }
    updateTimeFromTimeStamp(timeStampString){
        let sound = SOUND_MANAGER.findSound(this.getSoundName());
        sound.setCurrentTime(timeStampToSeconds(timeStampString));
    }

    parseTextContents(textContents){
        // TODO
        console.log("Got", textContents)
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
            return null;
        }
        let soundName = result["sound_name"];
        let textArea = document.getElementById("data_submission");
        let text = textArea.value;
        return new Song(soundName, text);
    }
}
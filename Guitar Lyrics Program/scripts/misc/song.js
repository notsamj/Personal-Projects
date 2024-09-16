class Song {
    constructor(soundName, textContents){
        this.soundName = soundName;
        this.parseTextContents(textContents);
    }

    parseTextContents(textContents){
        // TODO
        console.log("Got", textContents)
    }

    static create(songFileNameUncleaned){
        if (songFileNameUncleaned === undefined){ return null; }
        // Expect: "C:\fakepath\$fileName"
        let songFileName = songFileNameUncleaned.substring(12, songFileNameUncleaned.length);
        // Load the sound
        let soundName = SOUND_MANAGER.loadSound(songFileName);
        /*
            Expected codes:
                -1 failure
                 0 song already present
                 1 success
        */
        // If failed to load song
        if (soundName == -1){
            console.error("Failed to load:", songFileName);
            return null;
        }
        let textArea = document.getElementById("data_submission");
        let text = textArea.value;
        return new Song(soundName, text);
    }
}
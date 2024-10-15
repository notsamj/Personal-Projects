## Try the program
1. Download Repository as ZIP (or clone it)
2. Un-zip
3. Open guitar_lyrics_program.html
4. See tutorial video

## Program Tutorial
[https://youtu.be/Z3PMztFFY6k](https://youtu.be/Z3PMztFFY6k)

## Run with alternative text data / songs

### Alternative Song/Audio
1. Convert any audio file you want to use to .mp3
2. Name the audio file (name).mp3
3. Put the audio file (name).mp3 in a folder named (name) so the file structure looks like (name)/(name).mp3
4. Put the audio folder (name) in either songs/public or songs/local. If using song/local, create the directory "local" then go into data.js and change "sound_data"/"using_local" to `true`
5. Select the audio by clicking browse -> navigate to the proper folder -> select the .mp3 file -> select open

### Alternative text data
The format of the text data is chronological by line. \
As stated in the tutorial, text data is submitted through the provided text area. \
I recommend storing it in a .txt file in the same folder as the .mp3 file.
#### Song lyrics
Regex: `([0-9][0-9]:[0-9][0-9]:[0-9][0-9](\.[0-9]+)?),lyrics,([a-zA-Z0-9 \-_'’\(\),]+)`
Example: 00:00:00,lyrics,now playing E minor

#### Chord
Regex: `([0-9][0-9]:[0-9][0-9]:[0-9][0-9](\.[0-9]+)?),chord,([a-zA-Z0-9 \-_]+)`
Example: 00:00:00,chord,E-m

#### Strumming style
Regex: `([0-9][0-9]:[0-9][0-9]:[0-9][0-9](\.[0-9]+)?),strum_style,([a-zA-Z0-9 \-_]+)`
Example: 00:00:00,strum_style,down-down-up-down-up-down-down-down

#### Full example
```
00:00:00,lyrics,now playing E minor
00:00:00,chord,E-m
00:00:00,strum_style,down-down-up-down-up-down-down-down

00:00:10,lyrics,now playing A sus 2
00:00:10,chord,A-sus2
00:00:10,strum_style,down-down-up-down-up-down

00:00:20,lyrics,now playing A major
00:00:20,chord,A-M
00:00:20,strum_style,down-down-up-down-up-down

00:00:29,lyrics,now playing A minor
00:00:29,chord,A-m
00:00:29,strum_style,down-down-up-down-up-down

00:00:36,lyrics,now playing E major
00:00:36,chord,E-M
00:00:36,strum_style,down-down-up-down-up-down

00:00:44,lyrics,now playing F major
00:00:44,chord,F-M
00:00:44,strum_style,down-down-up-down-up-down
```
## My vision for the program
As with all the software I create, it is created because I intend to use it. \
I've been trying to learn guitar and have found it difficult to synchronize the instructions with songs when attempting to play along. \
I made this program to resemble karaoke videos that you can create yourself either for karaoke or for trying to play something on guitar. \
Updates may come in the future if I feel they are needed for my usage.
## Additional Information
Program was tested on Windows, not tested on Mac/Linux.
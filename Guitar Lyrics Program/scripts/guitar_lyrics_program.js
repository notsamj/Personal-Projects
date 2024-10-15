// Global Variables & Constants
var programOver = false;
var debug = false;
var runningTicksBehind = 0;
var mouseX = 0;
var mouseY = 0;
var activeSong = null;

const IMAGES = {};

const MAX_RUNNING_LATE = 500;

const FRAME_COUNTER = new FrameRateCounter(PROGRAM_DATA["general"]["frame_rate"]);
const MAIN_TICK_LOCK = new Lock();
const MENU_MANAGER = new MenuManager();
const USER_INPUT_MANAGER = new UserInputManager();
const SOUND_MANAGER = new SoundManager();

// Register inputs
USER_INPUT_MANAGER.register("option_slider_grab", "mousedown", (event) => { return true; });
USER_INPUT_MANAGER.register("option_slider_grab", "mouseup", (event) => { return true; }, false);


// Functions

/*
    Method Name: tick
    Method Parameters:
        timeSinceLastTickMS:
            The time since the last animation frame
    Method Description: Makes things happen within a tick
    Method Return: void
*/
async function tick(timeSinceLastTickMS){
    // Safety incase an error occurs stop running
    if (programOver){ return; }

    // Tick user input manager
    USER_INPUT_MANAGER.tick();

    // Check for issues with main tick lock
    if (MAIN_TICK_LOCK.notReady()){
        runningTicksBehind++;
        console.log("Main tick loop is running %d ticks behind.", runningTicksBehind)
        if (runningTicksBehind > MAX_RUNNING_LATE){
            programOver = true;
            return;
        }
    }
    MAIN_TICK_LOCK.lock();
    
    // Draw frame
    if (FRAME_COUNTER.ready()){
        FRAME_COUNTER.countFrame();
        let canvas = document.getElementById("canvas");
        // Update Canvas size if applicable
        if (getScreenWidth() != canvas.width || getScreenHeight() != canvas.height){
            canvas.width = getScreenWidth();
            canvas.height = getScreenHeight();
        }
        draw();
    }
    MAIN_TICK_LOCK.unlock();
    // Try and tick immediately (incase need to catch up if it doesn't need it catch up then no problem)
    requestAnimationFrame(tick);
}

/*
    Method Name: setup
    Method Parameters: None
    Method Description: Prepares the program.
    Method Return: void
*/
async function setup() {
    // Create Canvas
    let canvasDOM = document.getElementById("canvas");
    canvasDOM.width = getScreenWidth();
    canvasDOM.height = getScreenHeight();
    // Set global variable drawingContext
    drawingContext = canvasDOM.getContext("2d");

    window.onerror = (event) => {
        programOver = true;
    };

    window.onmousemove = (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    // Prevent auto page scrolling
    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 32 || event.keyCode === 40){
            event.preventDefault();
        }
    });

    // Set up menu manager
    MENU_MANAGER.setup();
    MenuManager.setupClickListener();

    // Prepare to start running
    requestAnimationFrame(tick);
}

/*
    Method Name: draw
    Method Parameters: None
    Method Description: Draws everything needed on the canvas.
    Method Return: void
*/
function draw() {
    // Temporary white background
    noStrokeRectangle(Colour.fromCode("#ffffff"), 0, 0, getScreenWidth(), getScreenHeight());
    MENU_MANAGER.display();
}

// Start Up
window.addEventListener("load", () => {
    setup();
});
#include <iostream>
#include <thread>
#include <unistd.h>
using namespace std;

// Global Constants
//const unsigned int TICK_INTERVAL = 10000; // 10,000 microseconds / 10ms / 100 times per second
// For testing
const unsigned int TICK_INTERVAL = 100000; // 100k / 100ms

// Global Variables
bool running = false;

// Declare Functions
int main(int, const char**);
void runTicks();
void tick();

// Define Functions
int main(int argc, const char* argv[]){
	cout << "Hello World!" << '\n';
	
	// Start the ticks
	running = true;
	thread tickThread(runTicks);

	// Wait for tick thread to end
	tickThread.join();

	return 0;
}

void runTicks(){
	int temporaryStopCount = 0;
	int temporaryStopLimit = 50000;
	while (running){
		tick();
		usleep(TICK_INTERVAL);
		temporaryStopCount++;
		// Stop if breaking the limit
		if (temporaryStopCount > temporaryStopLimit){
			running = false;
		}
	}
}

void tick(){
	cout << "Tick" << endl;
}
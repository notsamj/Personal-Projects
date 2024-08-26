#include <iostream>
#include <thread>
#include <unistd.h>
#include "./notsam_linked_list.h"
#include "./tank_game.cpp"
using namespace std;

// Global Constants
//const unsigned int TICK_INTERVAL = 10000; // 10,000 microseconds / 10ms / 100 times per second
// For testing
const unsigned int TICK_INTERVAL = 100000; // 100k / 100ms
const int GAME_TICK_RATE = 20; // 20 ticks per second
const int MAX_TICK_DEBT = 20; // 20 ticks / expected 1s

// Global Variables
bool running = false;
MultiplayerGame* game = new TankGame();

// Declare Functions
int main(int, const char**);
void runTicks();
void tick();
long getExpectedTicksPassed();
void test();

// Define Functions
int main(int argc, const char* argv[]){
	cout << "Hello World!" << '\n';
	
	// Start the ticks
	running = true;

	/*
	// Run test
	test();

	return 0;
	*/

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
	long expectedTicksPassed = game->getExpectedTicksPassed();
	long realTicksPassed = game->getTicksPassed();
	long tickDebt = expectedTicksPassed - realTicksPassed;

	// If the ticks aren't running fast enough
	if (tickDebt > MAX_TICK_DEBT){
		running = false;
		return;
	}

	// If it is time for a tick, then tick the game
	if (realTicksPassed < expectedTicksPassed){
		game->tick();
	}
}

void test(){
	//getExpectedTicksPassed();
}
#include "multiplayer_game.h"
MultiplayerGame::MultiplayerGame(){
	//std::cout << "MultiplayerGame constructor called.\n";
	this->startTime = std::chrono::system_clock::now(); // Start time for the server
	this->ticksPassed = 0;
	this->tickLock = new std::mutex();
	this->userUpdateLock = new std::mutex();
	this->userUpdates = new NotSam::LinkedList<std::string>;
}

long MultiplayerGame::getExpectedTicksPassed(){
	auto now = std::chrono::system_clock::now();
	const std::chrono::duration<double> elapsedSeconds{now - this->startTime};
	long ms = std::chrono::duration_cast<std::chrono::milliseconds>(elapsedSeconds).count();
	return ms;
}

long MultiplayerGame::getTicksPassed(){
	return this->ticksPassed;
}

void MultiplayerGame::takeDataFromUser(std::string dataStr){
	// Wait and reserve lock
	this->userUpdateLock->lock();
	this->userUpdates->push(dataStr);
	this->userUpdateLock->unlock();
}
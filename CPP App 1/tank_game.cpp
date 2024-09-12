#include "tank_game.h"
TankGame::TankGame(){
	//std::cout << "Tank game constructor called!" << std::endl;
}

void TankGame::processUserData(){
	// Wait for the lock
	this->userUpdateLock->lock();

	while (this->userUpdates->getSize() > 0){
		this->processUserUpdate(this->userUpdates->pop(0));
	}

	this->userUpdateLock->unlock();
}

void TankGame::processUserUpdate(std::string dataStr){
	
}

void TankGame::tick(){
	
}
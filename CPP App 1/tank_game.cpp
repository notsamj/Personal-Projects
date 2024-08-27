#include "./multiplayer_game.h"
#include <string>
class TankGame : public MultiplayerGame {
	private:
	processUserUpdate();
	public:
	TankGame();
};

TankGame::TankGame(){
	//std::cout << "Tank game constructor called!" << std::endl;
}

TankGame::processUserData(){
	// Wait for the lock
	this->userUpdateLock.lock();

	while (this->userUpdates.getSize() > 0){
		this.processUserUpdate(this->userUpdates.pop(0));
	}

	this->userUpdateLock.unlock();
}

TankGame::processUserUpdate(string dataStr){
	
}
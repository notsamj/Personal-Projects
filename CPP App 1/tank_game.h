#include "./multiplayer_game.h"
#include <string>
class TankGame : public MultiplayerGame {
	private:
	void processUserUpdate(std::string dataStr);
	public:
	TankGame();
	void processUserData();
	void tick();
};
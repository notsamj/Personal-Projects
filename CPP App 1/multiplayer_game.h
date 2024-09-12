#ifndef _MULTIPLAYER_GAME_ 
#define _MULTIPLAYER_GAME_ 
#include <chrono>
#include <mutex>
#include "./notsam_linked_list.h"
#include <string>

class MultiplayerGame {
	private:
		std::chrono::time_point<std::chrono::system_clock> startTime; 
		long ticksPassed;
	protected:
		std::mutex* tickLock;
		std::mutex* userUpdateLock;
		NotSam::LinkedList<std::string>* userUpdates;
	public:
		MultiplayerGame();
		long getExpectedTicksPassed();
		long getTicksPassed();
		void takeDataFromUser(std::string dataStr);

		void virtual processUserData();
		void virtual tick();
};
#endif
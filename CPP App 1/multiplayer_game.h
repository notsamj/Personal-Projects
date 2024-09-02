#include <chrono>
#include <mutex>
#include "./notsam_linked_list.cpp"
#include <string>

class MultiplayerGame {
	private:
		std::chrono::time_point<std::chrono::system_clock> startTime; 
		long ticksPassed;
		std::mutex tickLock*;
		std::mutex userUpdateLock*;
		NotSam::LinkedList<string>* userUpdates;

	protected:
	public:
		MultiplayerGame();
		long getExpectedTicksPassed();
		long getTicksPassed();
		void takeDataFromUser();

		void virtual processUserData();
		void virtual tick();
};

MultiplayerGame::MultiplayerGame(){
	//std::cout << "MultiplayerGame constructor called.\n";
	this->startTime = std::chrono::system_clock::now(); // Start time for the server
	this->ticksPassed = 0;
	this->tickLock = new std::mutex();
	this->userUpdateLock = new std::mutex();
	this->userUpdates = new NotSam::LinkedList<string>;
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

MultiplayerGame::takeDataFromUser(string dataStr){
	// Wait and reserve lock
	this->userUpdateLock.lock();
	this->userUpdateLock.push(dataStr);
	this->userUpdateLock.unlock();
}
#include <chrono>
class MultiplayerGame {
	private:
		std::chrono::time_point<std::chrono::system_clock> startTime; 
		long ticksPassed;
	protected:
	public:
		MultiplayerGame();
		long getExpectedTicksPassed();
		long getTicksPassed();
		void virtual tick();
};

MultiplayerGame::MultiplayerGame(){
	//std::cout << "MultiplayerGame constructor called.\n";
	this->startTime = std::chrono::system_clock::now(); // Start time for the server
	this->ticksPassed = 0;
}

long MultiplayerGame::getExpectedTicksPassed(){
	auto now = std::chrono::system_clock::now();
	const std::chrono::duration<double> elapsedSeconds{now - this->startTime};
	long ms = std::chrono::duration_cast<std::chrono::milliseconds>(elapsedSeconds).count();
	return ms;
}

long MultiplayerGame::getTicksPassed(){
	return
}
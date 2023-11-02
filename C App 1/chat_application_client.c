#include <stdio.h>
#include<sys/socket.h>
#include<arpa/inet.h>

#define APPLICATION_PORT 27015 // Using the usual steam game port
#define MAX_MESSAGE_SIZE 4096

char quitCommand[STANDARD_STRING_SIZE] = {}; // Making it standard string size if provided one is too big then it's seen as the user's fault

void readProgramInformation();

int main(int argc, char const *argv[]){
	int clientSocket;
	clientSocket = socket(AF_INET, SOCK_STREAM, 0);

	// If the socket couldn't be created
	if (clientSocket < 0){
		printf("Failed to create the Client Socket.\nProgram quitting.\n");
		return 1; // I'm not entirely sure this is proper to return 1 over something like this
	}

	// Set up the ip & port
	struct sockaddr_in serverAddress;
	serverAddress.sin_family = AF_INET;
	serverAddress.sin_port = htons(APPLICATION_PORT);
	serverAddress.sin_addr.s_addr = inet_addr("127.0.0.1");
	int addressLength = sizeof(serverAddress);

	// Attempt a connection
	int connectResult = connect(clientSocket, (struct sockaddr *) &serverAddress, addressLength);
	if (connectResult < 0){
		printf("Error connecting to server.\nProgram quitting.\n");
		return 1;
	}

	char sendingBuffer[STRING_SIZE] = {};
	char receivingBuffer[STRING_SIZE] = {};

	bool quitProgram = false;
	// Run until user writes the quit command
	while (!quitProgram){
		// TODO
	}
	close(clientSocket);
	return 0;
}

void readProgramInformation(){
	// Open data file
	FILE* dataFile = fopen("client_data.txt", "r");

	// If the data file cannot be read
	if (dataFile == NULL){
		printf("Error opening data file!\nProgram quitting.\n");
		exit(1);
	}

	// NOTE: May encounter error if file format is not right

	fgets(quitCommand, sizeof(quitCommand), dataFile);

	fclose(dataFile);
}

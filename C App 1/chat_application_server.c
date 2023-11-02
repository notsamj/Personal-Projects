#include <stdio.h>
#include<sys/socket.h>
#include<arpa/inet.h>

#define MAX_MESSAGE_SIZE 4096
#define STANDARD_STRING_SIZE 128
#define USERNAME_SIZE 32
#define PASSWORD_SIZE 32
#define MAX_CLIENTS 16

// Global variables
char chatroomPassword[PASSWORD_SIZE] = {};
char quitCommand[STANDARD_STRING_SIZE] = {}; // Making it standard string size if provided one is too big then it's seen as the user's fault
int clients[MAX_CLIENTS] = {};
int numClients = 0;

// Declare functions
void communicateWithClient(void*);
void sendMessageToClient(int, char*, char*, int);
void readProgramInformation();
void addClient(int);
void removeClient(int);
void sendToAllClientsExcept(char*, int, int);

// Function bodies

int main(int argc, char const *argv[]){
	// Read information about the program (i.e. chatroom password, quit command)
	readProgramInformation();

	int serverSocket;
	serverSocket = socket(AF_INET, SOCK_STREAM, 0);

	// If the server socket couldn't be created -> exit the program
	if (serverSocket == 0){
		printf("Error creating server socket.\nProgram quitting.\n");
		return 1;
	}

	// Set up the ip & port
	struct sockaddr_in serverAddress;
	serverAddress.sin_family = AF_INET;
	serverAddress.sin_addr.s_addr = INADDR_ANY;
	serverAddress.sin_port = htons(CHOSEN_PORT);
	int addressLength = sizeof(serverAddress);

	// Binding and listening
	int bindResult = bind(serverSocket, (struct sockaddr *) &serverAddress, addressLength);
	if (bindResult < 0){
		printf("Error binding to the socket.\nProgram quitting.\n");
		return 1;
	}
	int listenResult = listen(serverSocket, 1);
	if (listenResult < 0){
		printf("Error listening to the socket.\nProgram quitting.\n");
		return 1;
	}

	int clientSocket; // Temporary variable will be used for each new client

	// Run without stopping
	while(true){
		clientSocket = accept(serverSocket, (struct sockaddr *) &serverAddress, (socklen_t *) &addressLength);
		// If client socket has a negative number, it is bad and should be ignored
		if (clientSocket < 0){
			printf("Error accepting connection. \n");
			continue;
		}else if (numClients == MAX_CLIENTS){
			// Ignore client if we have reached max
			continue;
		}
		// Create a thread for communication
		pthread_t childID;
		pthread_create(&childID, NULL, communicateWithClient, (void *) &clientSocket);
	}

	// Unreachable connectly, may change my mind
	close(serverSocket);
}

void communicateWithClient(void* clientSocketVoid){
	const int* CLIENT_SOCKET = (int*) clientSocketVoid; // Cast due to known value
	int clientSocket = *CLIENT_SOCKET; // Move the value to a convinient variable
	char receivingBuffer[MAX_MESSAGE_SIZE] = {};
	char sendingBuffer[MAX_MESSAGE_SIZE] = {};
	char userName[USERNAME_SIZE] = {}; // store username of connected client
	char password[PASSWORD_SIZE] = {};

	// Ask for username
	strcpy(sendingBuffer, "Welcome to the chat room\nPlease enter your username: ");
	sendToClient(clientSocket, sendingBuffer, sizeof(sendingBuffer));
	
	// Receive username
	receiveFromClient(clientSocket, receivingBuffer, sizeof(receivingBuffer));
	strcpy(userName, receivingBuffer);

	// Ask for chatroom password
	strcpy(sendingBuffer, "Please enter the chatroom password: ");
	sendToClient(clientSocket, sendingBuffer, sizeof(sendingBuffer));
	
	// Receive password
	receiveFromClient(clientSocket, receivingBuffer, sizeof(receivingBuffer));
	strcpy(password, receivingBuffer);

	// If password is correct then they may enter
	if (strcmp(password, chatroomPassword) == 0){
		addClient(clientSocket);
		sprintf(sendingBuffer, "Authenticated!\nHello %s!\n", userName);
		bool receiveRequests = true;
		// Loop until the user quits
		while(receiveRequests){
			// Get a message from the user
			receiveFromClient(clientSocket, receivingBuffer, sizeof(receivingBuffer));
			// If message is $quit then quit
			receiveRequests = !(strcmp(receivingBuffer, quitCommand) == 0);
			// Otherwise send message to all clients
			sprintf(sendingBuffer, "%s: %s", userName, receivingBuffer);
			sendToAllClientsExcept(sendingBuffer, sizeof(sendingBuffer), clientSocket);
		}
	}else{
		strcpy(sendingBuffer, "Invalid password.\nPlease restart the application.");
		sendToClient(clientSocket, sendingBuffer, sizeof(sendingBuffer));
	}

	removeClient(clientSocket);
	close(clientSocket);
	pthread_exit(NULL);
}

void sendMessageToClient(int clientSocket, char* buffer, int bufferSize){
	// Send contents of the buffer
	send(clientSocket, buffer, bufferSize, 0);
	// Clear the buffer
	strcpy(buffer, "");
}

void readProgramInformation(){
	// Open data file
	FILE* dataFile = fopen("program_data.txt", "r");

	// If the data file cannot be read
	if (dataFile == NULL){
		printf("Error opening data file!\nProgram quitting.\n");
		exit(1);
	}

	// NOTE: May encounter error if file format is not right
	fgets(chatroomPassword, sizeof(chatroomPassword), dataFile);
	fgets(quitCommand, sizeof(quitCommand), dataFile);

	fclose(dataFile);
}

void addClient(int clientID){
	printf("Client Socket:%d\n", clientSocket);
	clients[numClients++] = clientID;
}

// This assumes the client is found
void removeClient(int clientID){
	for (int i = 0; i < numClients; i++){
		// if the client has been found
		if (clientID == clients[i]){
			for (int j = i; j < numClients - 1; j++){
				clients[j] = clients[j+1];
			}
		}
	}
	numClients--;
}

void sendToAllClientsExcept(char* buffer, int bufferSize, int clientSocket){
	for (int i = 0; i < numClients; i++){
		// Ignore if its the sender
		if (clientSocket == clients[i]){
			continue;
		}
		sendMessageToClient(clients[i], buffer, bufferSize);
	}
}
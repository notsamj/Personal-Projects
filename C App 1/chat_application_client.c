#include <stdio.h>
#include<sys/socket.h>
#include<arpa/inet.h>
#include<pthread.h>
#include<unistd.h>
#include<string.h>
#include<stdbool.h>

#define APPLICATION_PORT 27015 // Using the usual steam game port
#define MAX_SENDING_MESSAGE_SIZE 4096
#define MAX_RECEIVING_MESSAGE_SIZE 4096
#define USERNAME_SIZE 32
#define STANDARD_STRING_SIZE 32

char quitCommand[STANDARD_STRING_SIZE] = {}; // Making it standard string size if provided one is too big then it's seen as the user's fault

void receiveFromServer(int, char*, int);
void receiveFromServerAsync(int, char*, int);
void sendToServer(int, char*, int);
void readProgramInformation();
void* receiveAndPrint(void*);
void removeTrailingNLine(char*);

int main(int argc, char const *argv[]){
	// Read information about the program (i.e. quit command)
	readProgramInformation();
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

	char sendingBuffer[MAX_SENDING_MESSAGE_SIZE] = {};
	char receivingBuffer[MAX_RECEIVING_MESSAGE_SIZE] = {};
	char userName[USERNAME_SIZE] = {};

	// Handle "login-in process"

	// Get request to login
	receiveFromServer(clientSocket, receivingBuffer, sizeof(receivingBuffer));
	printf("%s", receivingBuffer);

	// Send username
	scanf("%s", sendingBuffer);
	strcpy(userName, sendingBuffer);
	sendToServer(clientSocket, sendingBuffer, sizeof(sendingBuffer));

	// Get request for password
	receiveFromServer(clientSocket, receivingBuffer, sizeof(receivingBuffer));
	printf("%s", receivingBuffer);

	// Send password
	scanf("%s", sendingBuffer);
	sendToServer(clientSocket, sendingBuffer, sizeof(sendingBuffer));

	// Get auth message
	receiveFromServer(clientSocket, receivingBuffer, sizeof(receivingBuffer));
	printf("%s", receivingBuffer);

	// Create a thread for communication
	pthread_t childID;
	pthread_create(&childID, NULL, &receiveAndPrint, (void *) &clientSocket);


	bool quitProgram = false;

	// Run until user writes the quit command
	while (!quitProgram){
		scanf("%s", sendingBuffer);
		sendToServer(clientSocket, sendingBuffer, sizeof(sendingBuffer));
		quitProgram = strcmp(sendingBuffer, quitCommand) == 0;
		printf("quitProgram %s %s %d\n", sendingBuffer, quitCommand, strcmp(sendingBuffer, quitCommand));
	}
	printf("Quitting\n");
	close(clientSocket);
	pthread_cancel(childID);
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
	removeTrailingNLine(quitCommand);

	fclose(dataFile);
}

void receiveFromServer(int clientSocket, char* receivingBuffer, int bufferSize){
	int received = recv(clientSocket, receivingBuffer, bufferSize, 0);

	// if error receiving 
	if (received == 0){
		printf("Error receving data from the server.\n");
		return;
	}
}

void receiveFromServerAsync(int clientSocket, char* receivingBuffer, int bufferSize){
	int received = recv(clientSocket, receivingBuffer, bufferSize, 0);

	// if error receiving 
	if (received == 0){
		strcpy(receivingBuffer, "");
		return;
	}
}

void sendToServer(int clientSocket, char* sendingBuffer, int bufferSize){
	send(clientSocket, sendingBuffer, bufferSize, 0);
}

void* receiveAndPrint(void* clientSocketVoid){
	const int* CLIENT_SOCKET = (int*) clientSocketVoid; // Cast due to known value
	int clientSocket = *CLIENT_SOCKET; // Move the value to a convinient variable
	char receivingBuffer[MAX_RECEIVING_MESSAGE_SIZE] = {};
	while (true){
		receiveFromServerAsync(clientSocket, receivingBuffer, sizeof(receivingBuffer));
		if (strlen(receivingBuffer) > 1){
			printf("%s\n", receivingBuffer);
		}else{
			sleep(1);
		}
	}
}

void removeTrailingNLine(char* str){
	int n = strlen(str);
	if (n == 0 || str[n-1] != '\n'){

		return;
	}
	str[n-1] = '\0';
}
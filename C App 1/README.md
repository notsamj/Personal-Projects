# C App 1
#### chat_application_server.c
#### chat_application_client.c
#### Tested with Compiler: gcc (GNU Compiler Collection)
##### Written by: Samuel Jones
####

## Application Purpose
C Sharp App 1 provides a Chat Room. Clients may connect, enter their name, and begin chatting.

![Application Running on Ubuntu](https://github.com/notsamj/Personal-Projects/blob/master/C%20App%201/Runtime%20Screenshots/runtime_example1.png?raw=true)

## Application User Guide
### Before Running
2. Set server password as the first line of `program_data.txt`
3. Set quit command as the second line of `program_data.txt`
4. Set quit command as the first line of `client_data.txt`
5. Either modify `#define APPLICATION_PORT 27015` to `#define APPLICATION_PORT {New Port}` in
`chat_application_server.c` and `chat_application_client.c` or accept that the port is `27015`
6. Compile `chat_application_server.c` & `chat_application_client.c`
7. Run the compiled server
8. Run the compiled client as many times as you wish

### While Running
#### Server
CTRL+C to end the server, I neglected to add a user-friendly way to shut it down.

#### Client
`$quit` or whatever is written in the files to quit\
The in-program prompts should be self-explanatory.

## Application Shortcomings
The application has various shortcomings. Listed below are a few.
- Port selection is not dynamic
  - Port must be set in the .c files
- IP selection is not dynamic
  - IP must be set in the `chat_application_client.c` file
- Messages including a space are split into multiple
  - I didn't feel that fixing this was important, although I know it's very simple.
- If request by server to close the application isn't heeded -> receive an error
  - I didn't want to have to search for exact string ""
- if you wanted to run the client and server on different computers, you would need to modify the ip in `chat_application_client.c`
- It is possible that buffer overflow could be encountered.
  - I don't think it would happen, but I have to admit the posibility given that I'm new to C.
  - Specifically the line `sprintf(sendingBuffer, "%s: %s", userName, receivingBuffer);` in `chat_application_server.c`
  gets a compiler warning. Although I do not believe it would in practice encounter a buffer overflow due to the line `receivingBuffer[MAX_RECEIVING_MESSAGE_SIZE - USERNAME_SIZE * 2] = '\0';`
  included to eliminate that risk.
  
I prefer to aknowledge shortcomings of an application rather than leave them unmentioned. There are many reasons for this, I won't elaborate here.

### Experience working on similar programs
This program is similar by one of the projects from a course I took. Because this program is so short, it has a lot in common with my assignments. I have concluded
that it is different enough to be a separate application because none of my assignments involved communicating between clients using
a server as a medium (to the best of my recollection). When it comes to short applications involving a client and server
in C, it is inevitable they will be similar due to much of the code comprising setting up sockets and receiving & copying strings. 

### Author Background in C
I have little experience in C. I took a course from January to April 2023 in C. This program illustrates much of what I learned
in that course about programming in C.

### Regarding the comments
I didn't make many comments. I decided to use this program as a way to illustrate how many and how detailed
I comment in programs that don't have a requirement to add proper comments.

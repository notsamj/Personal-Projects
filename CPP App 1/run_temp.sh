clear
g++ -c notsam_linked_list.cpp -std=c++20 -o notsam_linked_list.o
g++ -c data_formatter.cpp -std=c++20 -o data_formatter.o
g++ -c helper_functions.cpp -std=c++20 -o helper_functions.o
g++ -c multiplayer_game.cpp -std=c++20 -o multiplayer_game.o
g++ -c tank_game.cpp -std=c++20 -o tank_game.o
g++ -c temp.cpp -std=c++20 -o temp.o

g++ -o temp.exe temp.o tank_game.o multiplayer_game.o helper_functions.o data_formatter.o notsam_linked_list.o
./temp.exe
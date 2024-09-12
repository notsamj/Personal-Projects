#ifndef _HELPER_FUNCTIONS_ 
#define _HELPER_FUNCTIONS_ 
#include <string>
#include "notsam_linked_list.h"
using namespace std;

NotSam::LinkedList<string>* splitStringBySubstring(string sourceString, string subString);

std::string cleanseStringOfCharacter(std::string myString, char character);

bool stringToBoolean(std::string str);
#endif
#include <string>
#include "notsam_linked_list.cpp"
using namespace std;

NotSam::LinkedList<string>* splitStringBySubstring(string sourceString, string subString){
	NotSam::LinkedList<string>* splitResult = new NotSam::LinkedList<string>();
	int sourceStringLength = sourceString.length();
	int subStringLength = subString.length();

	string currentString = "";
	// Loop through source string to create split results
	for (int i = 0; i < sourceStringLength; i++){
		char currentCharacter = sourceString[i];
		bool isSubString = true;
		int endOfSubStringPosition = i + subStringLength;
		// Check if its possible to find the substring at the current position
		if (endOfSubStringPosition > sourceStringLength){
			isSubString = false;
		}else{
			// Check for substring at current character position
			for (int j = i; j < endOfSubStringPosition; j++){
				int subStringIndex = j - i;
				// If not expected character in substring
				if (currentCharacter != subString[subStringIndex]){
					isSubString = false;
					break;
				}
			}
		}

		// Skip the substring
		if (isSubString){
			// Add to split result if its not blank
			if (currentString.length() > 0){
				splitResult->push(currentString);
				currentString = "";
			}
			i += subStringLength - 1; // Subtract 1 because i++ anyway
		}
		// Otherwise, collect the character
		else{ 
			currentString += currentCharacter;
		}
	}

	// At end
	if (currentString.length() > 0){
		splitResult->push(currentString);
	}

	return splitResult;
}
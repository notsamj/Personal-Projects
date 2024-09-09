#include "helper_functions.h"
#include "data_formatter.h"
using namespace std;

int main(int argc, const char* argv[]){
	// Test reading from file to DataFormatter object
	NotSam::DataFormatter* dataFormatter = NotSam::DataFormatter::readFromFile("test_data_formatter_string.txt");
	
	// Test data formatter object to string to a new file
	dataFormatter->saveToFile("out.txt");

	// Manual (compare with original file)
	return 0;
}
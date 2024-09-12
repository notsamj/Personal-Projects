/*#include "helper_functions.h"
#include "data_formatter.h"
using namespace std;

int main(int argc, const char* argv[]){
	// Test reading from file to DataFormatter object
	DataFormatter* dataFormatter = DataFormatter::readFromFile("test_data_formatter_string.txt");
	
	// Test data formatter object to string to a new file
	dataFormatter->saveToFile("out.txt");

	// Manual (compare with original file)
	return 0;
}*/
#include <string>
#include "notsam_linked_list.h"
int main(int argc, const char* argv[]){
	NotSam::LinkedList<std::string>* abc = new NotSam::LinkedList<std::string>();
	abc->push(std::string("asas"));
	abc->print();
}
#include "helper_functions.cpp"
using namespace std;

int main(int argc, const char* argv[]){
	NotSam::LinkedList<string>* resultList = splitStringBySubstring("a|c ", " ");
	resultList->print();
	cout << "OK" << resultList->get(0) << "OK\n";
	return 0;
}
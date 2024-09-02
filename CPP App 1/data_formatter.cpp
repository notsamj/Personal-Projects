#include "data_formatter.h"
#include "helper_functions.cpp"
NotSam::DataFormatter(){
	this->entries = new LinkedList<DataEntry>();
}

NotSam::DataFormatter(string dataFormatterString){
	// Call default constructor
	DataFormatter();


}

void NotSam::addEntry(string key, DataEntry entry){}

DataEntry NotSam::getEntry(string key){}

string NotSam::toString(){}
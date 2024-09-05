#include "data_formatter.h"
#include "helper_functions.cpp"
#include <string>

std::string NotSam::enumEDTToString(NotSam::EntryDataType enumType){
	if (type == NotSam::EntryDataType::IntegerEntry){
		return "integer_entry";
	}else if (type == NotSam::EntryDataType::IntegerListEntry){
		return "integer_list_entry";
	}else if (type == NotSam::EntryDataType::FloatEntry){
		return "float_entry";
	}else if (type == NotSam::EntryDataType::FloatListEntry){
		return "float_list_entry";
	}else if (type == NotSam::EntryDataType::BooleanEntry){
		return "boolean_entry";
	}else if (type == NotSam::EntryDataType::StringEntry){
		return "string_entry";
	}else if (type == NotSam::EntryDataType::StringListEntry){
		return "string_list_entry";
	}
	throw std::invalid_argument("Received invalid type");
};

NotSam::EntryDataType NotSam::stringToEnumEDT(std::string typeStr){
	if (type == "integer_entry"){
		return NotSam::EntryDataType::IntegerEntry;
	}else if (type == "integer_list_entry"){
		return NotSam::EntryDataType::IntegerListEntry;
	}else if (type == "float_entry"){
		return NotSam::EntryDataType::FloatEntry;
	}else if (type == "float_list_entry"){
		return NotSam::EntryDataType::FloatListEntry;
	}else if (type == "boolean_entry"){
		return NotSam::EntryDataType::BooleanEntry;
	}else if (type == "string_entry"){
		return NotSam::EntryDataType::StringEntry;
	}else if (type == "string_list_entry"){
		return NotSam::EntryDataType::StringListEntry;
	}
	throw std::invalid_argument("Received invalid type");
}

NotSam::DataFormatter(){
	this->entries = new NotSam::LinkedList<DataEntry*>();
}

NotSam::DataFormatter(string dataFormatterString){
	// Call default constructor
	NotSam::DataFormatter();

	LinkedList<std::string>* stringSplit = splitStringBySubstring(dataFormatterString, '\n');

	int stringSplitSize = stringSplit->getLength();
	// Expecting multiple of 3 lines
	if (stringSplitSize % 3 != 0){
		throw std::invalid_argument("Received invalid data formatter string.");
	}

	// Loop until end of strings
	for (int i = 0; i < stringSplitSize; i += 3){
		std::string key = stringSplit->get(i);
		NotSam::DataFormatter::EntryDataType type = NotSam::DataFormatter::stringToEnumEDT(stringSplit->get(i+1));
		if (type == NotSam::EntryDataType::IntegerEntry){
			this->entries.push(new NotSam::DataFormatter::IntegerEntry(key, stringSplit->get(i+2)));
		}else if (type == NotSam::EntryDataType::IntegerListEntry){
			this->entries.push(new NotSam::DataFormatter::IntegerListEntry(key, stringSplit->get(i+2)));
		}else if (type == NotSam::EntryDataType::FloatEntry){
			this->entries.push(new NotSam::DataFormatter::FloatEntry(key, stringSplit->get(i+2)));
		}else if (type == NotSam::EntryDataType::FloatListEntry){
			this->entries.push(new NotSam::DataFormatter::FloatListEntry(key, stringSplit->get(i+2)));
		}else if (type == NotSam::EntryDataType::BooleanEntry){
			this->entries.push(new NotSam::DataFormatter::BooleanEntry(key, stringSplit->get(i+2)));
		}else if (type == NotSam::EntryDataType::StringEntry){
			this->entries.push(new NotSam::DataFormatter::StringEntry(key, stringSplit->get(i+2)));
		}else if (type == NotSam::EntryDataType::StringListEntry){
			this->entries.push(new NotSam::DataFormatter::StringListEntry(key, stringSplit->get(i+2)));
		}
		throw std::invalid_argument("Received invalid data formatter string.");
	}
	// Clean up
	delete stringSplit;
}

NotSam::DataFormatter* static NotSam::DataFormatter::readFromFile(string fileName){
	// TODO
}

void NotSam::DataFormatter::addEntry(DataEntry* entry){
	this->entries->push(entry);
}

DataEntry* NotSam::DataFormatter::getEntry(string key){
	for (int i = 0; i < this->entries->getLength(); i++){
		DataEntry* entry = this->entries->get(i);
		if (entry->getKey() == key){
			return entry;
		}
	}
	return 0;
}

string NotSam::DataFormatter::toString(){
	std::string outputString = "";
	for (int i = 0; i < this->entries->getLength(); i++){
		DataEntry* entry = this->entries->get(i);
		if (i != 0){
			outputString += '\n';
		}
		outputString += entry->toString();
	}
	return outputString;
}

NotSam::DataFormatter::DataEntry::DataEntry(std::string key, std::string type){
	this->key = key;
	this->type = type;
}

std::string NotSam::DataFormatter::DataEntry::getKey(){
	return this->key;
}

std::string NotSam::DataFormatter::DataEntry::getType(){
	return this->type;
}

NotSam::DataFormatter::IntegerEntry::IntegerEntry(std::string key, int integerToStore){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::IntegerEntry);
	this->storedInteger = integerToStore;
}

NotSam::DataFormatter::IntegerEntry::IntegerEntry(std::string key, std::string stringRepresentation){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::IntegerEntry);
	this->storedInteger = std::stoi(stringRepresentation);
}

int getValue(){
	return this->storedInteger;
}

std::string toString(){
	return this->key + '\n' + NotSam::enumEDTToString(this->getType()) + '\n' + std::to_string(this->storedInteger);
}

std::string getType(){
	return this->type;
}

NotSam::DataFormatter::IntegerListEntry::IntegerListEntry(std::string key, LinkedList<int>* integersToStore){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::IntegerListEntry);
	this->storedIntegers = integersToStore;
}

NotSam::DataFormatter::IntegerListEntry::IntegerListEntry(std::string key, std::string stringRepresentation){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::IntegerListEntry);
	this->storedIntegers = new NotSam::LinkedList<int>();
	LinkedList<std::string>* stringSplit = splitStringBySubstring(dataFormatterString, ',');
	for (int i = 0; i < stringSplit.getSize(); i++){
		this->storedIntegers->push(std::stoi(stringSplit->getQuick(i)));
	}
	delete stringSplit;
}

LinkedList<int>* NotSam::DataFormatter::IntegerListEntry::getValue(){
	return this->storedIntegers;
}

std::string NotSam::DataFormatter::IntegerListEntry::toString(){
	std::string integerListString = "";
	int sortedIntegersLength = this->storedIntegers.getLength();
	for (int i = 0; i < sortedIntegersLength; i++){
		integerListString += std::to_string(this->sortedIntegers->get(i));
		if (i != sortedIntegersLength - 1){
			integerListString += ',';
		}
	}
	return this->key + '\n' + NotSam::enumEDTToString(this->getType()) + '\n' + integerListString;
}

NotSam::DataFormatter::FloatEntry::FloatEntry(std::string key, float floatToStore){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::FloatEntry);
	this->storedFloat = floatToStore;
}

NotSam::DataFormatter::FloatEntry::FloatEntry(std::string key, std::string stringRepresentation){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::FloatEntry);
	this->storedFloat = std::stof(stringRepresentation);
}

float NotSam::DataFormatter::FloatEntry::getValue(){
	return this->storedFloat;
}

std::string NotSam::DataFormatter::FloatEntry::toString(){
	return this->key + '\n' + NotSam::enumEDTToString(this->getType()) + '\n' + std::to_string(this->storedInteger);
}

NotSam::DataFormatter::FloatListEntry::FloatListEntry(std::string key, LinkedList<float>* floatsToStore){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::FloatListEntry);
	this->storedFloats = floatsToStore;
}

NotSam::DataFormatter::FloatListEntry::FloatListEntry(std::string key, std::string stringRepresentation){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::FloatListEntry);
	this->storedFloats = new NotSam::LinkedList<float>();
	LinkedList<std::string>* stringSplit = splitStringBySubstring(dataFormatterString, ',');
	for (int i = 0; i < stringSplit.getSize(); i++){
		this->storedFloats->push(std::stof(stringSplit->getQuick(i)));
	}
	delete stringSplit;
}

LinkedList<float>* NotSam::DataFormatter::FloatListEntry::getValue(){
	return this->storedFloats;
}
std::string NotSam::DataFormatter::FloatListEntry::toString(){
	std::string floatListString = "";
	int storedFloatLength = this->storedFloats.getLength();
	for (int i = 0; i < storedFloatLength; i++){
		floatListString += std::to_string(this->storedFloats->get(i));
		if (i != storedFloatLength - 1){
			floatListString += ',';
		}
	}
	return this->key + '\n' + NotSam::enumEDTToString(this->getType()) + '\n' + floatListString;
}

NotSam::DataFormatter::BooleanEntry::BooleanEntry(std::string key, bool booleanToStore){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::BooleanEntry);
	this->storedBoolean = booleanToStore;
}

NotSam::DataFormatter::BooleanEntry::BooleanEntry(std::string key, std::string stringRepresentation){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::BooleanEntry);
	this->storedBoolean = std::stob(stringRepresentation);
}

bool NotSam::DataFormatter::BooleanEntry::getValue(){
	return this->storedBoolean;
}
std::string NotSam::DataFormatter::BooleanEntry::toString(){
	return this->key + '\n' + NotSam::enumEDTToString(this->getType()) + '\n' + std::to_string(this->storedBoolean);
}

NotSam::DataFormatter::StringEntry::StringEntry(std::string key, std::string stringToStore){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::StringEntry);
	this->storedString = cleanseStringOfCharacter(stringToStore, ',');
}

NotSam::DataFormatter::StringEntry::StringEntry(std::string key, std::string stringRepresentation){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::StringEntry);
	this->storedString = stringRepresentation;
}

std::string NotSam::DataFormatter::StringEntry::getValue(){
	return this->storedStrings;
}

std::string NotSam::DataFormatter::StringEntry::toString(){
	return this->key + '\n' + NotSam::enumEDTToString(this->getType()) + '\n' + this->storedString;
}

NotSam::DataFormatter::StringListEntry::StringListEntry(std::string key, LinkedList<std::string>* stringsToStore){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::StringEntry);
	this->storedStrings = stringToStore;
	// Remove all commas
	for (int i = 0; i < this->storedStrings.getLength(); i++){
		this->storedStrings->set(i, cleanseStringOfCharacter(storedStrings->get(i), ','));
	}
}

NotSam::DataFormatter::StringListEntry::StringListEntry(std::string key, std::string stringRepresentation){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::StringEntry);
	this->storedStrings = new NotSam::LinkedList<std::string>();
	LinkedList<std::string>* stringSplit = splitStringBySubstring(dataFormatterString, ',');
	for (int i = 0; i < stringSplit.getSize(); i++){
		this->storedIntegers->push(stringSplit->getQuick(i));
	}
	delete stringSplit;
}

LinkedList<std::string>* NotSam::DataFormatter::StringListEntry::getValue(){
	return this->storedStrings;
}
std::string NotSam::DataFormatter::StringListEntry::toString(){
	std::string stringListString = "";
	int storedStringsLength = this->storedStrings.getLength();
	for (int i = 0; i < storedStringsLength; i++){
		stringListString += this->storedStrings->get(i);
		if (i != storedStringsLength - 1){
			stringListString += ',';
		}
	}
	return this->key + '\n' + NotSam::enumEDTToString(this->getType()) + '\n' + stringListString;
}
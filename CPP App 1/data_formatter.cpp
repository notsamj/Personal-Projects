#include "data_formatter.h"
#include "helper_functions.h"
std::string NotSam::enumEDTToString(NotSam::EntryDataType enumType){
	if (enumType == NotSam::EntryDataType::IntegerEntry){
		return "integer_entry";
	}else if (enumType == NotSam::EntryDataType::IntegerListEntry){
		return "integer_list_entry";
	}else if (enumType == NotSam::EntryDataType::FloatEntry){
		return "float_entry";
	}else if (enumType == NotSam::EntryDataType::FloatListEntry){
		return "float_list_entry";
	}else if (enumType == NotSam::EntryDataType::BooleanEntry){
		return "boolean_entry";
	}else if (enumType == NotSam::EntryDataType::StringEntry){
		return "string_entry";
	}else if (enumType == NotSam::EntryDataType::StringListEntry){
		return "string_list_entry";
	}
	throw std::invalid_argument("Received invalid type");
}

NotSam::EntryDataType NotSam::stringToEnumEDT(std::string typeStr){
	if (typeStr == "integer_entry"){
		return NotSam::EntryDataType::IntegerEntry;
	}else if (typeStr == "integer_list_entry"){
		return NotSam::EntryDataType::IntegerListEntry;
	}else if (typeStr == "float_entry"){
		return NotSam::EntryDataType::FloatEntry;
	}else if (typeStr == "float_list_entry"){
		return NotSam::EntryDataType::FloatListEntry;
	}else if (typeStr == "boolean_entry"){
		return NotSam::EntryDataType::BooleanEntry;
	}else if (typeStr == "string_entry"){
		return NotSam::EntryDataType::StringEntry;
	}else if (typeStr == "string_list_entry"){
		return NotSam::EntryDataType::StringListEntry;
	}
	throw std::invalid_argument("Received invalid type");
}

NotSam::DataFormatter::DataFormatter(){
	this->entries = new NotSam::LinkedList<NotSam::DataFormatter::DataEntry*>();
}

NotSam::DataFormatter::DataFormatter(string dataFormatterString){
	// Call default constructor
	NotSam::DataFormatter();

	LinkedList<std::string>* stringSplit = splitStringBySubstring(dataFormatterString, std::string(1, '\n'));

	int stringSplitSize = stringSplit->getLength();
	// Expecting multiple of 3 lines
	if (stringSplitSize % 3 != 0){
		throw std::invalid_argument("Received invalid data formatter string.");
	}

	// Loop until end of strings
	for (int i = 0; i < stringSplitSize; i += 3){
		std::string key = stringSplit->get(i);
		NotSam::EntryDataType enumType = NotSam::stringToEnumEDT(stringSplit->get(i+1));
		if (enumType == NotSam::EntryDataType::IntegerEntry){
			this->entries->push(new NotSam::DataFormatter::IntegerEntry(key, stringSplit->get(i+2)));
		}else if (enumType == NotSam::EntryDataType::IntegerListEntry){
			this->entries->push(new NotSam::DataFormatter::IntegerListEntry(key, stringSplit->get(i+2)));
		}else if (enumType == NotSam::EntryDataType::FloatEntry){
			this->entries->push(new NotSam::DataFormatter::FloatEntry(key, stringSplit->get(i+2)));
		}else if (enumType == NotSam::EntryDataType::FloatListEntry){
			this->entries->push(new NotSam::DataFormatter::FloatListEntry(key, stringSplit->get(i+2)));
		}else if (enumType == NotSam::EntryDataType::BooleanEntry){
			this->entries->push(new NotSam::DataFormatter::BooleanEntry(key, stringSplit->get(i+2)));
		}else if (enumType == NotSam::EntryDataType::StringEntry){
			this->entries->push(new NotSam::DataFormatter::StringEntry(key, stringSplit->get(i+2)));
		}else if (enumType == NotSam::EntryDataType::StringListEntry){
			this->entries->push(new NotSam::DataFormatter::StringListEntry(key, stringSplit->get(i+2)));
		}
		throw std::invalid_argument("Received invalid data formatter string.");
	}
	// Clean up
	delete stringSplit;
}

NotSam::DataFormatter* NotSam::DataFormatter::readFromFile(string fileName){
	std::string fileData;

	std::ifstream file(fileName);

	file >> fileData;

	return new DataFormatter(fileData);
}

void NotSam::DataFormatter::addEntry(NotSam::DataFormatter::DataEntry* entry){
	this->entries->push(entry);
}

NotSam::DataFormatter::DataEntry* NotSam::DataFormatter::getEntry(string key){
	for (int i = 0; i < this->entries->getLength(); i++){
		NotSam::DataFormatter::DataEntry* entry = this->entries->get(i);
		if (entry->getKey() == key){
			return entry;
		}
	}
	return 0;
}

std::string NotSam::DataFormatter::toString(){
	std::string outputString = "";
	for (int i = 0; i < this->entries->getLength(); i++){
		NotSam::DataFormatter::DataEntry* entry = this->entries->get(i);
		if (i != 0){
			outputString += '\n';
		}
		outputString += entry->toString();
	}
	return outputString;
}

void NotSam::DataFormatter::saveToFile(std::string fileName){
	std::ofstream file(fileName);

	file << this->toString();

	file.close();
}

NotSam::DataFormatter::DataEntry::DataEntry(std::string key, std::string EDTType){
	this->key = key;
	this->EDTType = NotSam::stringToEnumEDT(EDTType);
}

std::string NotSam::DataFormatter::DataEntry::getKey(){
	return this->key;
}

NotSam::EntryDataType NotSam::DataFormatter::DataEntry::getType(){
	return this->EDTType;
}

NotSam::DataFormatter::IntegerEntry::IntegerEntry(std::string key, int integerToStore) : NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::IntegerEntry) {
	//NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::IntegerEntry);
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
	return this->EDTType;
}

NotSam::DataFormatter::IntegerListEntry::IntegerListEntry(std::string key, LinkedList<int>* integersToStore){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::IntegerListEntry);
	this->storedIntegers = integersToStore;
}

NotSam::DataFormatter::IntegerListEntry::IntegerListEntry(std::string key, std::string stringRepresentation){
	NotSam::DataFormatter::DataEntry(key, NotSam::EntryDataType::IntegerListEntry);
	this->storedIntegers = new NotSam::LinkedList<int>();
	LinkedList<std::string>* stringSplit = splitStringBySubstring(dataFormatterString, std::string(1, ','));
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
	LinkedList<std::string>* stringSplit = splitStringBySubstring(dataFormatterString, std::string(1, ','));
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
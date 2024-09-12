#include "data_formatter.h"
std::string enumEDTToString(EntryDataType enumType){
	if (enumType == EntryDataType::IntegerEntry){
		return "integer_entry";
	}else if (enumType == EntryDataType::IntegerListEntry){
		return "integer_list_entry";
	}else if (enumType == EntryDataType::FloatEntry){
		return "float_entry";
	}else if (enumType == EntryDataType::FloatListEntry){
		return "float_list_entry";
	}else if (enumType == EntryDataType::BooleanEntry){
		return "boolean_entry";
	}else if (enumType == EntryDataType::StringEntry){
		return "string_entry";
	}else if (enumType == EntryDataType::StringListEntry){
		return "string_list_entry";
	}
	throw std::invalid_argument("Received invalid type");
}

EntryDataType stringToEnumEDT(std::string typeStr){
	if (typeStr == "integer_entry"){
		return EntryDataType::IntegerEntry;
	}else if (typeStr == "integer_list_entry"){
		return EntryDataType::IntegerListEntry;
	}else if (typeStr == "float_entry"){
		return EntryDataType::FloatEntry;
	}else if (typeStr == "float_list_entry"){
		return EntryDataType::FloatListEntry;
	}else if (typeStr == "boolean_entry"){
		return EntryDataType::BooleanEntry;
	}else if (typeStr == "string_entry"){
		return EntryDataType::StringEntry;
	}else if (typeStr == "string_list_entry"){
		return EntryDataType::StringListEntry;
	}
	throw std::invalid_argument("Received invalid type");
}

DataFormatter::DataFormatter(){
	this->entries = new NotSam::LinkedList<DataFormatter::DataEntry*>();
}

DataFormatter::DataFormatter(string dataFormatterString){
	// Call default constructor
	DataFormatter();

	NotSam::LinkedList<std::string>* stringSplit = splitStringBySubstring(dataFormatterString, std::string(1, '\n'));

	int stringSplitSize = stringSplit->getLength();
	// Expecting multiple of 3 lines
	if (stringSplitSize % 3 != 0){
		throw std::invalid_argument("Received invalid data formatter string.");
	}

	// Loop until end of strings
	for (int i = 0; i < stringSplitSize; i += 3){
		std::string key = stringSplit->get(i);
		EntryDataType enumType = stringToEnumEDT(stringSplit->get(i+1));
		if (enumType == EntryDataType::IntegerEntry){
			this->entries->push(new DataFormatter::IntegerEntry(key, stringSplit->get(i+2)));
		}else if (enumType == EntryDataType::IntegerListEntry){
			this->entries->push(new DataFormatter::IntegerListEntry(key, stringSplit->get(i+2)));
		}else if (enumType == EntryDataType::FloatEntry){
			this->entries->push(new DataFormatter::FloatEntry(key, stringSplit->get(i+2)));
		}else if (enumType == EntryDataType::FloatListEntry){
			this->entries->push(new DataFormatter::FloatListEntry(key, stringSplit->get(i+2)));
		}else if (enumType == EntryDataType::BooleanEntry){
			this->entries->push(new DataFormatter::BooleanEntry(key, stringSplit->get(i+2)));
		}else if (enumType == EntryDataType::StringEntry){
			this->entries->push(new DataFormatter::StringEntry(key, stringSplit->get(i+2)));
		}else if (enumType == EntryDataType::StringListEntry){
			this->entries->push(new DataFormatter::StringListEntry(key, stringSplit->get(i+2)));
		}
		throw std::invalid_argument("Received invalid data formatter string.");
	}
	// Clean up
	delete stringSplit;
}

DataFormatter* DataFormatter::readFromFile(string fileName){
	std::string fileData;

	std::ifstream file(fileName);

	file >> fileData;

	return new DataFormatter(fileData);
}

void DataFormatter::addEntry(DataFormatter::DataEntry* entry){
	this->entries->push(entry);
}

DataFormatter::DataEntry* DataFormatter::getEntry(string key){
	for (int i = 0; i < this->entries->getLength(); i++){
		DataFormatter::DataEntry* entry = this->entries->get(i);
		if (entry->getKey() == key){
			return entry;
		}
	}
	return 0;
}

std::string DataFormatter::toString(){
	std::string outputString = "";
	for (int i = 0; i < this->entries->getLength(); i++){
		DataFormatter::DataEntry* entry = this->entries->get(i);
		if (i != 0){
			outputString += '\n';
		}
		outputString += entry->toString();
	}
	return outputString;
}

void DataFormatter::saveToFile(std::string fileName){
	std::ofstream file(fileName);

	file << this->toString();

	file.close();
}

DataFormatter::DataEntry::DataEntry(std::string key, EntryDataType EDTType){
	this->key = key;
	this->EDTType = EDTType;
}

std::string DataFormatter::DataEntry::getKey(){
	return this->key;
}

EntryDataType DataFormatter::DataEntry::getType(){
	return this->EDTType;
}

DataFormatter::IntegerEntry::IntegerEntry(std::string key, int integerToStore) : DataFormatter::DataEntry(key, EntryDataType::IntegerEntry) {
	this->storedInteger = integerToStore;
}

DataFormatter::IntegerEntry::IntegerEntry(std::string key, std::string stringRepresentation) : DataFormatter::DataEntry(key, EntryDataType::IntegerEntry) {
	this->storedInteger = std::stoi(stringRepresentation);
}

int DataFormatter::IntegerEntry::getValue(){
	return this->storedInteger;
}

std::string DataFormatter::IntegerEntry::toString(){
	return this->getKey() + '\n' + enumEDTToString(this->getType()) + '\n' + std::to_string(this->storedInteger);
}

DataFormatter::IntegerListEntry::IntegerListEntry(std::string key, NotSam::LinkedList<int>* integersToStore) : DataFormatter::DataEntry(key, EntryDataType::IntegerListEntry) {
	this->storedIntegers = integersToStore;
}

DataFormatter::IntegerListEntry::IntegerListEntry(std::string key, std::string stringRepresentation) : DataFormatter::DataEntry(key, EntryDataType::IntegerListEntry) {
	this->storedIntegers = new NotSam::LinkedList<int>();
	NotSam::LinkedList<std::string>* stringSplit = splitStringBySubstring(stringRepresentation, std::string(1, ','));
	for (int i = 0; i < stringSplit->getSize(); i++){
		this->storedIntegers->push(std::stoi(stringSplit->getQuick(i)));
	}
	delete stringSplit;
}

NotSam::LinkedList<int>* DataFormatter::IntegerListEntry::getValue(){
	return this->storedIntegers;
}

std::string DataFormatter::IntegerListEntry::toString(){
	std::string integerListString = "";
	int storedIntegersLength = this->storedIntegers->getLength();
	for (int i = 0; i < storedIntegersLength; i++){
		integerListString += std::to_string(this->storedIntegers->get(i));
		if (i != storedIntegersLength - 1){
			integerListString += ',';
		}
	}
	return this->getKey() + '\n' + enumEDTToString(this->getType()) + '\n' + integerListString;
}

DataFormatter::FloatEntry::FloatEntry(std::string key, float floatToStore) : DataFormatter::DataEntry(key, EntryDataType::FloatEntry) {
	this->storedFloat = floatToStore;
}

DataFormatter::FloatEntry::FloatEntry(std::string key, std::string stringRepresentation) : DataFormatter::DataEntry(key, EntryDataType::FloatEntry){
	this->storedFloat = std::stof(stringRepresentation);
}

float DataFormatter::FloatEntry::getValue(){
	return this->storedFloat;
}

std::string DataFormatter::FloatEntry::toString(){
	return this->getKey() + '\n' + enumEDTToString(this->getType()) + '\n' + std::to_string(this->storedFloat);
}

DataFormatter::FloatListEntry::FloatListEntry(std::string key, NotSam::LinkedList<float>* floatsToStore) : DataFormatter::DataEntry(key, EntryDataType::FloatListEntry) {
	this->storedFloats = floatsToStore;
}

DataFormatter::FloatListEntry::FloatListEntry(std::string key, std::string stringRepresentation) : DataFormatter::DataEntry(key, EntryDataType::FloatListEntry) {
	this->storedFloats = new NotSam::LinkedList<float>();
	NotSam::LinkedList<std::string>* stringSplit = splitStringBySubstring(stringRepresentation, std::string(1, ','));
	for (int i = 0; i < stringSplit->getSize(); i++){
		this->storedFloats->push(std::stof(stringSplit->getQuick(i)));
	}
	delete stringSplit;
}

NotSam::LinkedList<float>* DataFormatter::FloatListEntry::getValue(){
	return this->storedFloats;
}
std::string DataFormatter::FloatListEntry::toString(){
	std::string floatListString = "";
	int storedFloatLength = this->storedFloats->getLength();
	for (int i = 0; i < storedFloatLength; i++){
		floatListString += std::to_string(this->storedFloats->get(i));
		if (i != storedFloatLength - 1){
			floatListString += ',';
		}
	}
	return this->getKey() + '\n' + enumEDTToString(this->getType()) + '\n' + floatListString;
}

DataFormatter::BooleanEntry::BooleanEntry(std::string key, bool booleanToStore) : DataFormatter::DataEntry(key, EntryDataType::BooleanEntry) {
	this->storedBoolean = booleanToStore;
}

DataFormatter::BooleanEntry::BooleanEntry(std::string key, std::string stringRepresentation) : DataFormatter::DataEntry(key, EntryDataType::BooleanEntry) {
	this->storedBoolean = stringToBoolean(stringRepresentation);
}

bool DataFormatter::BooleanEntry::getValue(){
	return this->storedBoolean;
}
std::string DataFormatter::BooleanEntry::toString(){
	return this->getKey() + '\n' + enumEDTToString(this->getType()) + '\n' + std::to_string(this->storedBoolean);
}

DataFormatter::StringEntry::StringEntry(std::string key, std::string stringToStore) : DataFormatter::DataEntry(key, EntryDataType::StringEntry) {
	this->storedString = cleanseStringOfCharacter(stringToStore, ',');
}

std::string DataFormatter::StringEntry::getValue(){
	return this->storedString;
}

std::string DataFormatter::StringEntry::toString(){
	return this->getKey() + '\n' + enumEDTToString(this->getType()) + '\n' + this->storedString;
}

DataFormatter::StringListEntry::StringListEntry(std::string key, NotSam::LinkedList<std::string>* stringsToStore) : DataFormatter::DataEntry(key, EntryDataType::StringEntry) {
	this->storedStrings = stringsToStore;
	// Remove all commas
	for (int i = 0; i < this->storedStrings->getLength(); i++){
		this->storedStrings->set(i, cleanseStringOfCharacter(storedStrings->get(i), ','));
	}
}

DataFormatter::StringListEntry::StringListEntry(std::string key, std::string stringRepresentation) : DataFormatter::DataEntry(key, EntryDataType::StringEntry) {
	this->storedStrings = new NotSam::LinkedList<std::string>();
	NotSam::LinkedList<std::string>* stringSplit = splitStringBySubstring(stringRepresentation, std::string(1, ','));
	for (int i = 0; i < stringSplit->getSize(); i++){
		this->storedStrings->push(stringSplit->getQuick(i));
	}
	delete stringSplit;
}

NotSam::LinkedList<std::string>* DataFormatter::StringListEntry::getValue(){
	return this->storedStrings;
}
std::string DataFormatter::StringListEntry::toString(){
	std::string stringListString = "";
	int storedStringsLength = this->storedStrings->getLength();
	for (int i = 0; i < storedStringsLength; i++){
		stringListString += this->storedStrings->get(i);
		if (i != storedStringsLength - 1){
			stringListString += ',';
		}
	}
	return this->getKey() + '\n' + enumEDTToString(this->getType()) + '\n' + stringListString;
}
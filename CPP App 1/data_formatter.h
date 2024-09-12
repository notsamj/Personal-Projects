#include <string>
#include <fstream>
#include "notsam_linked_list.h"
#include "helper_functions.h"
enum EntryDataType {
	IntegerEntry,
	IntegerListEntry,
	FloatEntry,
	FloatListEntry,
	BooleanEntry,
	StringEntry,
	StringListEntry
};

std::string enumEDTToString(EntryDataType enumType);
EntryDataType stringToEnumEDT(std::string typeStr);

class DataFormatter {
	public:
		// Abstract Class
		class DataEntry {
			private:
				std::string key;
				EntryDataType EDTType;
			protected:
			public:
				DataEntry(std::string key, EntryDataType EDTType);
				std::string getKey();

				std::string virtual toString();
				EntryDataType getType();
		};

		class IntegerEntry : public DataEntry {
			private:
				int storedInteger;
			public:
				IntegerEntry(std::string key, int integerToStore);
				IntegerEntry(std::string key, std::string stringRepresentation);
				int getValue();
				std::string toString();
		};

		class IntegerListEntry : public DataEntry {
			private:
				NotSam::LinkedList<int>* storedIntegers;
			public:
				IntegerListEntry(std::string key, NotSam::LinkedList<int>* integersToStore);
				IntegerListEntry(std::string key, std::string stringRepresentation);
				NotSam::LinkedList<int>* getValue();
				std::string toString();
		};

		class FloatEntry : public DataEntry {
			private:
				float storedFloat;
			public:
				FloatEntry(std::string key, float floatToStore);
				FloatEntry(std::string key, std::string stringRepresentation);
				float getValue();
				std::string toString();
		};

		class FloatListEntry : public DataEntry {
			private:
				NotSam::LinkedList<float>* storedFloats;
			public:
				FloatListEntry(std::string key, NotSam::LinkedList<float>* floatsToStore);
				FloatListEntry(std::string key, std::string stringRepresentation);
				NotSam::LinkedList<float>* getValue();
				std::string toString();
		};

		class BooleanEntry : public DataEntry {
			private:
				bool storedBoolean;
			public:
				BooleanEntry(std::string key, bool booleanToStore);
				BooleanEntry(std::string key, std::string stringRepresentation);
				bool getValue();
				std::string toString();
		};

		class StringEntry : public DataEntry {
			private:
				std::string storedString;
			public:
				StringEntry(std::string key, std::string stringToStore);
				std::string getValue();
				std::string toString();
		};

		class StringListEntry : public DataEntry {
			private:
				NotSam::LinkedList<std::string>* storedStrings;
			public:
				StringListEntry(std::string key, NotSam::LinkedList<std::string>* stringsToStore);
				StringListEntry(std::string key, std::string stringRepresentation);
				NotSam::LinkedList<std::string>* getValue();
				// Note: Assuming no commas present
				std::string toString();
		};

		DataFormatter();
		DataFormatter(std::string dataFormatterString);
		static DataFormatter* readFromFile(std::string fileName);

		void addEntry(DataEntry* entry);

		DataEntry* getEntry(string key);

		std::string toString();

		void saveToFile(std::string fileName);
	private:
		NotSam::LinkedList<DataFormatter::DataEntry*>* entries;
};
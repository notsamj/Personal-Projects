#include <string>
#include "notsam_linked_list.cpp"
namespace NotSam {
	enum EntryDataType {
		IntegerEntry,
		IntegerListEntry,
		FloatEntry,
		FloatListEntry,
		BooleanEntry,
		StringEntry,
		StringListEntry
	};

	class DataFormatter {
		private:
			LinkedList<DataEntry*> entries;
		public:
			DataFormatter();
			DataFormatter(string dataFormatterString);

			void addEntry(DataEntry* entry);

			DataEntry* getEntry(string key);

			std::string toString();

			// Abstract Class
			class DataEntry {
				private:
					std::string key;
					EntryDataType type;
				protected:
				public:
					DataEntry(std::string key, std::string type);
					std::string getKey();

					std::string virtual toString();
					EntryDataType getType();
			};

			class IntegerEntry : public DataEntry {
				private:
					int storedInteger;
				public:
					IntegerEntry(std::string key, int integerToStore);
					int getValue();
					std::string toString();
			};

			class IntegerListEntry : public DataEntry {
				private:
					LinkedList<int> storedIntegers;
				public:
					IntegerListEntry(std::string key, LinkedList<int>* integersToStore);
					LinkedList<int>* getValue();
					std::string toString();
			};

			class FloatEntry : public DataEntry {
				private:
					float storedFloat;
				public:
					FloatEntry(std::string key, int floatToStore);
					float getValue();
					std::string toString();
			};

			class FloatListEntry : public DataEntry {
				private:
					LinkedList<float> storedFloats;
				public:
					FloatListEntry(std::string key, int floatsToStore);
					LinkedList<float>* getValue();
					std::string toString();
			};

			class BooleanEntry : public DataEntry {
				private:
					bool storedBoolean;
				public:
					BooleanEntry(std::string key, int booleanToStore);
					bool getValue();
					std::string toString();
			};

			class StringEntry : public DataEntry {
				private:
					std::string storedString;
				public:
					StringEntry(std::string key, int stringToStore);
					std::string getValue();
					std::string toString();
			};

			class StringListEntry : public DataEntry {
				private:
					LinkedList<std::string> storedStrings;
				public:
					StringListEntry(std::string key, LinkedList<std::string>* stringsToStore);
					LinkedList<std::string>* getValue();
					// Note: Assuming no commas present
					std::string toString();
			};
	};
}
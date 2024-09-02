#include <string>
#include "notsam_linked_list.cpp"
namespace NotSam {
	class DataFormatter {
		private:
			LinkedList<DataEntry> entries;
		public:
			DataFormatter();
			DataFormatter(string dataFormatterString);

			void addEntry(string key, DataEntry entry);

			DataEntry getEntry(string key);

			string toString();

			// Abstract Class
			class DataEntry {
				public:
				protected:
				private:
			};

			class IntegerEntry : public DataEntry {

			};

			class IntegerArrayEntry : public DataEntry {

			};

			class FloatEntry : public DataEntry {

			};

			class FloatArrayEntry : public DataEntry {

			};

			class BooleanEntry : public DataEntry {

			};

			class StringEntry : public DataEntry {

			};

			class StringArrayEntry : public DataEntry {

			};
	};
}
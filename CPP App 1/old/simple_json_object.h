#include <string>
#include <regex>
#include "notsam_linked_list.h"
// TODO: Would be easier to read things if you took a substring from after key to comma or }
namespace NotSam {
	class SimpleJSONObject {
		private:
		protected:
			NotSam::LinkedList<JSONValue> values;
		public:
		SimpleJSONObject(string sourceString);
		readFromString(string sourceString);
	};

	class JSONValue {
		private:
			string key;
		protected:
		public:
			JSONValue(string key);
			getKey();
	};

	class SimpleJSONObjectValue : public JSONValue, public SimpleJSONObject {
		public: 
		SimpleJSONObjectValue(string key, string sourceString) : JSONValue(key), SimpleJSONObject(sourceString);
	};

	class IntegerValue : public JSONValue {
		private:
		int value;
		public:
		IntegerValue(string key, int value);
	};
}

NotSam::SimpleJSONObject::SimpleJSONObject(sourceString){
	this->values = new NotSam::LinkedList<NotSam::JSONValue>();
	this->readFromString(sourceString);
}

NotSam::SimpleJSONObject::readFromString(string sourceString){
	enum States {
	  LOOKING_FOR_KEY,
	  READING_KEY,
	  LOOKING_FOR_COLON,
	  LOOKING_FOR_VALUE
	};

	enum ValueTypes {
		JSON_OBJECT,
		INTEGER,
		INTEGER_ARRAY,
		FLOAT,
		FLOAT_ARRAY,
		STRING,
		STRING_ARRAY
	}

	enum ValueTypes valueType;
	string currentKey = "";
	JSONValue* currentValue = 0;

	std::regex numberRegex("[0-9]");
	
	enum States state = LOOKING_FOR_KEY;
	for (int i = 0; i < sourceString.length; i++){
		char currentCharacter = sourceString[i];
		if (state == LOOKING_FOR_KEY){
			if (currentCharacter == '\"'){
				state = READING_KEY;
			}
			// Else, simply continue to next character
		}else if (state == READING_KEY){
			if (currentCharacter == '\"'){
				currentKey = "";
				state = LOOKING_FOR_COLON;
			}else{
				// Add character to current key
				currentKey += currentCharacter;
			}
		}else if (state == LOOKING_FOR_COLON){
			if (currentCharacter == ':'){
				state = LOOKING_FOR_VALUE;
			}
			// Else, simply continue to next character
		}else if (state == LOOKING_FOR_VALUE){
			if (currentCharacter == )
		}
	}
}

NotSam::JSONValue::JSONValue(string key){
	this->key = key;
}

string NotSam::JSONValue::getKey(){
	return this->key;
}

NotSam::IntegerValue::IntegerValue(string key, int value) : JSONValue(key){
	this->value = value;
}
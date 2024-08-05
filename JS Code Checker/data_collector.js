const objectHasKey = require("./helper_functions.js").objectHasKey;
class DataCollector {
	constructor(){
		this.storage = {};
	}

	setValue(valueName, value){
		this.storage[valueName] = value;
	}

	hasValue(valueName){
		return objectHasKey(this.storage, valueName);
	}

	incrementCounter(valueName){
		// 0 if doesn't exist
		if (!this.hasValue(valueName)){
			this.setValue(valueName, 0);
		}
		this.storage[valueName]++;
	}

	getDataValue(valueName){
		// 0 if doesn't exist
		if (!this.hasValue(valueName)){
			return 0;
		}
		return this.storage[valueName];
	}
}

module.exports = DataCollector;
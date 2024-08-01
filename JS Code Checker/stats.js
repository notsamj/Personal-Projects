const objectHasKey = require("./helper_functions.js").objectHasKey;
class Stats {
	constructor(){
		this.storage = {};
	}

	setStat(statName, value){
		this.storage[statName] = value;
	}

	hasStat(statName){
		return objectHasKey(this.storage, statName);
	}

	incrementCounter(statName){
		// 0 if doesn't exist
		if (!this.hasStat(statName)){
			this.setStat(statName, 0):
		}
		this.storage[statName]++;
	}

	getStatValue(statName){
		// 0 if doesn't exist
		if (!this.hasStat(statName)){
			return 0;
		}
		return this.storage[statName];
	}
}

module.exports = Stats;
function doesFolderExist(path){
	let fs = require("fs");
	try {
		// If file is a directory then explore it
		if (fs.statSync(path).isDirectory()){
			return true;
		}
	}catch(error){} // Nothing needed because I don't care? 
	return false;
}

module.exports = {
	doesFolderExist
}
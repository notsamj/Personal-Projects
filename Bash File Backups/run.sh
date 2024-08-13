# Functions
ensurePathExists(){
	# $1 - absolute path to back up folder
	# $2 - additional path
	local additionalPathStr="$2"
	local splitAdditionalPathArray=(${additionalPathStr//\//})
	echo "$1"
	cd "$1"
	local tempPath="$1"
	for pathPart in "${splitAdditionalPathArray[@]}"; do
		tempPath="$tempPath$pathPart/"
		echo "aa $tempPath"
		if [[ ! (-d $tempPath) ]]; then
			mkdir "$pathPart"
		fi
		cd "$pathPart"
	done
}

moveNewFiles(){
	# $1 - in folder absolute path
	# $2 - backup folder absolute path
	# $3 - additional path
	local fullPath="$1$3"
	local fullPathInBackup="$1$3"
	cd "$fullPath"
	files=(*)
	for fileOrDir in "${files[@]}"; do
		if [ "$fileOrDir" = "*" ]; then
			return 0 # empty directory
		fi
		local fullPathToFileOrDir="$fullPath$fileOrDir"
		if [[ -d $fullPathToFileOrDir ]]; then
		    moveNewFiles "$1" "$2" "$3$fileOrDir/"
		elif [[ -f $fullPathToFileOrDir ]]; then
			# Make sure the path exists in backup
			#echo ensuring "$2"
			ensurePathExists "$2" "$3"
			# Run shasum command
			checksum=$(shasum -a 256 "$fullPathToFileOrDir")
			# Isolate the checksum (first 64 characters)
			checksum=${checksum:0:64}
			# Add check sum if its not present
			findCheckSumCountOrAdd $checksum
			# If count is 1 then copy to the backup
			if [ $checkSumCount = 1 ]; then
				cp "$fullPathToFileOrDir" "$fullPathInBackup"
			fi
		else
		    echo Found an invalid element "$fullPathToFileOrDir"
		    exit 1
		fi
	done
}

createNewBackupFolder(){
	local i=1
	local newBackUpFolderName="backup_$i"
	local newBackUpFolderPath="$outFolderAPath$newBackUpFolderName"
	# While this backup name is taken (folder exists in output folder)
	while [[ -d $newBackUpFolderPath ]]
	do
		# Increase i
		i=$((i + 1))
		local newBackUpFolderName="backup_$i"
		local newBackUpFolderPath="$outFolderAPath$newBackUpFolderName"
	done

	# Create new backup folder
	mkdir newBackUpFolderPath
	backupFolderNumber=$i
}

findCheckSumCountOrAdd(){
	local i=0
	for hash in "${hashes[@]}"; do
		if [ "$1" = "$hash" ]; then
			hashCounts[i]=$((hashCounts[i] + 1))
		  	checkSumCount=${hashCounts[$i]} # output global variable
			return 0 # success
		fi

		# Increment index
		i=$((i + 1))
	done
	# Not found, add it
	hashes+=("$1")
	hashCounts+=(1)
	checkSumCount=-1 # if not found
	return 0 # success
}

collectChecksumsFromDirectory(){
	# $1 - out folder
	# $2 - extra path

	# cd to full path
	#echo $1
	#echo $2
	local fullPath="$1$2"
	cd "$fullPath"
	files=(*)
	for fileOrDir in "${files[@]}"; do
		if [ "$fileOrDir" = "*" ]; then
			return 0 # empty directory
		fi
		local fullPathToFileOrDir="$fullPath$fileOrDir"
		#echo fptfod "$fullPathToFileOrDir"
		#echo argtwonexttime "$2$fileOrDir/"
		if [[ -d $fullPathToFileOrDir ]]; then
		    collectChecksumsFromDirectory "$1" "$2$fileOrDir/"
		elif [[ -f $fullPathToFileOrDir ]]; then
			# Run shasum command
			checksum=$(shasum -a 256 "$fullPathToFileOrDir")
			# Isolate the checksum (first 64 characters)
			checksum=${checksum:0:64}
			# Add check sum if its not present
			findCheckSumCountOrAdd $checksum
		else
		    echo Found an invalid element "$fullPathToFileOrDir"
		    exit 1
		fi
	done
}

# Clear the screen
clear

inFolderAPath="/Users/samueljones/Documents/GitHub/Personal-Projects/Bash File Backups/in/"
outFolderAPath="/Users/samueljones/Documents/GitHub/Personal-Projects/Bash File Backups/out/"
backupFolderNumber=-1 # placeholderr value

# Stores hashes and associated counts
hashes=()
hashCounts=() # Count's aren't really needed but I'd like to be able to review this code in the future so its nice to have

# Explore the out folder to see what files are already backed up
collectChecksumsFromDirectory "$outFolderAPath" ""

# Create new backup folder
createNewBackupFolder

# backupFolderNumber variable now has a meaningful value
backupFolderPath="$outFolderAPath""backup_""$backupFolderNumber"

# Move new files to backup directory
moveNewFiles "$inFolderAPath" "$backupFolderPath" ""
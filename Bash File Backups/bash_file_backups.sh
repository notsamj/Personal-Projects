# Functions
ensurePathExists(){
	# $1 - absolute path to back up folder
	# $2 - additional path
	local additionalPathStr="$2"
	local cleanAdditionalPathStr=$(echo "$additionalPathStr" | sed "s/ /,/g") # Replace spaces with commas
	local splitAdditionalPathArray=($(echo "$cleanAdditionalPathStr" | sed "s/\//\n/g"))
	cd "$1"
	if [ ! $? = 0 ]; then
		echo "Failed to cd to: $1"
		exit 1
	fi
	echo "Trying to ensure path exists one $1 two $2 three $splitAdditionalPathArray"
	local tempPath="$1"
	for unusablePathPart in "${splitAdditionalPathArray[@]}"; do
		pathPart=$(echo "$unusablePathPart" | sed "s/,/ /g") # Replace commas with spaces
		tempPath="$tempPath""$pathPart"/
		echo "Checking temp path $tempPath $pathPart"
		if [[ ! (-d "$tempPath") ]]; then
			mkdir "$pathPart"
			if [ ! $? = 0 ]; then
				echo "Failed to make directory: $pathPart"
				exit 1
			fi
		fi
		cd "$pathPart"
		if [ ! $? = 0 ]; then
			echo "Failed to cd to: $pathPart"
			exit 1
		fi
	done
}

moveNewFiles(){
	# $1 - in folder absolute path
	# $2 - backup folder absolute path
	# $3 - additional path
	local fullPath="$1$3"
	local fullPathInBackup="$2$3"
	cd "$fullPath"
	if [ ! $? = 0 ]; then
		echo "Failed to cd to: $fullPath"
		echo "cd returned: $success"
		exit 1
	fi
	files=(*)
	for fileOrDir in "${files[@]}"; do
		if [ "$fileOrDir" = "*" ]; then
			return 0 # empty directory
		fi
		local fullPathToFileOrDir="$fullPath""$fileOrDir"
		if [[ -d $fullPathToFileOrDir ]]; then
		    moveNewFiles "$1" "$2" "$3$fileOrDir/"
		elif [[ -f $fullPathToFileOrDir ]]; then
			# Run shasum command
			checksum=$(shasum -a 256 "$fullPathToFileOrDir")
			# Isolate the checksum (first 64 characters)
			checksum=${checksum:0:64}
			# Add check sum if its not present
			findCheckSumCountOrAdd $checksum
			# If count is 1 then copy to the backup
			if [ $checkSumCount = 1 ]; then
				# Make sure the path exists in backup
				ensurePathExists "$2" "$3"
				cp "$fullPathToFileOrDir" "$fullPathInBackup"
				if [ ! $? = 0 ]; then
					echo "Failed to copy $fullPathToFileOrDir to $fullPathInBackup"
					exit 1
				fi
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
	mkdir "$newBackUpFolderPath"
	if [ ! $? = 0 ]; then
		echo "Failed to make: $newBackUpFolderPath"
		exit 1
	fi
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
	checkSumCount=1 # Now its added so 1
	return 0 # success
}

collectChecksumsFromDirectory(){
	# $1 - out folder
	# $2 - extra path

	# cd to full path
	local fullPath="$1$2"
	cd "$fullPath"
	if [ ! $? = 0 ]; then
		echo "Failed to cd to: $fullPath"
		exit 1
	fi
	files=(*)
	for fileOrDir in "${files[@]}"; do
		if [ "$fileOrDir" = "*" ]; then
			return 0 # empty directory
		fi
		local fullPathToFileOrDir="$fullPath$fileOrDir"
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

inFolderAPath="$1" # passed in
outFolderAPath="$2" # passed in 
backupFolderNumber=-1 # placeholder value

# Stores hashes and associated counts
hashes=()
hashCounts=() # Count's aren't really needed but I'd like to be able to review this code in the future so its nice to have

# Explore the out folder to see what files are already backed up
collectChecksumsFromDirectory "$outFolderAPath" ""

# Create new backup folder
createNewBackupFolder

# backupFolderNumber variable now has a meaningful value
backupFolderAPath="$outFolderAPath""backup_""$backupFolderNumber"/

# Move new files to backup directory
moveNewFiles "$inFolderAPath" "$backupFolderAPath" ""
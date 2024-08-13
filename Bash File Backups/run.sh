# Functions
findCheckSumCountOrAdd(){
	local i=0
	for hash in "${hashes[@]}"; do
		if [ "$1" = "$hash" ]; then
			hash_counts[i]=$((hash_counts[i] + 1))
		  	checkSumCount=${hash_counts[$i]}
			return 0 # success
		fi

		# Increment index
		i=$((i + 1))
	done
	# Not found, add it
	hashes+=("$1")
	hash_counts+=(1)
	return 0 # success
}

exploreDirectory(){
	# Navigate by to the directory
	cd "$1"

	files=(*)
	for fileOrDir in "${files[@]}"; do
		if [[ -d $fileOrDir ]]; then
		    exploreDirectory $fileOrDir
		elif [[ -f $fileOrDir ]]; then
			# Run shasum command
			checksum=$(shasum -a 256 "$fileOrDir")
			# Isolate the checksum (first 64 characters)
			checksum=${checksum:0:64}
			# Add check sum if its not present
			findCheckSumCountOrAdd $checksum
		else
		    echo Found an invalid element "$fileOrDir" in directory "$1"
		    exit 1
		fi
	done
	# Navigate back from the directory
	cd ..
}

# Clear the screen
clear

# Remove the out folder
rm -rf out
mkdir out

# Get counts for all the hashes
hashes=()
hash_counts=()

# Explore the test folder
exploreDirectory test_folder


# Print all hashes
echo Printing all found hashes
for hash in "${hashes[@]}"; do
	echo $hash
done
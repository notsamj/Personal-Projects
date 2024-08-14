# Bash File Backups
##### Written by: Samuel Jones
####

## Application purpose
The purpose of Bash File Backups is to help with backing up files from one file path to another. \
The program checks for files that have already been backed up to the backup location and omits them.

## How to run the application
Code for run.sh
```
inFolderAPath="/Users/samueljones/Documents/GitHub/Personal-Projects/Bash File Backups/in/"
outFolderAPath="/Users/samueljones/Documents/GitHub/Personal-Projects/Bash File Backups/out/"
sh bash_file_backups.sh "$inFolderAPath" "$outFolderAPath"
```
When running the application call `bash_file_backups.sh` with arguments 
1. Absolute path to the input folder
2. Absolute path to the output folder

## Application Examples
The "in" and "out" folders can be looked at as an example of the program output. \
The notable subfolders in "out" are:
  1. backup_1 \
    This folder shows what the backup of "in" will look like
  2. backup_4 \
    This folder shows what a following backup of "in" looks like. \
    In this case, the "ccc.txt" file was modified so it was automatically backed up. \
    However, the other files were unchanged and therefore weren't backed up again.

## Application background
I realized that my practice of backing up files was inefficient. I had no way of determining which files were being backed up to the same location unneccessarily. I realized I could solve this by using checksums and bash.
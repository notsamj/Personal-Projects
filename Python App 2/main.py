"""
Bookmark Application
TODO: Comments
Author: Samuel Jones
"""
import re
from notsamj_log import NSJLog
from bookmark_manager import BookmarkManager
from helper_functions import *

# Global Constants
bookNameRegex = r"^[a-zA-Z0-9 ]{1,20}$"
pageNumberRegex = r"^[0-9]{1,5}$"

# Global Variables
log = NSJLog("log.ignoredata")
bookmarkManager = BookmarkManager("bmm.ignoredata")

# Function Definitions

def userRequestHelp():
    print("Commands:")
    print("bookmark - Bookmark a location in a book")
    print("help - Print a list of commands")
    print("remove - Remove a book from the list of bookmarks")
    print("view - View bookmarks")
    print("quit - Quit the program")

def userRequestBookmark():
    print("Please enter the book name:", end=" ")
    bookName = input()
    if not re.search(bookNameRegex, bookName):
        print("Invalid format, please use: \"", bookNameRegex, "\"", sep="")
        return
    
    print("Please enter the page number:", end=" ")
    pageNumberStr = input()
    if not re.search(pageNumberRegex, pageNumberStr):
        print("Invalid format, please use: \"", pageNumberRegex, "\"", sep="")
        return
    pageNumber = int(pageNumberStr)

    bookmarkManager.addBookmark(bookName, pageNumber)
    message = "Bookedmarked page " + pageNumberStr + " in " + bookName + "."
    print(message)
    log.addLine(message)

def userRequestRemove():
    print("Please enter the book name:", end=" ")
    bookName = input()
    if not re.search(bookNameRegex, bookName):
        print("Invalid format, please use: \"", bookNameRegex, "\"", sep="")
        return

    if not bookmarkManager.hasBook(bookName):
        print("Book not found.")
        return

    bookmarkManager.remove(bookName)
    message = bookName + " removed from Bookmarks."
    print(message)
    log.addLine(message)

def userRequestView():
    print("Bookmarks (", bookmarkManager.getLength(), "):", sep="")
    sortedBookNames = bookmarkManager.getBookNames()
    sortedBookNames.sort(key=lambda bookName: bookmarkManager.get(bookName))
    maxLength = len(maxInList(sortedBookNames, lambda bookName: len(bookName)))
    for bookName in sortedBookNames:
        fixedLengthBookName = forceStringSize(bookName, maxLength, " ")
        print(f"{fixedLengthBookName} -> {bookmarkManager.get(bookName)}")

def handleUserInput(requestText):
    if requestText == "help":
        userRequestHelp()
        return
    elif requestText == "bookmark":
        userRequestBookmark()
        return
    elif requestText == "view":
        userRequestView()
        return
    elif requestText == "remove":
        userRequestRemove()
        return
    print("Unknown command: \"", requestText, "\"!", sep="")


def runLoop():
    print("Welcome to Samuel's Bookmark App")
    quit = False
    while not quit:
        print("Please enter your request:", end=" ")
        request = input().lower()
        quit = request == "quit"
        if not quit:
            handleUserInput(request)
    print("Goodbye!")
runLoop()
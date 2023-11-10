from notsamj_error import NSJError
import re

# NOTE: I convert .keys() to list a lot. I'm just too lazy to figure out if its necessary, probably not in most cases

# Global Consants
lineFormat = r"^([a-zA-Z0-9 ]{1,20}),([0-9]{1,5})$"

class BookmarkManager:
    def __init__(self, fileName):
        self._fileName = fileName
        self._bookmarks = {}
        self.readFromFile()

    def readFromFile(self):
        try:
            file = open(self._fileName, "r")
        except:
            raise NSJError("Unable to open: " + self._fileName + "!")
            return

        # Loop through all the lines of the file and read in
        for line in file:
            if len(line.strip()) == 0:
                continue
            search = re.search(lineFormat, line)
            if search:
                bookName = search.group(1)
                pageNumber = int(search.group(2))
                self.addBookmark(bookName, pageNumber, save=False)
            else:
                raise NSJError("Line in invalid format (", lineFormat, "): \"", line, "\"", sep="")
                file.close()
                return
        file.close()

    def saveToFile(self):
        try:
            file = open(self._fileName, "w")
        except:
            raise NSJError("Unable to open: " + self._fileName + "!")
            return

        for bookName in list(self._bookmarks.keys()):
            file.write(bookName + "," + str(self._bookmarks[bookName]) + "\n")
        file.close()

    def addBookmark(self, bookName, pageNumber, save=True):
        self._bookmarks[bookName] = pageNumber
        if save:
            self.saveToFile()

    def getBookNames(self):
        return list(self._bookmarks.keys())

    def hasBook(self, bookName):
        return bookName in list(self._bookmarks.keys())

    def remove(self, bookName):
        self._bookmarks.pop(bookName)
        self.saveToFile()

    # Assumes bookName exists
    def get(self, bookName):
        return self._bookmarks[bookName]

    def getLength(self):
        return len(list(self._bookmarks.keys()))

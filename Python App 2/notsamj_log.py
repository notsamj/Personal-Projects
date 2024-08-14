import time
import math
from notsamj_error import NSJError
class NSJLog:
    def __init__(self, fileName):
        self._fileName = fileName
        self._lines = self.readFromFile()

    def readFromFile(self):
        lines = []
        try:
            file = open(self._fileName, "r")
        except:
            raise NSJError("Unable to open: " + self._fileName + "!")
            return

        for line in file:
            if len(line.strip()) == 0:
                continue
            lines.append(line)
        
        file.close()
        return lines

    def saveToFile(self):
        try:
            file = open(self._fileName, "w")
        except:
            raise NSJError("Unable to open: " + self._fileName + "!")
            return

        for line in self._lines:
            file.write(line + "\n")
        file.close()

    def addLine(self, line):
        self._lines.append(line + " @" + str(math.floor(time.time() * 1000)))
        self.saveToFile()

import re
from helper_functions import *
from notsamj_error import NSJError

class NSJConfig:
    def __init__(self, fileName=""):
        self._data = {}
        self._fileName = fileName
        if not fileName == "":
            self.loadFile(fileName)

    def loadFile(self, fileName):
        def readVariable(variableString):
            lineSplit = variableString.split("=")  
            return {'key': lineSplit[0], 'value': lineSplit[1]}

        def readList(listString):
            keyRestSplit = listString.split("=")
            key = keyRestSplit[0]
            items = keyRestSplit[1][1:len(keyRestSplit[1])-1]
            splitItems = items.split(",")
            return {'key': key, 'value': splitItems}

        def dealWithDataTypes(element, dtype):
            def booleanConvert(booleanValue):
                if booleanValue == "False":
                    return False
                return True
            func = None
            if dtype == 'int':
                func = int
            elif dtype == 'bool':
                func = booleanConvert
            if func == None:
                return element
            if isinstance(element, list):
                return list(map(func, element))
            return func(element)

        self._fileName = fileName
        try:
            f = open(self._fileName, "r")
        except:
            raise NSJError("Unable to open: " + self._fileName + "!")
            return
        properFullLineFormat = re.compile("^.*%[a-z]+$")
        variableFormat = re.compile("^.+=(?!\[).+$")
        listformat = re.compile("^.+=\[.+(,.+)*\]$")
        for fullLine in f:
            fullLine = fullLine.rstrip() # remove \n
            if not properFullLineFormat.match(fullLine):
                raise NSJError("Unable to read line: " + fullLine + " (Improper Line format)")
                return
            fullLine_split = fullLine.split("%")
            line = fullLine_split[0]
            dataType = fullLine_split[1]
            if not variableFormat.match(line) and not listformat.match(line):
                raise NSJError("Unable to read line: " + line + " (Improper Variable and List format)")
                return
            if variableFormat.match(line):
                keyValue = readVariable(line)
            else:
                keyValue = readList(line)
            typedData = dealWithDataTypes(keyValue['value'], dataType)
            self._data[keyValue['key']] = {'data': typedData, 'type': dataType}
        f.close()
    def __str__(self):
        returnString = "key[type]:value\n"
        for key in self._data.keys():
            returnString += key + "[" + self._data[key]['type'] + "]:" + str(self._data[key]['data']) + "\n"
        return returnString[:-1]
    def print(self):
        print(self.__str__())

    def has(self, key):
        return listHasElement(list(self._data.keys()), key)

    def get(self, key):
        if not self.has(key):
            return None
        return self._data[key]['data']

    def getType(self, key):
        if not self.has(key):
            return None
        return self._data[key]['type']

    def set(self, key, data, dtype):
        self._data[key] = {'data': data, 'type': dtype}

    def saveToFile(self):
        def dealWithDataTypes(e, dtype):
            def booleanConvert(s):
                if s == False:
                    return "False"
                return "True"
            func = None
            if dtype == 'int':
                func = str
            elif dtype == 'bool':
                func = booleanConvert
            if func == None:
                return e
            if isinstance(e, list):
                return list(map(func, e))
            return func(e)
        try:
            f = open(self._fileName, "w")
        except:
            raise NSJError("Unable to open: " + self._fileName + "(saving)!")
            return
        # maybe should print as one string with \n's because invalid data fucks up file and you lose data!
        for key in self._data.keys():
            currentLine = key + "="
            if isinstance(self._data[key]['data'], list):
                currentLine += "["
                stringList = dealWithDataTypes(self._data[key]['data'], self._data[key]['type'])
                for item in stringList:
                    currentLine += item + ","
                currentLine = currentLine[:-1]
                currentLine += "]"
            else:
                currentLine += dealWithDataTypes(self._data[key]['data'], self._data[key]['type'])
            currentLine += "%" + self._data[key]['type'] + "\n"
            f.write(currentLine)
        f.close()
class NSJConfig:
    def __init__(self, fileName=""):
        self._data = {}
        self._fileName = fileName
        if not fileName == "":
            self.load_file(fileName)

    def load_file(self, fileName):
        def read_variable(v):
            linesplit = v.split("=")
            return {'key': linesplit[0], 'value': linesplit[1]}

        def readList(l):
            key_rest_split = l.split("=")
            key = key_rest_split[0]
            items = key_rest_split[1][1:len(key_rest_split[1])-1]
            splititems = items.split(",")
            return {'key': key, 'value': splititems}

        def dealWithDataTypes(e, dtype):
            def boolean_convert(s):
                if s == "False":
                    return False
                return True
            func = None
            if dtype == 'int':
                func = int
            elif dtype == 'bool':
                func = boolean_convert
            if func == None:
                return e
            if isinstance(e, list):
                return list(map(func, e))
            return func(e)

        self._fileName = fileName
        try:
            f = open(self._fileName, "r")
        except:
            raise notSamError("Unable to open: " + self._fileName + "!")
            return
        proper_full_line_format = re.compile("^.*%[a-z]+$")
        variableformat = re.compile("^.+=(?!\[).+$")
        listformat = re.compile("^.+=\[.+(,.+)*\]$")
        for full_line in f:
            full_line = full_line.rstrip() # remove \n
            if not proper_full_line_format.match(full_line):
                raise notSamError("Unable to read line: " + full_line + " (Improper Line format)")
                return
            full_line_split = full_line.split("%")
            line = full_line_split[0]
            datatype = full_line_split[1]
            if not variableformat.match(line) and not listformat.match(line):
                raise notSamError("Unable to read line: " + line + " (Improper Variable and List format)")
                return
            if variableformat.match(line):
                key_value = read_variable(line)
            else:
                key_value = readList(line)
            typed_data = dealWithDataTypes(key_value['value'], datatype)
            self._data[key_value['key']] = {'data': typed_data, 'type': datatype}
        f.close()
    def __str__(self):
        return_string = "key[type]:value\n"
        for key in self._data.keys():
            return_string += key + "[" + self._data[key]['type'] + "]:" + str(self._data[key]['data']) + "\n"
        return return_string[:-1] # -1 ???
    def print(self):
        print(self.__str__())

    def has(self, key):
        return in_list(list(self._data.keys()), key)

    def get(self, key):
        if not self.has(key):
            return None
        return self._data[key]['data']

    def get_type(self, key):
        if not self.has(key):
            return None
        return self._data[key]['type']

    def set(self, key, data, dtype):
        self._data[key] = {'data': data, 'type': dtype}

    def save_to_file(self):
        def dealWithDataTypes(e, dtype):
            def boolean_convert(s):
                if s == False:
                    return "False"
                return "True"
            func = None
            if dtype == 'int':
                func = str
            elif dtype == 'bool':
                func = boolean_convert
            if func == None:
                return e
            if isinstance(e, list):
                return list(map(func, e))
            return func(e)
        try:
            f = open(self._fileName, "w")
        except:
            raise notSamError("Unable to open: " + self._fileName + "(saving)!")
            return
        # maybe should print as one string with \n's because invalid data fucks up file and you lose data!
        for key in self._data.keys():
            currentline = key + "="
            if isinstance(self._data[key]['data'], list):
                currentline += "["
                stringlist = dealWithDataTypes(self._data[key]['data'], self._data[key]['type'])
                for item in stringlist:
                    currentline += item + ","
                currentline = currentline[:-1]
                currentline += "]"
            else:
                currentline += dealWithDataTypes(self._data[key]['data'], self._data[key]['type'])
            currentline += "%" + self._data[key]['type'] + "\n"
            f.write(currentline)
        f.close()
class NSJError(Exception):
    pass
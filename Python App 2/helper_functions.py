def maxInList(providedList, func):
    maxItem = None
    maxValue = None
    for item in providedList:
        value = func(item)
        if maxItem == None or value > maxValue:
            maxItem = item
            maxValue = value
    return maxItem

def forceStringSize(strToModify, size, characterToFill):
    modifiedStr = strToModify[:size] # In case over size
    while len(modifiedStr) < size:
        modifiedStr += " "
    return modifiedStr
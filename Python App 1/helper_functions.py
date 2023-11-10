# General function
def listHasElement(listToSearch, element):
    for i in range(len(listToSearch)):
        if listToSearch[i] == element:
            return True
    return False
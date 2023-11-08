from notsamj_config import NSJConfig

"""
Expected Data (from an old project that I made this Config class for)

additional_colors=[dark_red,dark_green]%str
dark_red_color=[150,74,70]%int
testinput=True%bool
charactermatchpercent=100%int
characters=abcddefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!-()':,%str
"""

# Test NSJConfig Class
myConfig = NSJConfig("data.txt")

try:
    fakeConfig = NSJConfig("data_not_found.txt")
except:
    print("Error occured as expected.")

value = myConfig.get("additional_colors")
print("Expected Type:", myConfig.getType("additional_colors"))
print("Actual Type:", value, type(value))

value = myConfig.get("dark_red_color")
print("Expected Type:", myConfig.getType("dark_red_color"))
print("Actual Type:", value, type(value))

value = myConfig.get("testinput")
print("Expected Type:", myConfig.getType("testinput"))
print("Actual Type:", value, type(value))

value = myConfig.get("charactermatchpercent")
print("Expected Type:", myConfig.getType("charactermatchpercent"))
print("Actual Type:", value, type(value))

value = myConfig.get("characters")
print("Expected Type:", myConfig.getType("characters"))
print("Actual Type:", value, type(value))
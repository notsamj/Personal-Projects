# C Sharp App 1
####food_expiry.cs
####Tested with Compiler: Mono C# compiler
#####Written by: Samuel Jones
####

## Application Purpose
C Sharp App 1 provides the function as a list of food items one has that have an expirey date.
The application functions as a command line application, it can be compiled and run as an exe.
The application may be useful to a user that is keen on consuming all their food prior to its expiry date. 

## Appication User Guide
An example of application useage can be seen in `runtime_example.txt`\
\
The application supports 6 commands:
- **load**
  - Loads a list from a file
  - *if fed a blank file -> treats it as a new list*
  - **Required for some other commands to function**
- **add**
  - Adds an new food item to the expiry list
  - **Requires a list to be loaded**
- **remove**
  - Removes an item from the expiry list
  - **Requires a list to be loaded**
- **status**
  - Displays the expiry list
- **quit**
  - Exits the application
- **help**
  - Displays the help menu

## Application Shortcomings
The application has various shortcomings. Listed below are a few.
- It is a command line application
  - it's not incredibly user-friendly party due to this. 
- The removal feature is also not great
  - Rather than having an option to modify item quantities, the program forces you to remove and re-add items to modify the quantities. 
- Status feature could be improved
  - It may be strange when something expiring tomorrow says it expires in 0 days, however I figured it's close enough.

I prefer to aknowledge shortcomings of an application rather than leave them unmentioned. There are many reasons for this, I won't elaborate here.

###Author Background in C Sharp
I have no background in C Sharp. Shortly after finishing my Computer Science Bachelor's Degree requirements I was looking
at what experience various employers expect from candidates and saw C# knowledge mentioned a few times. I decided to make
a small program in this language for that reason. I don't feel that I've learned much from this short experience in working
with C#, it was enough like Java that it was very comfortable for me to use. I may need to make a much more complex program
to gain an appreciation for the unique aspects of C#.
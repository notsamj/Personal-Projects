# Lisp App 1
#### toh.lisp
#### Tested with Compiler: clisp
##### Written by: Samuel Jones
####

## Application Purpose
Lisp App 1 is an application that finds paths to follow when solving the towers of
hanoi problem. The application has two main execution paths that are run on
start.
### Global Variables
The variables that may be changed by the user are:
- `numRings`
  - This variable is used to change the number of rings involved in the problem.
  It must be noted that numRings >= 4 has caused BFS and Heuristic methods to encounter stack overflow in my testing.
- `maxPaths`
  - The number of paths that the application will attempt to find with each state traversal method
  before ending
- `part3Enabled`
  - This is used to enable or disable part 3 in the heuristic to compute the value of a state
  - Part 3 involves comparing the number of steps in the path (so far) and the expected
  minimum length of a path to solve the problem. If the number of steps is high, it is devalued.
  The user may want to disable part 3 because it makes the application run slowly and tends not to produce great results.
  It is hypothesized by the application author that with a sufficiently large `maxPaths` value, part 3 would be
  useful, however, that has not been experimentally confirmed so it is *disabled* by default. Also, a sufficently large
  `maxPaths` value would likely cause a stack overflow error prior to reaping the benefits, so the application would need to
  be rewritten to be immune to that error.

### Execution Path 1 (Comparison)
This path involves comparing the Depth First Search (DFS), Breadth First Search (BFS) and 
Heuristic state traversal methods included in the application. It does this recording the number of
recursive calls (called 'visits') involved in finding `maxPaths` paths, and the average path length.
Examples of this compairson can be found in
- `result_after_path3_heuristic_n20.txt` lines [1-21]
- `result_before_path3_heuristic_n20.txt` lines [1-21]
- `result_before_path3_heuristic_n50.txt` lines [1-21]
- `result_after_path3_heuristic_n50.txt` lines [1-21]
- `n30_output.txt` lines [1-21]

### Execution Path 2 (Shortest Path)
This path involves running all three aforementioned methods and finding the shortest path from all of these.
The shortest path is then described in a series of steps and printed. An example of this is can be found in
`n30_output.txt` lines [22-29]. The _ring number_ mentioned in the steps represents the size of the ring with **0** being
the smallest ring and higher numbers being the larger rings. For 'tower numbers', **1** corresponds to the leftmost tower /
starting location and **3** corresponds to the right most tower / goal location.

### Author Background in Lisp
As explained in detail in the header comments in `toh.lisp` I  have little experience programming in Lisp. My most recent
Computer Science course prior to completing my bachelor's degree involved programming in Lisp so when I was
looking for programs to make to illustrate my knowledge of the field I felt comfortable making a state traversal program
in Lisp.

### Regarding the comments
I used many comments in this program. I decided to use this program as a way to illustrate how many and how detailed
I am willing to make comments if required. I do not use this many comments for programs that are not public.
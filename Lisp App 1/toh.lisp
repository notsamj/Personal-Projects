; Comments about the program:
;	About my proficiency in lisp:
;		I do not claim to be very proficient in lisp. I took one course that used
;		Lisp recently and with it being a tricky language, I decided it would be good
;		to make a small program to showcase my knowledge. I'm aware that my use
;		of 'cond' is probably improper, I neglected to learn how to use other if/else
;		branching in this language.
;	General comments about the program:
;		I put a recognition of assumptions section for some functions where I though it was necessary.
;		I neglected assumptions for other functions.
;		I probably overused 'progn'
;		I probably over/mis-used 'cond'
;		I never used the 'break' construct. I don't know if it exists in LISP.
; 	Author: Samuel Jones
; 	Compiler Used: clisp

; Function Definitions

; Function Name: swapElements
; Function Parameters:
; 	listBeingSorted:
;		list including elements that need to be swapped
;	index1:
;		first index to swap with second index
;	index2:
;		second index to swap with first index
; Function Description:
;	Creates a new list with two elements swapped
; Function Return:
;	A new list wtth two elements swapped
(defun swapElements (listBeingSorted index1 index2)
(let ( (element1 ()) (element2 ()) )
(progn
	(setq element1 (nth index1 listBeingSorted))
	(setq element2 (nth index2 listBeingSorted))
	(setq listBeingSorted (modifyListAt listBeingSorted index2 element1))
	; Return after second swap
	(modifyListAt listBeingSorted index1 element2)
)))

; Function Name: valueState
; Function Parameters:
; 	state:
;		A representation of a state in howers of hanoi
; Function Description:
;	Creates a value representing how desirable a state is.
;	There are two ways it does this:
;		1. It increases score for rings on the final tower 
; 		   IF they are stacked properly with LARGEST -> 2ndLargest ... adding more points
;		2. Whichever ring NEXT needs to be moved to the final tower
;		   remove points for having rings above it
; Function Return:
;	An integer representing a state's value
(defun valueState (state)
(let ( (score 0) (nextToMoveIndex (- (length state) 1)) (eIndex 0))
(progn
	; Loop from biggest ring index to smallest ring
	(loop for index from 0 to (- (length state) 1)
		do(progn
			; Effective index (length(state) - 1) -> 0 (length(state) - 2) -> 1 ... 0 -> (length(state) - 1)
			(setq eIndex (- (- (length state) 1) index))
			(cond
				; If nextToMoveIndex == index AND the ring is on the final tower
				; THEN decrease nextToMoveIndex
				(
					(and (= nextToMoveIndex index) (= (nth nextToMoveIndex state) numTowers))
					(progn
						(setq nextToMoveIndex (- 1 nextToMoveIndex))
						(setq score (+ score (* 10 (length state))))
					)
				)
			)

			; Check if we can add more points using # 2
			(cond
				(
					(> nextToMoveIndex (- 0 1))
					(loop for index from 0 to (- (length state) 1)
						do(cond
							; if index != nextToMoveIndex AND state[index] ==
							; state[nextToMoveIndex] (same tower) then subtract score
							(
								(and (not (= nextToMoveIndex index)) (= (nth nextToMoveIndex state) (nth index state)))
								(setq score (- score (length state)))
							)
						)
					)
				)
			)
		)
	)
	; return
	score
)))


; Function Name: sortToVisit
; Function Parameters:
;   toVisitList:
;       A list of states and their prior states
; Function Description:
;   	Sorts the toVisit list using BubbleSort.
;		NOTE: Using a n^2 complexity algorithm when one is reconstructing
;		the n element list 2x for every swap is inefficient. I'm aware of this,
;		if I knew more about LISP I'd probably do this differently.
; Function Return:
;  		A sorted version of the toVisitList
(defun sortToVisit (toVisitList)
(let ( (sorted nil) (e1Value 0) (e2Value 0))
(progn
	; Loop while !sorted
	(loop
		; Sorted until found not to be sorted
		(setq sorted t)
		(loop for i from 0 to (- (length toVisitList) 2)
			do(progn
				; Extract heuristic values for the states
				(setq e1Value (valueState (nth 0 (nth i toVisitList))))
				(setq e2Value (valueState (nth 0 (nth (+ i 1) toVisitList))))
				;(print "e1Value")
				;(print e1Value)
				;(print "e2Value")
				;(print e2Value)
				(cond
					; If e1Value < e2Value then swap them
					(
						(< e1Value e2Value)
						(progn
							(setq sorted nil)
							(setq toVisitList (swapElements toVisitList i (+ i 1)))
						)
					)
				)
			)
		)
		(when sorted (return 0)) ; TODO: This doesn't return from the function, right?
	)
	; Return
	toVisitList
)))

; Function Name: generateGoalLocations
; Function Parameters:
;   numLocations:
;       The number of locations that must be initialized
; Function Description:
;   	Generates a list of {numLocations} elements that are all initialized to 13
; Function Return:
;   	A list of {numLocations} all equal to 3
(defun generateGoalLocations (numLocations)
(let ( (startingLocations ()) )
(progn
    (loop for i from 1 to numLocations
        do (setq startingLocations (append startingLocations (list 3)))
    )
    ; Return
    startingLocations
)))

; Function Name: generateStartingLocations
; Function Parameters:
;   numLocations:
;       The number of locations that must be initialized
; Function Description:
;   Generates a list of {numLocations} elements that are all initialized to 1
; Function Return:
;   A list of {numLocations} all equal to 1
(defun generateStartingLocations (numLocations)
(let ( (startingLocations ()) )
(progn
    (loop for i from 1 to numLocations
        do (setq startingLocations (append startingLocations (list 1)))
    )
    ; Return
    startingLocations
)))

; Function Name: inStateList
; Function Parameters:
;   stateList:
;       A list of states
;   state:
;       A list of ring positions
; Function Description:
;   Checks if there the given state is in a list of states
; Function Return:
;   't' if state in state list, 'nil' if not in list
(defun inStateList (stateList state)
(let ( (returnValue nil) ) ; Default to false
(progn
    (loop for stateToCompare in stateList
        do (cond
            ; (if) -> (then) {1} - If state is found at current position
            ; then set to return true
            (
                ; Check if equal
                (stateEquals state stateToCompare)
                ; Found
                (setq returnValue t)
            )
        )
    )
    ; Return
    returnValue
)))

; Function Name: removeVisitedStates
; Function Parameters:
;   stateList:
;       A list of states possibly including visited states
;   visitedStates:
;       A list of states that have been visited
; Function Description:
;   Removes visited states from a list of states
; Function Return:
;   A list of unvisited states
(defun removeVisitedStates (stateList visitedStates)
(let ( (newStateList ()) )
(progn
    (loop for state in stateList
        do(cond
            ; (if) -> (then) {1} - If state isn't visited then add to newStateList
            (
                ; if not visited
                (not (inStateList visitedStates state))
                ; append to new state list
                (setq newStateList (append newStateList (list state)))
            )
        )
    )
    ; Return 
    newStateList
)))

; Function Name: modifyListAtR
; Function Parameters:
;   currentList:
;       List to modify
;   newList:
;       New list being constructed
;   index:
;       Index to change element at
;   newElement:
;       New element to put @ index
;   currentIndex:
;       Index that is currently being visited in the construction of the new list
; Function Description:
;   Modifies a list by changing an element @ an index to another value
; Function Return:
;   A modified version of the list
(defun modifyListAtR (currentList newList index newElement currentPosition)
(progn
    ; Add current element to new list
    (cond
        ; (if) -> (then) {1} - If function is at the position then add new element
        (
            (= currentPosition index)
            (setq newList (append newList (list newElement)))
        )
        ; (if) -> (then) {2} - If function is NOT at the position then add current element
        (
            ; Else
            t
            (setq newList (append newList (list (nth currentPosition currentList))))
        )
    )

    ; Either return or recursive call
    (cond
        ; (if) -> (then) {1} - If the last element has been reached then return
        (
            ; If @ pos n-1
            (= (- (length currentList) 1) currentPosition)
            ; Return
            newList
        )
        ; (if) -> (then) {2} - If we are 
        (
            ; Else
            t
            ; Recurse
            (modifyListAtR currentList newList index newElement (+ currentPosition 1))
        )
    )
))
; Function Name: modifyListAt
; Function Parameters:
;   currentList:
;       List to modify
;	index:
;		Index to change element at
;   newElement:
;       New element to put @ index
; Function Description:
;   Modifies a list by changing an element @ an index to another value
; Function Return:
;   A modified version of the list
(defun modifyListAt (currentList index newElement)
    (modifyListAtR currentList () index newElement 0)
)

; Function Name: makeNewState
; Function Parameters:
; 	currentState:
; 		Current state of ring locations
; 	movingRingNumber:
;		Index of the ring that is being moved
;	towerToMoveToNumber:
;   	Tower number where the ring will be moved
; Function Description:
;	Creates a new state adjacent to currentState with the given move applied
; Function Return:
; 	A new state adjascent to currentState
(defun makeNewState (currentState movingRingNumber towerToMoveToNumber)
    (modifyListAt currentState movingRingNumber towerToMoveToNumber)
)

; Function Name: getAvailableTowers
; Function Parameters:
; 	currentState:
; 		Current state of ring locations
;	movingRingNumber:
;		Index of the ring that is being moved
; Function Description:
;	Finds a list of towers that a ring can move to
; Function Return:
; 	A list of numbers representing towers where the ring can be moved
(defun getAvailableTowers (currentState movingRingNumber)
(let ( (options ()) )
(progn
	(loop for towerNumber from 1 to numTowers
		do
		(cond
			; (if) -> (then) {1} - If the ring can be placed on this tower
			(
				; if ring size < 'topRing' AND ring @ index == towerNumber
				(< movingRingNumber (getTopRing currentState towerNumber))
				; then
				(setq options (append options (list towerNumber))) ; ringIndex is the size of the current ring
			)
		)
	)
	; Return
	options
)))

; Function Name: getTopRing
; Function Parameters:
; 	currentState:
;		Current state of ring locations
;	towerNumber:
;		Tower to move the top ring from
; Function Description:
;	Finds the ring at the top of the tower
; Function Assumption(s):
; 	Assumes there is a ring in the given tower
; Function Return:
;	Size of ring at the top of the tower

(defun getTopRing (currentState towerNumber)
(let ( (topRing numRings) ) ; Init to {numRings} because it is known the final result 
; will be < numRings if there is a ring. Otherwise numRings can be used to indicate
; that there are no rings present.
(progn
	(loop for ringIndex from 0 to (- numRings 1)
		do
		(cond
			; (if) -> (then) {1} - If ring @ index is on the given tower
			(
				; if ring size < 'topRing' AND ring @ index == towerNumber
				(and (< ringIndex topRing) (= towerNumber (nth ringIndex currentState)))
				; then
				(setq topRing ringIndex) ; ringIndex is the size of the current ring
			)
		)
	)
	; Return
	topRing
)))

; Function Name: hasRing
; Function Parameters:
; 	currentState:
;		Current state of ring locations
;	towerNumber:
;		Tower to move the top ring from
; Function Description:
;	Determines if there is a ring in the given tower
; Notes:
; 	I don't know how to break a loop & heard that return statements are bad in
;   lisp so this function may continue to iterate after it has reached the final answer
; Function Return:
;	't' if there is a ring on the tower, 'nil' if not
(defun hasRing (currentState towerNumber)
(let ( (returnValue nil) )
(progn
	(loop for ringIndex from 0 to (- numRings 1)
		do
		(cond
			; (if) -> (then) {1} - If ring @ index is on the given tower
			(
				; if ring @ index == towerNumber
				(= towerNumber (nth ringIndex currentState))
				; then
				(setq returnValue t)
			)
		)
	)
	; Return
	returnValue
)))

; Function Name: generateNewStates
; Function Parameters:
;	currentState:
;		A representation of the current state from which to generate 'adjacent'* states.
;		* An 'adjacent' state is a state that is 1 move away from another state
; Function Description:
;	Generate a list of states adjacent from the current state
; Noteworthy Assumptions:
; 	There are of course assumptions that are relevant to this function. However, I do not
;   think this function appears to be a general use function like 'stateEquals' to be misused.
;	Therefore, I have decided to neglect adding noteworthy assumptions for this function
;   and others that are similar.
; Function Return:
;	A list of new states adjacent to the currnet state.
(defun generateNewStates (currentState)
(let ( (newStates ()) (movingRingNumber -1) )
(progn
	(loop for towerNumber from 1 to numTowers
		do
		(progn
			(cond
				; (if) -> (then) {1} - If can move a ring from the top of this tower
				(
					; If there is at least 1 ring on the tower
					(hasRing currentState towerNumber)
					; Then find where it can be moved to and create (a) new state(s)
					(progn
						; Set the number of the ring that's being moved
						(setq movingRingNumber (getTopRing currentState towerNumber))
						; Get a list of numbers of towers that the ring can be moved to 
						; won't include current tower fortunately (because of rules) so don't need to
						; be weeded out of the list
						(setq towersRingCanMoveTo (getAvailableTowers currentState movingRingNumber))
						; For each tower that the ring can be moved to -> create a new state representing the move
						(loop for towerToMoveToNumber in towersRingCanMoveTo
							do
							(setq newStates (append newStates (list (makeNewState currentState movingRingNumber towerToMoveToNumber))))
						)
					)
				)
			)
		)
	)
	; Return the new states that have been created
	newStates
)))

; Function Name: stateEqualsR
; Function Parameters:
;	state1/state2:
;		One of two states to compare
;	currentIndex:
;		The current index in the states to compare
; Function Description:
; 	Compares the equality of two given states from the current position to the end.
; Noteworthy Assumptions:
;	It is assumed both states are lists of integers.
; 	It is assumed that both states are of equal length.
;	It is assumed that both states have an element at the given position.
; Function Return:
;	't' if the states are equal, 'nil' if not (if at the end)
;   if not at the end, a recursive call to stateEqualsR
(defun stateEqualsR (state1 state2 currentIndex)
	(cond
		; (if) -> (then) {1} - Check if not equal
		(
			; If state1[currentIndex] != state2[currentIndex]
			(not (= (nth currentIndex state1) (nth currentIndex state2)))
			; Return false
			nil
		)
		; (if) -> (then) {2} - Else
		(
			; Else
			t
			(cond
				; (if) -> (then) {1.1} - If at the position of their last element
				(
					; If length = currentIndex + 1
					(= (length state1) (+ 1 currentIndex))
					; Return True
					t
				)
				; (if) -> (then) {1.2} - Else (not at last position)
				(
					; Else
					t
					; Return recursive call
					(stateEqualsR state1 state2 (+ 1 currentIndex))
				)
			)
		)
	)
	; No need for a return here because of "else" statements above the 
	; return has already happened
)

; Function Name: stateEquals
; Function Parameters:
; 	state1/state2:
;		One of two states to compare
; Function Description:
;	Compares the equality of two given states.
; Noteworthy Assumptions:
;	It is assumed both states are lists of integers.
; 	It is assumed that both states are of equal length.
;	It is assumed that both states have at least 1 element*.
;	* For the program they should have 3 elements but for the scope of this function
;	irrespective of the specifications of the program they only need 1 element.
; Function Return:
;	't' if the states are equal, 'nil' otherwise.
(defun stateEquals (state1 state2)
	(stateEqualsR state1 state2 0)
)

; Function Name: visitDFS
; Function Parameters:
;	currentState:
;		A parameter for the function, a list in the form ([1-3] [1-3] [1-3]) where
;		each element @ index i represents a number between 1 & 3 (inclusive) which
;		specifies a tower at which the ring (@ index i in indexToRingIdentifier) is 
;		located
;   pathToCurrentLocation:
;		A list of states from the starting state to the current state
; Function Description:
; 	This function is the main function for the running the program.
;	This function traverses states using a depth-first manner to reach the goal. 
; Function Return:
; 	A sequence of states from the start to the goal state. The sequence is generated
;	by legal moves.
(defun visitDFS(currentState pathToCurrentLocation)
(let ((newStates ()) (returnValue nil) (pathsFound ()))
(progn ; I'm not sure 'progn' is necessary here. I'm leaving it because the program works.
    (setq visitCounter (+ visitCounter 1))
    (cond
		; (if) -> (then) {1} - If the goal state has been reached then return
		(
			; if
			(stateEquals currentState goalState)
			; then
			(cond
				; (if) -> (then) {1.1} - If we haven't yet reached max paths then look for more
				(
					(< pathsSoFar maxPaths)
					(progn ; Return new path (OTHERWISE will return empty path so won't add 1)
						(setq pathsSoFar (+ 1 pathsSoFar))
						(setq returnValue (list pathToCurrentLocation))
					)
				)
			)
		)

		; (if) -> (then) {2} - ; If the goal state is not yet reached
		(
			; Else
			t ; True (equivalent to an else)
			; then
			(progn
				(setq newStates (generateNewStates currentState))
                (setq newStates (removeVisitedStates newStates pathToCurrentLocation))
                (loop for newState in newStates
                    do
                        ; Visit new state and add all paths to pathsFound
                        (cond
                        	; (if) -> (then) {1} - If maxPaths is -1 or not reached then recurse
                        	(
                        		(< pathsSoFar maxPaths)
                        		(progn
                        			(setq pathsFound (append pathsFound (visitDFS newState (append pathToCurrentLocation (list newState)))))
                        		)
                        	)
                        	; Otherwise don't recuse because have enough
                        )
                )
                ; Set the value so it can be returned
                (setq returnValue pathsFound)
			)
		)
	)
	; Return whatever the return value is set to be
    returnValue
)))

; Function Name: visitBFS
; Function Parameters:
;	currentState:
;		A parameter for the function, a list in the form ([1-3] [1-3] [1-3]) where
;		each element @ index i represents a number between 1 & 3 (inclusive) which
;		specifies a tower at which the ring (@ index i in indexToRingIdentifier) is 
;		located
;   pathToCurrentLocation:
;		A list of states from the starting state to the current state
;   toVisit:
;		A list of states to visit and the paths to those states
;	paths:
;		A list of paths from the start to the goal state
; Function Description:
; 	This function is the main function for the running the program.
;	This function traverses states using a breadth-first manner to reach the goal. 
; Function Return:
; 	A sequence of states from the start to the goal state. The sequence is generated
;	by legal moves.
(defun visitBFS(currentState pathToCurrentLocation toVisit paths)
(let ((newStates ()))
(progn 
	(setq visitCounter (+ visitCounter 1))
	(cond
		; (if) -> (then) {1} - If the goal state has been reached then return
		(
			; if
			(stateEquals currentState goalState)
			; then
			(progn
				(setq paths (append paths (list pathToCurrentLocation)))
				(setq pathsSoFar (+ 1 pathsSoFar))
			)
		)

		; (if) -> (then) {2} - ; If the goal state is not yet reached
		(
			; Else
			t ; True (equivalent to an else)
			; then
			(progn
				; Generate & filter new states
				(setq newStates (generateNewStates currentState))
                (setq newStates (removeVisitedStates newStates pathToCurrentLocation))
				
				; Add new states to toVisit
				(loop for newState in newStates
                    do
					(setq toVisit (append toVisit (list (list newState (append pathToCurrentLocation (list newState))))))
                )
			)
		)
	)
	; At this point decide to either recurse or end
	(cond
		; (if) -> (then) {1} - Have more left to visit so visit another
		(
			(and (> (length toVisit) 0) (< pathsSoFar maxPaths))
			(visitBFS (nth 0 (car toVisit)) (nth 1 (car toVisit)) (cdr toVisit) paths)
		)
		; (if) -> (then) {2} - Else all have been visited OR enough paths have been found
		(
			t
			; Return paths collected
			paths
		)
	)
)))

; Function Name: visitByHeuristic
; Function Parameters:
;	currentState:
;		A parameter for the function, a list in the form ([1-3] [1-3] [1-3]) where
;		each element @ index i represents a number between 1 & 3 (inclusive) which
;		specifies a tower at which the ring (@ index i in indexToRingIdentifier) is 
;		located
;   pathToCurrentLocation:
;		A list of states from the starting state to the current state
;   toVisit:
;		A list of states to visit and the paths to those states
;	paths:
;		A list of paths from the start to the goal state
; Function Description:
; 	This function is the main function for the running the program.
;	This function traverses states using a heuristic to determine which state to visit next.
;   This function is almost identical to breadth-first search
; Function Return:
; 	A sequence of states from the start to the goal state. The sequence is generated
;	by legal moves.
(defun visitByHeuristic(currentState pathToCurrentLocation toVisit paths)
(let ((newStates ()))
(progn
	(setq visitCounter (+ visitCounter 1))
	(cond
		; (if) -> (then) {1} - If the goal state has been reached then return
		(
			; if
			(stateEquals currentState goalState)
			; then
			(progn
				(setq paths (append paths (list pathToCurrentLocation)))
				(setq pathsSoFar (+ 1 pathsSoFar))
			)
		)

		; (if) -> (then) {2} - ; If the goal state is not yet reached
		(
			; Else
			t ; True (equivalent to an else)
			; then
			(progn
				; Generate & filter new states
				(setq newStates (generateNewStates currentState))
                (setq newStates (removeVisitedStates newStates pathToCurrentLocation))
				
				; Add new states to toVisit
				(loop for newState in newStates
                    do
					(setq toVisit (append toVisit (list (list newState (append pathToCurrentLocation (list newState))))))
                )
			)
		)
	)
	; At this point decide to either recurse or end
	(cond
		; (if) -> (then) {1} - Have more left to visit so visit another
		(
			(and (> (length toVisit) 0) (< pathsSoFar maxPaths))
			(progn
				(setq toVisit (sortToVisit toVisit))
				(visitByHeuristic (nth 0 (car toVisit)) (nth 1 (car toVisit)) (cdr toVisit) paths)
			)
		)
		; (if) -> (then) {2} - Else all have been visited OR enough paths have been found
		(
			t
			; Return paths collected
			paths
		)
	)
)))

; Function Name: runComparison
; Function Parameters: None 
; Function Description:
;	Run different kinds of path finding functions and print the results
; Function Return: None
(defun runComparison ()
	; visitDFS
	(setq pathsSoFar 0)
	(setq visitCounter 0)
	(print (visitDFS indexToLocationStarting (list indexToLocationStarting)))
	(print "DFS Summary")
	(print "Paths found:")
	(print pathsSoFar)
	(print "# of visits")
	(print visitCounter)

	; visitBFS
	(setq pathsSoFar 0)
	(setq visitCounter 0)

	(print (visitBFS indexToLocationStarting (list indexToLocationStarting) () ()))
	(print "BFS Summary")
	(print "Paths found:")
	(print pathsSoFar)
	(print "# of visits")
	(print visitCounter)

	; visitByHeuristic
	(setq pathsSoFar 0)
	(setq visitCounter 0)

	(print (visitByHeuristic indexToLocationStarting (list indexToLocationStarting) () ()))
	(print "Heuristic Summary")
	(print "Paths found:")
	(print pathsSoFar)
	(print "# of visits")
	(print visitCounter)
)

; Function Name: describePath
; Function Parameters:
;	path:
;		A list of states from a start state to the goal state
; Function Description:
;	Prints out the steps to move rings from the start state to the goal start
; Function Return: None
(defun describePath (path)
(let ( (state ()) )
(progn
	(print (format nil "Best Path ~D Steps:" (- (length path) 1)))
	(loop for i from 1 to (- (length path) 1)
		; the for j loop is expected to only print once during looping so no need to break
		do(progn
			(setq previousState (nth (- i 1) path))
			(setq state (nth i path))
			(loop for j from 0 to (- (length state) 1)
				do(progn
					(cond
						(
							; if state[j] != previousState[j] then a move was made
							(not (= (nth j state) (nth j previousState)))
							(print (format nil "Move ring ~D from tower ~D to tower ~D" j (nth j previousState) (nth j state)))
						)
					)
				)
			)
		)
	)
)))

; Function Name: findShortestPath
; Function Parameters: None 
; Function Description:
;	Run different kinds of path finding functions and finds the shortest path
; Function Return: None
(defun findShortestPath ()
(let ( (shortestPath ()) (allPaths ()))
(progn
	; Get some paths from DFS
	(setq pathsSoFar 0)
	(setq visitCounter 0)
	(setq allPaths (append allPaths (visitDFS indexToLocationStarting (list indexToLocationStarting))))
	
	; Get some paths from BFS
	(setq pathsSoFar 0)
	(setq visitCounter 0)
	(setq allPaths (append allPaths (visitBFS indexToLocationStarting (list indexToLocationStarting) () ())))

	; Get some paths from Heuristic Search
	(setq pathsSoFar 0)
	(setq visitCounter 0)
	(setq allPaths (append allPaths (visitByHeuristic indexToLocationStarting (list indexToLocationStarting) () ())))

	; Find the shortest path
	(loop for i from 0 to (- (length allPaths) 1)
		do(cond
			; if length(path) < length(shortestPath) -> shortestPath = path
			; OR length(shortestPath) == 0
			(
				(or (< (length (nth i allPaths)) (length shortestPath)) (= (length shortestPath) 0))
				(setq shortestPath (nth i allPaths))
			)
		)
	)
	(describePath shortestPath)
)))

; Initialize Global Variables

; Constant number of towers (Probably won't be modified by user)
(setq numTowers 3) 
; Variable for number of rings currently being used in this program
(setq numRings 3)
; Constant for the maximum number of paths to be found before the program quits
(setq maxPaths 20)
; Variable for number of paths found so far
(setq pathsSoFar 0)
; Starting Values. All start on Tower 1
(setq indexToLocationStarting (generateStartingLocations numRings))
;(setq indexToLocationStarting (list 1 3 3))
; State representation of goal (all rings on 3)
(setq goalState (generateGoalLocations numRings))

; Program Run

; Run 1
; (runComparison)

; Run 2
(findShortestPath)
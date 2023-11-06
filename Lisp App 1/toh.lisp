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
        do(
            (append startingLocations (list 1))
        )
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
(defun inSateList (stateList state)
(let ( (returnValue nil) ) ; Default to false
(progn
    (loop for stateToCompare in stateList
        do (cond
            ; (if) -> (then) {1} - If state is found at current position
            ; then set to return true
            (
                ; Check if equal
                (stateEquals (state stateToCompare))
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
                (not (inSateList visitedStates state))
                ; append to new state list
                (append newStateList (list state))
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
            (setq newList (append newList (list (nth currentPosition))))
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
            (modifyListAtR newList index newElement (+ currentPosition 1))
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
	(loop for towerNumber from 0 to numTowers
		do
		(cond
			; (if) -> (then) {1} - If the ring can be placed on this tower
			(
				; if ring size < 'topRing' AND ring @ index == towerNumber
				(< movingRingNumber (getTopRing currentState towerNumber))
				; then
				(append options (list towerNumber)) ; ringIndex is the size of the current ring
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
							(append newStates (list (makeNewState currentState movingRingNumber towerToMoveToNumber)))
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

(defun visitDFS(currentState, pathToCurrentLocation)
(let ((newStates ()) (returnValue nil) (pathsFound ()))
(progn ; I'm not sure 'progn' is necessary here. I'm leaving it because the program works.
	; Add current state to a list of visited states
    (setq visited (append visited (list currentState)))
    (cond
		; (if) -> (then) {1} - If the goal state has been reached then return
		(
			; if
			(stateEquals currentState goalState)
			; then
			(setq returnValue (list pathToCurrentLocation))
		)

		; (if) -> (then) {2} - ; If the goal state is not yet reached
		(
			; Else
			t ; True (equivalent to an else)
			; then
			(progn
				(setq newStates (generateNewStates currentState))
				(setq newStates (removeVisitedStates newStates))
                (loop for newState in newStates
                    do(
                        ; Visit new state and add all paths to pathsFound
                        (setq pathsFound
                            (append pathsFound
                                (visitDFS currentState
                                    (append pathToCurrentLocation newState)
                                )
                            )
                        )
                    )
                )
                ; Return
                pathsFound
			)
		)
	)
	; Return whatever the return value is set to be
	returnValue
)))

; Initialize Global Variables

; Constant number of towers (Probably won't be modified by user)
(setq numTowers 3) 
; Variable for number of rings currently being used in this program
(setq numRings 3)
; Starting Values. All start on Tower 1
(setq indexToLocationStarting (generateStartingLocations numRings))
; State representation of goal (all rings on 3)
(setq goalState (3 3 3))

; Program Run

; Get all paths from the start to the goal
(print (visitDFS indexToLocationStarting ()))
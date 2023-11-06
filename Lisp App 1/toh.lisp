; Program Start Up

; Comments about the program:
;	About my proficiency in lisp:
;		I do not claim to be very proficient in lisp. I took one course that used
;		Lisp recently and with it being a tricky language, I decided it would be good
;		to make a small program to showcase my knowledge. I'm aware that my use
;		of 'cond' is probably improper, I neglected to learn how to use other if/else
;		branching in this language.
; 	Author: Samuel Jones
; 	Compiler Used: clisp

; Represent the three rings large "l", medium "m", small "s"

; What this means is 0->"l"/large 1->"m" 2->"s"
(setq indexToRingIdentifier ("l" "m" "s"))
; Starting Values. All start on Tower 1
(setq indexToLocationStarting (1 1 1))
; State representation of goal (all rings on 3)
(setq goalState (3 3 3))

; Initialized visited states global variable
(setq visited ())

; Function Definitions


; TODO: removeVisitedStates

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
(defun generateNewStates (currentState)
)

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

; Function Name: towerOfHanoiDFS
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

(defun towerOfHanoiDFS(currentState, pathToCurrentLocation)
(let ((newStates ()) (returnValue nil))
(progn ; I'm not sure 'progn' is necessary here. I'm leaving it because the program works.
	(cond
		; (if) -> (then) {1} - If the goal state has been reached then return
		(
			; if
			(stateEquals currentState goalState)
			; then
			(setq returnValue pathToCurrentLocation)
		)

		; (if) -> (then) {2} - ; If the goal state is not yet reached
		(
			; if 
			t ; True (equivalent to an else)
			; then
			(progn
				(setq newStates (generateNewStates currentState))
				(setq newStates (removeVisitedStates newStates))
			)
		)
	)
	; Return whatever the return value is set to be
	returnValue
)))
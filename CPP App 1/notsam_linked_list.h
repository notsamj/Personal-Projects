namespace NotSam {
	/*
	    Class Name: NotSamLinkedList
	    Description: An implementation of the Doubly LinkedList pattern.
	    Note:
	    Copy of NotSamSinglyLinkedList but made doubly.
	    Also I haven't made a doubly linked list in many many years so this may have many errors because I haven't tested it :)
	*/
	template <typename T> class LinkedList {
	    private:
			/*
			    Class Name: DLLNode
			    Description: A doubly linked node.
			*/
			class DLLNode {
			    public:
			    DLLNode* next;
			    DLLNode* previous;
			    T value;
			    /*
			        Method Name: constructor
			        Method Parameters: 
			            previous:
			                Previous node
			            value:
			                Value at the node
			        Method Description: Constructor
			        Method Return: constructor
			    */
			    DLLNode(DLLNode* previous, T value);

			    ~DLLNode();
			};

			DLLNode* head;
	        DLLNode* end;
	    public:
	    /*
	        Method Name: constructor
	        Method Parameters:
	            array:
	                An array used to initialize the data for this linked list
	        Method Description: Constructor
	        Method Return: Constructor
	    */
	    LinkedList();

	    ~LinkedList();
	    /*
	        Method Name: clear
	        Method Parameters: None
	        Method Description: Empties the list
	        Method Return: void
	    */
	    void clear();

	    /*
	     *   Method Name: append
	     *   Method Parameters:
	     *   Double value:
	     *      Value to add to the list
	     *   Method Description:
	     *   This method inserts a value into the end of the list.
	     *   Method Return: None
	     */
	    void append(T value);

	    /*
	     *   Method Name: insert
	     *   Method Parameters:
	     *   T value:
	     *      Value to add to the list
	     *   Integer index:
	     *      Index at which to insert the value
	     *   Method Description:
	     *   This method inserts a value into the list.
	     *   Method Return: None
	     */
	    void insert(T value, int index);

	    void insert(T value);

	    /*
	     *   Method Name: push
	     *   Method Parameters:
	     *   T value:
	     *      Value to add to the list
	     *   Method Description:
	     *   This method inserts a value into the end of the list.
	     *   Method Return: None
	     */
	    void push(T value);

	    /*
	     *   Method Name: add
	     *   Method Parameters:
	     *   T value:
	     *      Value to add to the list
	     *   Method Description:
	     *   This method inserts a value into the end of the list.
	     *   Method Return: None
	     */
	    void add(T value);
	    
	    /*
	     *   Method Name: getSize
	     *   Method Parameters: None
	     *   Method Description:
	     *   This method calculates then returns the size of the list.
	     *   Method Return: int (Size of the list)
	     */
	    int getSize();

	    /*
	     *   Method Name: getSize
	     *   Method Parameters: None
	     *   Method Description:
	     *   This method calculates then returns the size of the list.
	     *   Method Return: int (Size of the list)
	     */
	    int getLength();

	    /*
	     *   Method Name: print
	     *   Method Parameters: None
	     *   Method Description:
	     *   This method prints every element in the list
	     *   Method Return: None
	     */
	    void print();

	    /*
	     *   Method Name: get
	     *   Method Parameters:
	     *   int index:
	     *      Index of desired element
	     *   Method Description:
	     *   This method returns a value from the list.
	     *   Method Return: double
	     */
	    T get(int index);

	    /*
	     *   Method Name: getNode
	     *   Method Parameters:
	     *   int index:
	     *      Index of desired node
	     *   Method Description:
	     *   This method returns a value from the list.
	     *   Method Return: DLLNode
	     */
	    DLLNode* getNode(int index);

	    /*
	        Method Name: has
	        Method Parameters:
	            T value:
	                Value to be checked
	        Method Description: Check if the linked list includes a value
	        Method Return: boolean, true -> list has the value, false -> list does NOT have the value
	    */
	    bool has(T value);

	    /*
	        Method Name: search
	        Method Parameters:
	            T value:
	                Value to be checked
	        Method Description: Search the linked list for a value and return the index found (-1 if not found)
	        Method Return: int
	    */
	    int search(T value);

	    /*
	        Method Name: remove
	        Method Parameters:
	            index:
	                Index at which to find element that is being looked for
	        Method Description: Remove the element @ index {index}
	        Method Return: void
	    */
	    void remove(int index);

	    /*
	        Method Name: set
	        Method Parameters:
	            index:
	                index at which to set the value
	            value:
	                value to put @ {index}
	        Method Description: Put value into position {index}
	        Method Return: void
	    */
	    void set(int index, T value);

	    /*
	        Method Name: isEmpty
	        Method Parameters: None
	        Method Description: Determine if the array list is empty
	        Method Return: boolean, true -> empty, false -> not empty
	    */
	    bool isEmpty();

	    /*
	        Method Name: pop
	        Method Parameters:
	            index:
	                Index at which to pop the element
	        Method Description: Remove the element and return it
	        Method Return: Object (Unknown type)
	    */
	    T pop(int index);

	    /*
	        Method Name: getLastNode
	        Method Parameters: None
	        Method Description: Returns the last node
	        Method Return: DLLNode
	    */
	    DLLNode* getLastNode();

	    /*
	        Method Name: removeWithCondition
	        Method Parameters:
	            conditionFunction:
	                A function that takes a single parameter and returns a boolean, true -> delete element, false -> don't delete
	        Method Description: Deletes all elements for which the conditionFunction return true
	        Method Return: void
	    */
	    void removeWithCondition(bool (*conditionFunction)(T));

	    void deleteAllElements();

	    void removeAllElements();
	};
}
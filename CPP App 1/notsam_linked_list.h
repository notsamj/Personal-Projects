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
			    DLLNode(DLLNode* previous, T value){
			        this->value = value;
			        this->previous = previous;
			        this->next = 0;
			    }

			    ~DLLNode(){
			    	//std::cout << "Testing: Remove. Node Destructor called!\n";
			    }
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
	    LinkedList(){
	        this->head = 0;
	        this->end = 0;
	    }

	    ~LinkedList(){
	        if (this->getSize() == 0){
	            return;
	        }

	        DLLNode* current = this->head;
	        DLLNode* toDelete = 0;
	        // Loop through the list and print each value
	        while (current != 0){
	        	toDelete = current;
	            current = current->next;
	            delete toDelete;
	        }
	    }
	    /*
	        Method Name: clear
	        Method Parameters: None
	        Method Description: Empties the list
	        Method Return: void
	    */
	    void clear(){
	        this->head = 0;
	        this->end = 0;
	    }

	    /*
	     *   Method Name: append
	     *   Method Parameters:
	     *   Double value:
	     *      Value to add to the list
	     *   Method Description:
	     *   This method inserts a value into the end of the list.
	     *   Method Return: None
	     */
	    void append(T value){
	        if (this->isEmpty()){
	            this->insert(value);
	        }else{
	            this->end->next = new DLLNode(this->end, value);
	            this->end = this->end->next;
	        }
	    }

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
	    void insert(T value, int index){
	        // Note: Inefficient
	        int size = this->getSize();
	        if (index > size || index < 0){
	            std::cerr << "Invalid insertion index! (" << index << '\n';
	            return; 
	        }
	        DLLNode* newNode = new DLLNode(0, value);

	        // If empty list
	        if (size == 0){
	            this->head = newNode;
	            this->end = newNode;
	            return;
	        }

	        DLLNode* current = this->head;
	        DLLNode* previous = 0;
	        int i = 0;
	        // Go through the list to a proper insertion index
	        while (i < index){
	            // Only need to set previous once we get to the index
	            if (i == index - 1){
	                previous = current;
	            }
	            current = current->next;
	            i++;
	        }
	        // This is only the case when at the end of the list
	        if (index == size){
	            this->end = newNode;
	            previous->next = newNode;
	            newNode->next = 0;
	            newNode->previous = previous;
	        }else{
	            // If the list is 1 long
	            if (previous != 0){
	                previous->next = newNode;
	            }else{
	                this->head = newNode;
	            }
	            newNode->next = current;
	        }
	    }

	    void insert(T value){
	        this->insert(value, this->getSize());
	    }

	    /*
	     *   Method Name: push
	     *   Method Parameters:
	     *   T value:
	     *      Value to add to the list
	     *   Method Description:
	     *   This method inserts a value into the end of the list.
	     *   Method Return: None
	     */
	    void push(T value){ this->append(value); }

	    /*
	     *   Method Name: add
	     *   Method Parameters:
	     *   T value:
	     *      Value to add to the list
	     *   Method Description:
	     *   This method inserts a value into the end of the list.
	     *   Method Return: None
	     */
	    void add(T value){ this->append(value); }
	    
	    /*
	     *   Method Name: getSize
	     *   Method Parameters: None
	     *   Method Description:
	     *   This method calculates then returns the size of the list.
	     *   Method Return: int (Size of the list)
	     */
	    int getSize(){
	        DLLNode* current = this->head;
	        int size = 0;
	        // Loop through the list
	        while (current != 0){
	            current = current->next;
	            size += 1;
	        }
	        return size;
	    }

	    /*
	     *   Method Name: getSize
	     *   Method Parameters: None
	     *   Method Description:
	     *   This method calculates then returns the size of the list.
	     *   Method Return: int (Size of the list)
	     */
	    int getLength(){
	        return this->getSize();
	    }

	    /*
	     *   Method Name: print
	     *   Method Parameters: None
	     *   Method Description:
	     *   This method prints every element in the list
	     *   Method Return: None
	     */
	    void print(){
	        if (this->getSize() == 0){
	            std::cout << "List Empty --> cannot print!" << "\n";
	            return;
	        }

	        DLLNode* current = this->head;
	        int i = 0;
	        // Loop through the list and print each value
	        while (current != 0){
	            std::cout << i << ": " << current->value << "\n";
	            i++;
	            current = current->next;
	        }
	    }

	    /*
	     *   Method Name: get
	     *   Method Parameters:
	     *   int index:
	     *      Index of desired element
	     *   Method Description:
	     *   This method returns a value from the list.
	     *   Method Return: double
	     */
	    T get(int index){
	        DLLNode* node = this->getNode(index);
	        return node->value;
	    }

	    /*
	     *   Method Name: getNode
	     *   Method Parameters:
	     *   int index:
	     *      Index of desired node
	     *   Method Description:
	     *   This method returns a value from the list.
	     *   Method Return: DLLNode
	     */
	    DLLNode* getNode(int index){
	        // If the index is out of bounds
	        if (this->getSize() < index + 1 || index < 0){
	            std::cerr << "Issue @ Index: " << index << "(List Size: " << this->getSize() << ")\n";
	            return;
	        }

	        int i = 0;
	        DLLNode* current = this->head;
	        // Loop until desired index
	        while(i < index){
	            current = current->next;
	            i++;
	        }
	        return current;
	    }

	    /*
	        Method Name: has
	        Method Parameters:
	            T value:
	                Value to be checked
	        Method Description: Check if the linked list includes a value
	        Method Return: boolean, true -> list has the value, false -> list does NOT have the value
	    */
	    bool has(T value){
	        return (this->search(value) != -1);
	    }

	    /*
	        Method Name: search
	        Method Parameters:
	            T value:
	                Value to be checked
	        Method Description: Search the linked list for a value and return the index found (-1 if not found)
	        Method Return: int
	    */
	    int search(T value){
	        int index = -1;
	        DLLNode* current = this->head;
	        int i = 0;
	        // Loop through the list
	        while (current != 0){
	            if (current->value == value){
	                return i;
	            }
	            current = current->next;
	            i++;
	        }
	        return -1; // not found
	    }

	    /*
	        Method Name: remove
	        Method Parameters:
	            index:
	                Index at which to find element that is being looked for
	        Method Description: Remove the element @ index {index}
	        Method Return: void
	    */
	    void remove(int index){
	        int size = this->getSize();
	        if (!((index >= 0 && index < size))){
	            return;
	        }

	        if (index == 0){
	            this->head = this->head->next;
	            if (this->head != 0){
	                this->head->previous = 0;
	            } 
	            return;
	        }else if (index == size){
	            this->end = this->end->previous;
	            if (this->end != 0){
	                this->end->next = 0;
	            }
	        }
	        DLLNode* node = this->getNode(index);
	        DLLNode* previous = node->previous; // MUST NOT BE NULL OR ERROR
	        previous->next = node->next;
	        // If this is the last node then it would be 0
	        if (node->next != 0){
	            node->next->previous = previous;
	        }
	    }

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
	    void set(int index, T value){
	        DLLNode* node = this->getNode(index);
	        node->value = value;
	    }

	    /*
	        Method Name: isEmpty
	        Method Parameters: None
	        Method Description: Determine if the array list is empty
	        Method Return: boolean, true -> empty, false -> not empty
	    */
	    bool isEmpty(){
	        return this->head == 0;
	    }

	    /*
	        Method Name: pop
	        Method Parameters:
	            index:
	                Index at which to pop the element
	        Method Description: Remove the element and return it
	        Method Return: Object (Unknown type)
	    */
	    T pop(int index){
	        if (!((index >= 0 && index < this->getSize()))){
	            return 0;
	        }
	        DLLNode* element = this->get(index);
	        this->remove(index);
	        return element;
	    }

	    /*
	        Method Name: getLastNode
	        Method Parameters: None
	        Method Description: Returns the last node
	        Method Return: DLLNode
	    */
	    DLLNode* getLastNode(){
	        return this->end;
	    }

	    /*
	        Method Name: deleteWithCondition
	        Method Parameters:
	            conditionFunction:
	                A function that takes a single parameter and returns a boolean, true -> delete element, false -> don't delete
	        Method Description: Deletes all elements for which the conditionFunction return true
	        Method Return: void
	    */
	    void deleteWithCondition(bool (*conditionFunction)(T)){
	        if (this->isEmpty()){ return; }
	        DLLNode* current = this->getLastNode();
	        while (current != 0){
	            // If value matches condition then remove it
	            if (conditionFunction(current->value)){
	                if (current->next != 0){
	                    current->next->previous = current->previous;
	                }else{ // Else this is the end
	                    this->end = current->previous;
	                }
	                if (current->previous != 0){
	                    current->previous->next = current->next;
	                }else{ // Else this is the head
	                    this->head = current->next;
	                }
	            }
	            // Move to next
	            current = current->previous;
	        }
	    }
	};
}
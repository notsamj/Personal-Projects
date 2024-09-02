#include "notsam_linked_list.h"
#include <iostream>
template <class T>
NotSam::LinkedList<T>::DLLNode::DLLNode(NotSam::LinkedList<T>::DLLNode* previous, T value){
    this->value = value;
    this->previous = previous;
    this->next = 0;
}

template <class T>
NotSam::LinkedList<T>::DLLNode::~DLLNode(){
	//std::cout << "Testing: Remove. Node Destructor called!\n";
}
template <class T>
NotSam::LinkedList<T>::LinkedList(){
    this->head = 0;
    this->end = 0;
}

template <class T>
NotSam::LinkedList<T>::~LinkedList(){
	this->removeAllElements();
}

template <class T>
void NotSam::LinkedList<T>::clear(){
    this->head = 0;
    this->end = 0;
}

template <class T>
void NotSam::LinkedList<T>::append(T value){
    if (this->isEmpty()){
        this->insert(value);
    }else{
        this->end->next = new DLLNode(this->end, value);
        this->end = this->end->next;
    }
}

template <class T>
void NotSam::LinkedList<T>::insert(T value, int index){
    // Note: Inefficient
    int size = this->getSize();
    if (index > size || index < 0){
        std::cerr << "Invalid insertion index! (" << index << '\n';
        return; 
    }
    NotSam::LinkedList<T>::DLLNode* newNode = new DLLNode(0, value);

    // If empty list
    if (size == 0){
        this->head = newNode;
        this->end = newNode;
        return;
    }

    NotSam::LinkedList<T>::DLLNode* current = this->head;
    NotSam::LinkedList<T>::DLLNode* previous = 0;
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

template <class T>
void NotSam::LinkedList<T>::insert(T value){
    this->insert(value, this->getSize());
}

template <class T>
void NotSam::LinkedList<T>::push(T value){ this->append(value); }

template <class T>
void NotSam::LinkedList<T>::add(T value){ this->append(value); }

template <class T>
int NotSam::LinkedList<T>::getSize(){
    NotSam::LinkedList<T>::DLLNode* current = this->head;
    int size = 0;
    // Loop through the list
    while (current != 0){
        current = current->next;
        size += 1;
    }
    return size;
}

template <class T>
int NotSam::LinkedList<T>::getLength(){
    return this->getSize();
}

template <class T>
void NotSam::LinkedList<T>::print(){
    if (this->getSize() == 0){
        std::cout << "List Empty --> cannot print!" << "\n";
        return;
    }

    NotSam::LinkedList<T>::DLLNode* current = this->head;
    int i = 0;
    // Loop through the list and print each value
    while (current != 0){
        std::cout << i << ": " << current->value << "\n";
        i++;
        current = current->next;
    }
}

template <class T>
T NotSam::LinkedList<T>::get(int index){
    NotSam::LinkedList<T>::DLLNode* node = this->getNode(index);
    return node->value;
}

template <class T>
NotSam::LinkedList<T>::DLLNode* NotSam::LinkedList<T>::getNode(int index){
    // If the index is out of bounds
    if (this->getSize() < index + 1 || index < 0){
        std::cerr << "Issue @ Index: " << index << "(List Size: " << this->getSize() << ")\n";
        return 0;
    }

    int i = 0;
    NotSam::LinkedList<T>::DLLNode* current = this->head;
    // Loop until desired index
    while(i < index){
        current = current->next;
        i++;
    }
    return current;
}

template <class T>
bool NotSam::LinkedList<T>::has(T value){
    return (this->search(value) != -1);
}

template <class T>
int NotSam::LinkedList<T>::search(T value){
    int index = -1;
    NotSam::LinkedList<T>::DLLNode* current = this->head;
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

template <class T>
void NotSam::LinkedList<T>::remove(int index){
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
    NotSam::LinkedList<T>::DLLNode* node = this->getNode(index);
    NotSam::LinkedList<T>::DLLNode* previous = node->previous; // MUST NOT BE NULL OR ERROR
    previous->next = node->next;
    // If this is the last node then it would be 0
    if (node->next != 0){
        node->next->previous = previous;
    }
}

template <class T>
void NotSam::LinkedList<T>::set(int index, T value){
    NotSam::LinkedList<T>::DLLNode* node = this->getNode(index);
    node->value = value;
}

template <class T>
bool NotSam::LinkedList<T>::isEmpty(){
    return this->head == 0;
}

template <class T>
T NotSam::LinkedList<T>::pop(int index){
    if (!((index >= 0 && index < this->getSize()))){
        return 0;
    }
    NotSam::LinkedList<T>::DLLNode* element = this->get(index);
    this->remove(index);
    return element;
}

template <class T>
NotSam::LinkedList<T>::DLLNode* NotSam::LinkedList<T>::getLastNode(){
    return this->end;
}

template <class T>
void NotSam::LinkedList<T>::removeWithCondition(bool (*conditionFunction)(T)){
    if (this->isEmpty()){ return; }
    NotSam::LinkedList<T>::DLLNode* current = this->getLastNode();
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

template <class T>
void NotSam::LinkedList<T>::deleteAllElements(){
    NotSam::LinkedList<T>::DLLNode* current = this->head;
    // Loop through the list and print each value
    while (current != 0){
    	delete current->value;
        current = current->next;
    }
    this->removeAllElements;
}

template <class T>
void NotSam::LinkedList<T>::removeAllElements(){
	if (this->getSize() == 0){
        return;
    }

    NotSam::LinkedList<T>::DLLNode* current = this->head;
    NotSam::LinkedList<T>::DLLNode* toDelete = 0;
    // Loop through the list and print each value
    while (current != 0){
    	toDelete = current;
        current = current->next;
        delete toDelete;
    }
}
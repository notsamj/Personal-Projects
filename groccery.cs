using System;
 
public class GrocceryApplication {
    private static GrocceryList grocceryList;

    static public void Main(){
        Console.WriteLine("Groccery Application Started!");
        grocceryList = new GrocceryList();
        grocceryList.defaultPrint();
    }
}

public class GrocceryList {
    private SinglyLinkedList<GrocceryItem> grocceryItems;
    
    public GrocceryList(){
        this.grocceryItems = new SinglyLinkedList<GrocceryItem>();   
    }

    public void defaultPrint(){
        int grocceryListLength = this.grocceryItems.getLength();
        Console.WriteLine("GrocceryList (" + grocceryListLength + "):");
        for (int i = 0; i < this.grocceryItems.getLength(); i++){
            Console.WriteLine(grocceryItems.getItem(i).getName());
        }
    }
}

public class SinglyLinkedList<T> {
    private SLLNode<T> head;

    public class SLLNode<T>{
        private T data;
        private SLLNode<T> next;

        public SLLNode(T data){
            this.data = data;
            this.next = null;
        }

        public SLLNode<T> getNext(){
            return this.next;
        }

        public T getData(){
            return this.data;
        }
    }

    public SinglyLinkedList(){
        this.head = null;
    }

    public int getLength(){
        int length = 0;
        SLLNode<T> currentItem = this.head;
        while (currentItem != null){
            currentItem = currentItem.getNext();
            length++;
        }
        return length;
    }

    // Returns null if itemIndex > length(linked_list)
    public T getItem(int itemIndex){
        int currentIndex = 0;
        SLLNode<T> currentItem = this.head;
        while(currentIndex < itemIndex){
            currentItem = currentItem.getNext();
            currentIndex++;
        }
        return currentItem.getData();
    }
}

public class GrocceryItem{
    private String name;
    
    public GrocceryItem(String name){
        this.name = name;
    }

    public String getName(){ return this.name; }
    public void setName(String name){ this.name = name; }
}
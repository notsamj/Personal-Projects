using System;
using System.IO; // File In/Out
 
public class GrocceryApplication {
    private static GrocceryList grocceryList;

    static public void Main(){
        Console.WriteLine("Groccery Application Started!");
        grocceryList = new GrocceryList();
        grocceryList.fillFromFile("list1.txt");
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

    public void fillFromFile(String fileName){
        if (!File.Exists(fileName)){
            Console.WriteLine("Unable to read: " + fileName);
            return;
        }

        // File exists time to read it
        String fileText = File.ReadAllText(fileName);
        String[] lines = fileText.Split("\n");

        for (int i = 0; i < lines.Length; i++){
            this.addItem(GrocceryItem.readFromFileString(lines[i]));
        }
    }

    public void addItem(GrocceryItem item){
        this.grocceryItems.add(item);
    }
}

public class SinglyLinkedList<T> {
    private SLLNode<T> head;

    public class SLLNode<U>{
        private U data;
        private SLLNode<U> next;

        public SLLNode(U data){
            this.data = data;
            this.next = null;
        }

        public SLLNode<U> getNext(){
            return this.next;
        }

        public U getData(){
            return this.data;
        }

        public void setNext(SLLNode<U> node){
            this.next = node;
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

    public void add(T newElement){
        SLLNode<T> newNode = new SLLNode<T>(newElement);

        // If list is empty then set head to new element
        if (this.head == null){
            this.head = newNode;
            return;
        }

        // Else add it to the end
        SLLNode<T> head = this.head;
        while (head.getNext() != null){
            head = head.getNext(); 
        }
        // head is now the last element
        head.setNext(newNode);
    }
}

public class GrocceryItem{
    private String name;
    
    public GrocceryItem(String name){
        this.name = name;
    }

    public String getName(){ return this.name; }
    public void setName(String name){ this.name = name; }

    public static GrocceryItem readFromFileString(String lineText){
        return new GrocceryItem(lineText);
    }
}
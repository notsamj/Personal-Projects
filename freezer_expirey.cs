using System;
using System.IO; // File In/Out
 
public class FreezerExpireyApplication {
    private static FreezerList grocceryList;

    static public void Main(){
        Console.WriteLine("FreezerExpirey Application Started!");
        grocceryList = new FreezerList();
        grocceryList.fillFromFile("list1.txt");
        grocceryList.defaultPrint();
    }
}

public class FreezerList {
    private SinglyLinkedList<FreezerItem> grocceryItems;
    
    public FreezerList(){
        this.grocceryItems = new SinglyLinkedList<FreezerItem>();   
    }

    public void defaultPrint(){
        int grocceryListLength = this.grocceryItems.getLength();
        Console.WriteLine("FreezerList (" + grocceryListLength + "):");
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
            this.addItem(FreezerItem.readFromFileString(lines[i]));
        }
    }

    public void addItem(FreezerItem item){
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

public class FreezerItem{
    private String name;
    private int quantity;
    private long expireyMS;
    
    public FreezerItem(String name, int quantity, long expireyMS){
        this.name = name;
        this.quantity = quantity;
        this.expireyMS = expireyMS;
    }

    public String getName(){ return this.name; }
    public void setName(String name){ this.name = name; }

    public int getQuantity(){ return this.quantity; }
    public void setQuantity(int quantity){ this.quantity = quantity; }

    public long getExpireyMS(){ return this.expireyMS; }
    public void setExpireyMS(long expireyMS){ this.expireyMS = expireyMS; }

    public static FreezerItem readFromFileString(String lineText){
        String[] lineItemStrings = lineText.Split(",");
        return new FreezerItem(lineTextSplit[0], int.Parse(lineTextSplit[1]), long.Parse(lineTextSplit[2]));
    }
}
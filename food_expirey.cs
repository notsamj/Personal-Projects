using System;
using System.IO; // File In/Out
using System.Globalization; // Current time
 
public class FoodExpireyApplication {
    private static FoodList grocceryList;

    static public void Main(){
        Console.WriteLine("FoodExpirey Application Started!");
        grocceryList = new FoodList();
        grocceryList.fillFromFile("list1.txt");
        //grocceryList.defaultPrint();
        grocceryList.printExpireyList();
    }
}

public class FoodList {
    private SinglyLinkedList<FoodItem> foodItems;
    
    public FoodList(){
        this.foodItems = new SinglyLinkedList<FoodItem>();   
    }

    public void defaultPrint(){
        int grocceryListLength = this.foodItems.getLength();
        Console.WriteLine("FoodList (" + grocceryListLength + "):");
        for (int i = 0; i < this.foodItems.getLength(); i++){
            Console.WriteLine(foodItems.getItem(i).getName());
        }
    }

    public void printExpireyList(){
        this.sort();
        Console.WriteLine("here5");
        int grocceryListLength = this.foodItems.getLength();
        Console.WriteLine("here6");
        Console.WriteLine("FoodList with details (" + grocceryListLength + "):");
        for (int i = 0; i < this.foodItems.getLength(); i++){
            Console.WriteLine(foodItems.getItem(i).getFullDisplay());
        }
    }

    public void sort(){
        this.bubbleSort(); 
    }

    private void bubbleSort(){
        bool sorted = false;
        while (!sorted){
            sorted = true;
            for (int i = 0; i < this.foodItems.getLength() - 1; i++){
                Console.WriteLine("here9");
                FoodItem item1 = foodItems.getItem(i);
                FoodItem item2 = foodItems.getItem(i+1);
                if (item1.getExpireyMS() > item2.getExpireyMS()){
                    Console.WriteLine("Swapping");
                    foodItems.swap(i, i+1);
                    sorted = false;
                }
                Console.WriteLine("here4 " + i.ToString());
            }
            Console.WriteLine("here8");
        }
        Console.WriteLine("here7");
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
            this.addItem(FoodItem.readFromFileString(lines[i]));
        }
    }

    public void addItem(FoodItem item){
        this.foodItems.add(item);
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
        SLLNode<T> currentNode = this.head;
        while(currentIndex < itemIndex){
            currentNode = currentNode.getNext();
            currentIndex++;
        }
        return currentNode.getData();
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

    public void swap(int index1, int index2){
        // ASSUMPTION: index1, index2 < Length(linked_list)
        // NOTE: There are some inefficiencies in this method I thought weren't worth dealing with
        
        // Sort out which index is higher and which is lower
        int lowerIndex = index1;
        int higherIndex = index2;
        if (index2 < index1){
            lowerIndex = index2;
            higherIndex = index1;
        }

        SLLNode<T> currentNode = this.head;
        int currentIndex = 0;

        Console.WriteLine("here1");
        // Arrive at node prior to the lower node
        while (currentIndex < lowerIndex - 1){
            currentNode = currentNode.getNext();
            currentIndex++;
        }
        Console.WriteLine("here2");

        // Now currentIndex is at the node who's next attribute is that of the lower item
        SLLNode<T> priorToLowerSwappingNode = currentNode;
        SLLNode<T> lowerSwappingNode = currentNode.getNext();
        // Special case when lowerswapping node is the first node
        if (lowerIndex == 0){
            lowerSwappingNode = currentNode;
        }
        SLLNode<T> afterLowerSwappingNode = currentNode.getNext();

        // Arrive at node prior to the higher node
        while (currentIndex < higherIndex - 1){
            currentNode = currentNode.getNext();
            currentIndex++;
        }
        Console.WriteLine("here3");

        SLLNode<T> priorToHigherSwappingNode = currentNode;
        SLLNode<T> higherSwappingNode = currentNode.getNext();
        SLLNode<T> afterHigherSwappingNode = currentNode.getNext();

        // Set previous node and next node for the higher swapping node

        // If the lower node is 0 then the prior doesn't exist
        if (lowerIndex > 0){
            priorToLowerSwappingNode.setNext(higherSwappingNode);
        }else{
            this.head = higherSwappingNode;
        }
        
        higherSwappingNode.setNext(afterLowerSwappingNode);


        // Set previous node and next node for the lower swapping node
        priorToHigherSwappingNode.setNext(lowerSwappingNode);
        lowerSwappingNode.setNext(afterHigherSwappingNode);
    }
}

public class FoodItem{
    private String name;
    private int quantity;
    private long expireyMS;
    
    public FoodItem(String name, int quantity, long expireyMS){
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

    public static FoodItem readFromFileString(String lineText){
        String[] lineItemStrings = lineText.Split(",");
        return new FoodItem(lineItemStrings[0], int.Parse(lineItemStrings[1]), long.Parse(lineItemStrings[2]));
    }

    public String getFullDisplay(){
        String fullDisplayString = this.name + "[" + this.quantity + "] " + FoodItem.toExpireString(expireyMS);
        return fullDisplayString;        
    }

    public static String toExpireString(long expireyTimeMS){
        long currentTimeMS = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        long timeDiff = expireyTimeMS - currentTimeMS;
        String start = "expires ";
        String end = " from now";
        if (timeDiff < 0){
            start += "expired ";
            end = " ago";
            timeDiff *= -1; // Should be a positive number for the next calculation
        }

        String currentDateString = "";

        int dayCounter = 0;
        const int MS_IN_A_DAY = 1000 * 60 * 60 * 24;

        // Count the number of days until expirey
        while(timeDiff >= MS_IN_A_DAY){
            dayCounter += 1;
            timeDiff -= MS_IN_A_DAY;
        }

        currentDateString = dayCounter.ToString() + " day";
        if (dayCounter != 1){
            currentDateString += "s";
        }
        return currentDateString + end;
    }
}
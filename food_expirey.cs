using System;
using System.IO; // File In/Out
using System.Globalization; // Current time
using System.Text.RegularExpressions; // Regex
 
public class FoodExpireyApplication {
    private static Regex ITEM_NAME_REGEX = new Regex("^[a-zA-Z0-9 ]{1,20}$");
    private static Regex ITEM_QUANTITY_REGEX = new Regex("^[0-9]{1,5}$");
    private static Regex EXPIREY_DATE_REGEX = new Regex("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");
    private static FoodList grocceryList;

    public static void Main(){
        Console.WriteLine("FoodExpirey Application Started!");
        grocceryList = new FoodList();
        //grocceryList.fillFromFile("list1.txt");
        //grocceryList.defaultPrint();
        //grocceryList.printExpireyList();

        bool continueRunning = true;
        while (continueRunning){
            Console.Write("Please enter your request: ");
            continueRunning = processRequest(Console.ReadLine());
        }
    }

    private static bool processRequest(String requestText){
        if (requestText == "quit"){
            return false;
        }else if (requestText == "add"){
            userAdd();
        }else if (requestText == "remove"){
            userRemove();
        }else if (requestText == "status"){
            userStatus();
        }else if (requestText == "load"){
            userLoad();
        }else if (requestText == "help"){
            userHelp();
        }else{
            Console.WriteLine("Unknown command. Type \"help\" for help!");
        }
        return true;
    }

    private static void userHelp(){
        Console.WriteLine("Command List:");
        Console.WriteLine("load - load a list");
        Console.WriteLine("add - add an item to a list");
        Console.WriteLine("remove - remove an item from a list");
        Console.WriteLine("status - view the expirey status of items on the list");
        Console.WriteLine("quit - quit the application");
        Console.WriteLine("help - ask for help");
    }


    private static void userLoad(){
        if (grocceryList.isLoaded()){
            Console.WriteLine("File already loaded.");
            return;
        }

        Console.Write("Please enter the file name: ");
        String fileName = Console.ReadLine();
        grocceryList.load(fileName);
        if (grocceryList.isLoaded()){
            Console.WriteLine("File loaded!");
        }
    }

    private static void userRemove(){
        if (!grocceryList.isLoaded()){
            Console.WriteLine("Please load a list first.");
            return;
        }
        Console.Write("Please enter the item name: ");
        String itemName = readMatchingInput(ITEM_NAME_REGEX);
        bool removed = grocceryList.removeByName(itemName);
        if (removed){
            Console.WriteLine("'{0}' removed!", itemName);
        }else{
            Console.WriteLine("'{0}' not found!", itemName);
        }
    }

    private static void userStatus(){
        if (!grocceryList.isLoaded()){
            Console.WriteLine("Please load a list first.");
            return;
        }
        grocceryList.printExpireyList();
    }

    private static void userAdd(){
        if (!grocceryList.isLoaded()){
            Console.WriteLine("Please load a list first.");
            return;
        }
        Console.Write("Please enter the item name: ");
        String itemName = readMatchingInput(ITEM_NAME_REGEX);

        Console.Write("Please enter the item quantity: ");
        String itemQuantityStr = readMatchingInput(ITEM_QUANTITY_REGEX);
        int itemQuantity = int.Parse(itemQuantityStr);

        Console.Write("Please enter the expirey date: ");
        DateTime date = readDate();
        DateTimeOffset dateTimeOffset = new DateTimeOffset(date.ToUniversalTime());
        long expireMS = dateTimeOffset.ToUnixTimeMilliseconds();

        grocceryList.addItem(new FoodItem(itemName, itemQuantity, expireMS));
        Console.WriteLine("Added!");
    }

    private static DateTime readDate(){
        DateTime date = new DateTime(); // empty DateTime() value never used just for preventing error messages
        String dateString;
        bool matchFound = false;
        while (!matchFound){
            dateString = readMatchingInput(EXPIREY_DATE_REGEX);
            matchFound = DateTime.TryParse(dateString, out date);
            if (!matchFound){
                Console.WriteLine("Invalid date. Please try again.");
                Console.Write("Your input: ");
            }
        }

        return date;
    }

    private static String readMatchingInput(Regex regex){
        String inputStr = "";
        bool matchFound = false;
        while (!matchFound){
            inputStr = Console.ReadLine();
            matchFound = regexMatchFound(regex, inputStr);
            if (!matchFound){
                Console.WriteLine("Invalid input. Please try again in format: " + regex.ToString());
                Console.Write("Your input: ");
            }
        }
        return inputStr;
    }

    private static bool regexMatchFound(Regex regex, String str){
        return regex.Matches(str).Count > 0;
    }

}

public class FoodList {
    private SinglyLinkedList<FoodItem> foodItems;
    private String fileName;
    
    public FoodList(){
        this.foodItems = new SinglyLinkedList<FoodItem>();
        this.fileName = "";   
    }

    public void load(String fileName){
        this.fillFromFile(fileName);
    }

    public bool isLoaded(){
        return this.fileName != "";
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
        int grocceryListLength = this.foodItems.getLength();
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
                FoodItem item1 = foodItems.getItem(i);
                FoodItem item2 = foodItems.getItem(i+1);
                if (item1.getExpireyMS() > item2.getExpireyMS()){
                    foodItems.swap(i, i+1);
                    sorted = false;
                }
            }
        }
    }

    public void fillFromFile(String fileName){
        if (!File.Exists(fileName)){
            Console.WriteLine("Unable to read: " + fileName);
            return;
        }
        // File exists time to read it
        this.fileName = fileName;
        String fileText = File.ReadAllText(fileName);
        String[] lines = fileText.Split("\n");

        for (int i = 0; i < lines.Length; i++){
            this.addItem(FoodItem.readFromFileString(lines[i]));
        }
    }

    public void saveToFile(){
        if (!this.isLoaded()){
            return;
        }
        File.WriteAllText(this.fileName, this.getFileText());
    }

    private String getFileText(){
        String fileText = "";
        int foodItemsLength = this.foodItems.getLength();
        for (int i = 0; i < foodItemsLength; i++){
            fileText += foodItems.getItem(i).toFileString();
            if (i != foodItemsLength - 1){
                fileText += "\n";
            }
        }
        return fileText;
    }

    public void addItem(FoodItem item){
        this.foodItems.add(item);
        this.saveToFile();
    }

    public bool removeByName(String name){
        int foodItemsLength = this.foodItems.getLength();
        int itemIndex = -1;
        this.foodItems.sort(); // Must be sorted because you are assumed to remove the closest to expirey first
        for (int i = 0; i < foodItemsLength; i++){
            FoodItem item = this.foodItems.getItem(i);
            if (item.getName() == name){
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1){
            return false;
        }
        this.foodItems.removeAtIndex(itemIndex);
        this.saveToFile();
        return true;
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

        // Returns null if itemIndex > length(linked_list)
    public SLLNode<T> getNode(int itemIndex){
        int currentIndex = 0;
        SLLNode<T> currentNode = this.head;
        while(currentIndex < itemIndex){
            currentNode = currentNode.getNext();
            currentIndex++;
        }
        return currentNode;
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
        }else if (index1 == index2){
            return;
        }

        SLLNode<T> lowerNode = this.getNode(lowerIndex);
        SLLNode<T> higherNode = this.getNode(higherIndex);
        SLLNode<T> lowerNodeNewNext = higherNode.getNext();
        SLLNode<T> nodeBeforeHigherNode = this.getNode(higherIndex - 1);

        // If lower node is the head then handle by changing head
        if (lowerIndex == 0){
            this.head = higherNode;
        }else{ // Otherwise attached one below previous lower to new higher
            this.getNode(lowerIndex - 1).setNext(higherNode);
        }
        // If they are next to one another then higher attaches to lower
        if (higherIndex - lowerIndex == 1){
            higherNode.setNext(lowerNode);
        }else{ // Otherwise higher gets lower's next and the old before higher node gets lower as its next
            higherNode.setNext(lowerNode.getNext());
            nodeBeforeHigherNode.setNext(lowerNode);
        }
        lowerNode.setNext(lowerNodeNewNext);
    }

    public void removeAtIndex(int indexToRemoveAt){
        int listLength = this.getLength();
        if (listLength == 0 || indexToRemoveAt < 0 || indexToRemoveAt >= listLength){
            return;
        }else if (indexToRemoveAt == 0){
            this.head = this.head.getNext();
            return;
        }

        // After the elimination of the above possitibilites, we know this is a valid index > 0
        
        // Remove and attach it's next to node below
        SLLNode<T> nodeBelow = this.getNode(indexToRemoveAt - 1);
        SLLNode<T> nodeToRemove = nodeBelow.getNext();
        nodeBelow.setNext(nodeToRemove.getNext());
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

    public String toFileString(){
        return this.name.ToString() + "," + this.quantity.ToString() + "," + this.expireyMS.ToString();
    }
}
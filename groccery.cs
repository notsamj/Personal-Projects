using System;
 
public class GrocceryApplication {
    private static GrocceryList grocceryList;

    static public void Main(){
        Console.WriteLine("Groccery Application Started!");
        grocceryList = new GrocceryList();
        grocceryList.print();
    }
}

public class GrocceryList {
    private SinglyLinkedList<int> grocceryItems;
    
    public GrocceryList(){
        this.grocceryItems = new SinglyLinkedList<int>();   
    }

    public void print(){
        Console.WriteLine("Test");
    }
}

public class SinglyLinkedList<T> {
    private SLLNode<T> head;

    public class SLLNode<S>{
        private T data;
        private SLLNode<T> next;

        public SLLNode(T data){
            this.data = data;
            this.next = null;
        }
    }

    public SinglyLinkedList(){
        this.head = null;
    }
}

public class GrocceryItem{
    
}
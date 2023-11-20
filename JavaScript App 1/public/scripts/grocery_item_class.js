// Client Side Grocery Item Class
class GroceryItem{
    constructor(name, quantity, description){
        this.name = name;
        this.quantity = quantity;
        this.description = description;
    }

    getName(){ return this.name; }
    getQuantity(){ return this.quantity; }
    getDescription(){ return this.description; }

    setName(name){ this.name = name; }
    setQuantity(quantity){ this.quantity = quantity; }
    setDescription(description){ this.description = description; }

    static fromDataJSON(dataJSON){
        return new GroceryItem(dataJSON["name"], dataJSON["quantity"], dataJSON["description"]);
    }

}
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

    toJSON(){
        return {"name": this.name, "quantity": this.quantity, "description": this.description};
    }

    static fromDataJSON(dataJSON){
        return new GroceryItem(dataJSON["name"], dataJSON["quantity"], dataJSON["description"]);
    }

    copy(){
        return new GroceryItem(this.name, this.quantity, this.description);
    }

    copyDetailsFromJSON(jsonOBJ){
        this.name = jsonOBJ["name"];
        this.quantity = jsonOBJ["quantity"];
        this.description = jsonOBJ["description"];
    }

}
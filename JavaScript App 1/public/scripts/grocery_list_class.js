console.log("GroceryList Class Loaded!");
// Client Side Grocery List Class
class GroceryList{
    constructor(){
        this._listData = {"items":[]};
    }

    addItem(dataText){
        // TODO: Maybe add a way to interpret this differently?
        this._listData["items"].push(new GroceryItem(dataText, 0, ""));
    }

    toDataString(){
        // TODO
    }

    fromDataJSON(dataJSON){
        // TODO
    }

    getLength(){
        return this._listData["items"].length;
    }

    getList(){
        return this._listData["items"];
    }

    // Assumes element @ index exists
    getByIndex(index){
        return this._listData["items"][index];
    }
}
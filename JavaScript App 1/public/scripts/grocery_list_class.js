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

    toJSON(){
        let jsonRep = {"items": []};
        for (let item of this._listData["items"]){
            jsonRep["items"].push(item.toJSON());
        }
        return jsonRep;
    }

    fromDataJSON(dataJSON){
        this._listData = {"items":[]}; // Reset data
        for (let itemJSON of dataJSON["items"]){
            this._listData["items"].push(GroceryItem.fromDataJSON(itemJSON));
        }
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
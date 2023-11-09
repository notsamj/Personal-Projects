console.log("GroceryList Class Loaded!");
class GroceryList{
    constructor(){
        this._listData = {"items":[]};
    }

    addItem(name){
        this._listData["items"].push({"name": name});
    }

    toDataString(){
        return JSON.stringify(this._listData);
    }

    fromDataJSON(dataJSON){
        this._listData = dataJSON;
    }

    getList(){
        return this._listData["items"];
    }
}
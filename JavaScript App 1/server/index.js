const express = require("express");
const GROCERY_LIST_MODULE = require("grocery_list");
const app = express();
const port = 8080;
const grocceryList = new GROCERY_LIST_MODULE.GroceryList();

app.get("/", (req, res) => {
    console.log(grocceryList)
    res.send("Test");
})

app.listen(port, () => {
    console.log(`Grocery List Server Running on Port: ${port}`)
})
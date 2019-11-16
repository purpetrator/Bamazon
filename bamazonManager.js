var mysql = require("mysql");
require("dotenv").config();
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: process.env.SQL_PASS,
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  firstQ();
  //   connection.end();
});

function firstQ() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // console.log(res);

    inquirer
      .prompt([
        {
          name: "menuOptions",
          type: "rawlist",
          message: "\nMenu Options: \n",
          choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
          ]
        }
      ])
      .then(function(answer) {
        if (answer.menuOptions === "View Products for Sale") {
          displayAllItems();
        } else if (answer.menuOptions === "View Low Inventory") {
          lowInventory();
        } else if (answer.menuOptions === "Add to Inventory") {
          addInventory();
        } else if (answer.menuOptions === "Add New Product") {
          addNewProduct();
        }
      });
  });
}

function displayAllItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("-----------------------------------");
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].item_id +
          " - " +
          res[i].product_name +
          " - " +
          res[i].department_name +
          " - " +
          "$" +
          res[i].price +
          " - " +
          "qty: " +
          res[i].stock_quantity
      );
    }
    console.log("-----------------------------------\n");
    mainMenu();
  });
}

function lowInventory() {
  // * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
  connection.query(
    "SELECT product_name, stock_quantity FROM products WHERE stock_quantity BETWEEN 0 AND 5",

    function(err, res) {
      if (err) throw err;
      console.log(res);
      mainMenu();
    }
  );
}

function addInventory() {}

function addNewProduct() {}

function mainMenu() {
  inquirer
    .prompt({
      name: "mainMenu",
      type: "list",
      message: "Would you like to return to the main menu?",
      choices: ["YES", "NO, EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.mainMenu === "YES") {
        firstQ();
      } else if (answer.mainMenu === "NO, EXIT") {
        connection.end();
      }
    });
}

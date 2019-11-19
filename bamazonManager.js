var mysql = require("mysql");
require("dotenv").config();
var inquirer = require("inquirer");
var Table = require("cli-table3");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: process.env.SQL_PASS,
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  firstQ();
});

function firstQ() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

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

    var table = new Table({
      head: ["ID", "Product", "Department", "Price", "Stock"],
      colWidths: [5, 17, 17, 10, 10]
    });

    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        "$" + res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(table.toString());
    mainMenu();
  });
}

function lowInventory() {
  connection.query(
    "SELECT product_name, stock_quantity FROM products WHERE stock_quantity BETWEEN 0 AND 5",

    function(err, res) {
      if (err) throw err;

      var table = new Table({
        head: ["Product", "Stock"],
        colWidths: [17, 10]
      });

      for (var i = 0; i < res.length; i++) {
        table.push([res[i].product_name, res[i].stock_quantity]);
      }

      console.log(table.toString());
      mainMenu();
    }
  );
}

function addInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // console.log(res);

    // Display the table first
    var table = new Table({
      head: ["ID", "Product", "Department", "Price", "Stock"],
      colWidths: [5, 17, 17, 10, 10]
    });

    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        "$" + res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(table.toString());

    inquirer
      .prompt([
        {
          name: "addQuantity",
          type: "rawlist",
          message:
            "\nWhich product would you like to add more of? Please select by ID.",
          choices: function() {
            var productsArray = [];
            for (var i = 0; i < res.length; i++) {
              productsArray.push(res[i].item_id);
            }
            return productsArray;
          }
        },
        {
          type: "input",
          name: "qtyProduct",
          message: "\nPlease enter the quantity you would like to add: "
        }
      ])
      .then(function(answer) {
        // console.log(answer);
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === answer.addQuantity) {
            chosenItem = res[i];
          }
        }

        var newQty =
          parseInt(chosenItem.stock_quantity) + parseInt(answer.qtyProduct);

        console.log("\n\nNew Quantity: " + newQty + "\n\n");

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newQty
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(error) {
            if (error) {
              console.log(error);
            }
            mainMenu();
          }
        );
      });
  });
}

function addNewProduct() {
  // * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
  inquirer
    .prompt([
      {
        name: "newName",
        type: "input",
        message: "\nNEW PRODUCT ENTRY \nEnter product name: \n"
      },
      {
        name: "newDept",
        type: "input",
        message: "\nEnter product department: \n"
      },
      {
        name: "newPrice",
        type: "input",
        message: "\nEnter product price: \n"
      },
      {
        name: "newQty",
        type: "input",
        message: "\nEnter product quantity: \n"
      }
    ])
    .then(function(answer) {
      var newProductName = answer.newName;
      var newProductDept = answer.newDept;
      var newProductPrice = answer.newPrice;
      var newProductQty = answer.newQty;

      connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
        [newProductName, newProductDept, newProductPrice, newProductQty],

        function(err, res) {
          if (err) throw err;
          console.log("\nNew product was successfully added!\n");
          mainMenu();
        }
      );
    });
}

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

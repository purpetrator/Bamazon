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
  console.log("connected as id " + connection.threadId + "\n");
  displayAllItems();
  // buyProduct();
});

function displayAllItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    var table = new Table({
      head: ["ID", "Product", "Department", "Price", "Stock"],
      colWidths: [5, 17, 17, 10, 10]
    });

    // console.log("-----------------------------------");
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
    // console.log("-----------------------------------\n");
    start();
  });
}

function start() {
  inquirer
    .prompt({
      name: "buyOrExit",
      type: "list",
      message: "Would you like to buy an item or exit?",
      choices: ["BUY", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.buyOrExit === "BUY") {
        buyProduct();
      } else if (answer.buyOrExit === "EXIT") {
        connection.end();
      }
    });
}

function restart() {
  inquirer
    .prompt({
      name: "buyAnother",
      type: "list",
      message: "Would you like to buy another item?",
      choices: ["YES", "NO"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.buyAnother === "YES") {
        buyProduct();
      } else if (answer.buyAnother === "NO") {
        connection.end();
      }
    });
}

function buyProduct() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // console.log(res);

    inquirer
      .prompt([
        {
          name: "whichProduct",
          type: "rawlist",
          message:
            "\nWhich product would you like to buy? Please choose a product by its ID.",
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
          message: "\nPlease enter the quantity you would like to buy: "
        }
      ])
      .then(function(answer) {
        // console.log(answer);
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === answer.whichProduct) {
            chosenItem = res[i];
          }
        }

        if (chosenItem.stock_quantity > answer.qtyProduct) {
          console.log("Great, we have enough in stock.\n");
          // bid was high enough, so update db, let the user know, and start over
          var newQty =
            parseInt(chosenItem.stock_quantity) - parseInt(answer.qtyProduct);

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
              // * Once the update goes through, show the customer the total cost of their purchase.
              var purchPrice = chosenItem.price * parseInt(answer.qtyProduct);

              console.log("Your purchase total is $" + purchPrice + "\n");
              restart();
            }
          );
        } else {
          // bid wasn't high enough, so apologize and start over
          console.log("Sorry, not enough in stock...\n");
          restart();
        }
      });
  });
}

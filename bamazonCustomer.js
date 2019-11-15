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
  console.log("connected as id " + connection.threadId + "\n");
  displayAllItems();
  buyProduct();
  connection.end();
});

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
    console.log("-----------------------------------");
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
        for (var i = 1; i < res.length; i++) {
          if (res[i].item_id === answer.whichProduct) {
            chosenItem = res[i];
          }
        }

        console.log("stock qty: " + chosenItem.stock_quantity);
        // if (chosenItem.stock_quantity > parseInt(answer.qtyProduct)) {
        //   // bid was high enough, so update db, let the user know, and start over
        //   connection.query(
        //     "UPDATE products SET ? WHERE ?",
        //     [
        //       {
        //         stock_quantity: chosenItem.stock_quantity - answer.qtyProduct
        //       },
        //       {
        //         item_id: chosenItem.item_id
        //       }
        //     ],
        //     function(cb) {
        //       console.log(cb);

        //       console.log("Purchase logged successfully!");
        //       //   start();
        //     }
        //   );
        // } else {
        //   // bid wasn't high enough, so apologize and start over
        //   console.log("Not enough in stock...");
        //   //   start();
        // }
      });
  });
}

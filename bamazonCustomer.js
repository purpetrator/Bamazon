var mysql = require("mysql");
require("dotenv").config();

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
          res[i].price
      );
    }
    console.log("-----------------------------------");
  });
}

DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(45) NULL,
  price INT default 1,
  stock_quantity INT default 1,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("chair", "furniture", 150, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("coffee mug", "home goods", 5, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("slippers", "clothing", 50, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("phone charger", "electronics", 10, 80);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("candle", "home goods", 12, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("desk", "furniture", 400, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("sweater", "clothing", 40, 120);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("monitor", "electronics", 200, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("calendar", "home goods", 15, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("rug", "furniture", 350, 12);
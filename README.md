# Bamazon

### Overview

This application is a Node.js and MySQL app that is run in the command line. This app mimics an online store and offers two dashboard views: 'Customer View' and 'Manager View'.

> Demo (Customer View): [Watch Here](https://drive.google.com/file/d/1dVZijph996qtKUzzVElYRsgyzsUpsHl8/view)

> Demo (Manager View): [Watch Here](https://drive.google.com/file/d/1iGX8wrWeULhgjs9IQ1Cowo14vSfBUFNF/view)

> Repository: [See Here](https://github.com/purpetrator/Bamazon)

### Installation

Bamazon requires [Node.js](https://nodejs.org/) v6+ to run.

```sh
# clone this repository
$ git clone git@github.com:purpetrator/Bamazon.git
# install the dependencies
$ npm install
```

Create a dotenv file in the root folder.

```sh
touch .env
```

Copy the following text into the .env file, replacing the x's with your MySQL password.

```sh
SQL_PASS=xxxxxxxx
```

Create a new database using MySQL. Use the code in the bamazonDB.sql file to populate your Bamazon database with tables and some inventory.

### How to Use

There are two dashboard views. These views can be accessed by entering the following commands in your CLI:

```sh
# This will enter the Customer view
node bamazonCustomer.js

# This will enter the Manager view
node bamazonManager.js
```

#### Customer View

Running the customer application will display the user with a table of all products available for purchase.
The user is asked if they would like to purchase an item. If so, the user is prompted to select the product by its ID and to specify how many units they would like to buy.

![](https://i.ibb.co/GQf81cR/1.png)

The app checks our database to see if there is enough inventory to fulfill the order. If not, the user is alerted that there is not enough stock.

![](https://i.ibb.co/FHNsq77/2.png)

If our store does have sufficient stock, the user is shown their order total, the order is fulfilled, and the database is updated to reflect the remaining quantity available.

![](https://i.ibb.co/hFHkFvG/3.png)

#### Manager View

Running the manager application will display a main menu which offers the user the following options:

![](https://i.ibb.co/mJPSFFF/4.png)

###### View Products for Sale

This displays a table of all products currently in stock.

###### View Low Inventory

This displays a table of all products with a stock quantity of 5 or fewer.

![](https://i.ibb.co/s1W9QTv/5.png)

###### Add to Inventory

This allows the user to add more of any item currently in the store. This change is reflected in our database.

![](https://i.ibb.co/2s6GKRM/6.png)

###### Add New Product

This allows the user to add a completely new product to the store.

![](https://i.ibb.co/fvDST2Y/6.png)

### Technologies Used

- Node.js
- MySQL
- JavaScript

##### Node Packages used:

- MySql
- Inquirer
- DotEnv
- CLI-Table
- Chalk

### Author:

Ana Chernov - Full Stack Web Developer - https://github.com/purpetrator

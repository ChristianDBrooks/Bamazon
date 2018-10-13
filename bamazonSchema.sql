DROP DATABASE if EXISts bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE product (
--    * item_id (unique id for each product)
item_id INTEGER NOT NULL AUTO_INCREMENT,
--    * product_name (Name of product)
product_name VARCHAR(30) NOT NULL,
--    * department_name
department_name VARCHAR(50),
--    * price (cost to customer)
price DECIMAL(5,2) NOT NULL,
--    * stock_quantity (how much of the product is available in stores)
stock_quantity INTEGER(10),

PRIMARY KEY (item_id)
);

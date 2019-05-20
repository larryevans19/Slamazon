DROP DATABASE IF EXISTS slamazonDB;

CREATE DATABASE slamazonDB;

USE slamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

-- Add products into the database
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES 
(1, "FORTO Coffee Shot- Hershey's Chocolate Latte- 6pk", "Groceries", 11.95, 50),
(2, "Kripsy Kreme Coffee Shot- Original Glazed Latte- 6pk", "Groceries", 11.95, 15),
(3, "Green Mountain Coffee Shot- Mocha- 6pk", "Groceries", 11.95, 5),
(4, "Chicken of the Sea Infusions Tuna- Lemon & Thyme", "Groceries", 2.15, 20),
(5, "Scott Flushable Wipes- 8pk", "Housewares", 19.92, 2),
(6, "Micro USB High Speed Charging Cords- 3pk", "Electronics", 4.99, 10),
(7, "Smash Cam Action Tennis Camera", "Electronics", 24.59, 3),
(8, "Wilson ProStaff 97 CV Tennis Racquet", "Sporting Goods", 219.00, 4),
(9, "Nike Air Zoom Ultra Tennis Shoes- Size 9", "Sporting Goods", 77.00, 1),
(10, "SwagMaster No Tie Shoe Laces- White", "Sporting Goods", 6.99, 7);

SELECT * FROM products
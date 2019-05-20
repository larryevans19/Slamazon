const mysql = require("mysql");
const inquirer = require("inquirer");

// Create the connection info for the SQL database
const connection = mysql.createConnection({
    host     : "127.0.0.1",
    user     : "root",
    password : "root",
    port	 : 3306,
    database : "slamazonDB"
});

// Connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // Run the slamazon function after the connection is made to prompt the user
  slamazon();
});

// Function which prompts the user for what products they want to buy

function slamazon() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item_id",
        type: "input",
        message: "Please enter the ID of the product you would like to purchase today:"
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "Please enter the quantity of the product would you like to purchase today:"
      },

    ])
    .then(function(input) {
      // After obtaining the consumer input, check the quantity in the database to make sure there is enough
      // to complete the order
      connection.query(
        "SELECT * FROM products WHERE item_id=?", input.item_id, function (err, res)
        {
            if (err) throw err;
            // console.log("Item:", input.item_id)
            console.log("Units:", input.stock_quantity)
            // console.log("Query:", res);
            // console.log(`Price: $${res[0].price}`);
            // console.log(`Total Cost: $${res[0].price*input.stock_quantity}`)

            if (res[0].stock_quantity < input.stock_quantity) {
                console.log(
                    `We are sorry, but Slamazon currently does not have enough inventory to fulfill the quantity you requested.  Slamazon currently has ${res[0].stock_quantity} units available.  Please place a new order if you would like to purchase the quantity available.`)

            }
            else {
                connection.query(
                    "UPDATE stock_quantity SET ? WHERE ?",
                    [{
                        stock_quantity: res[0].stock_quantity - input.stock_quantity
                      }]);

                   const newQuantity = (res[0].stock_quantity - input.stock_quantity);

                    console.log("Updated quantity:", newQuantity);
                    console.log("*******************************************");
                    console.log("Your order was completed successfully!");
                    console.log("--------------------------------------");
                    console.log("Here is a summary of your purchase:");
                    console.log(`Product Purchased: ${res[0].product_name}`);
                    console.log(`Quantity Purchased: ${input.stock_quantity}`);
                    console.log(`Total Price: $${input.stock_quantity * res[0].price}`)
                    console.log("You will receive a confirmation email when your order has shipped.  Thank you for choosing Slamazon!");
            };
        });
    });

};

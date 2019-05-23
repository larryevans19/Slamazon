const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("cli-table")
const colors = require("colors")

// Create the connection info for the SQL database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  port: 3306,
});

// Connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // Run the slamazonStart function after the connection is made to show all of the products available for purchase
  slamazonStart();
});

function slamazonStart() {
  connection.query("SELECT * FROM slamazonDB.products", function (err, res) {
    if (err) throw err;
    // console.log(`\n`);

    console.log(`
 $$$$$$  $$          $$$    $$     $$    $$$    $$$$$$$$  $$$$$$$  $$    $$
$$    $$ $$         $$ $$   $$$   $$$   $$ $$        $$  $$     $$ $$$   $$
$$       $$        $$   $$  $$$$ $$$$  $$   $$      $$   $$     $$ $$$$  $$
 $$$$$$  $$       $$     $$ $$ $$$ $$ $$     $$    $$    $$     $$ $$ $$ $$
      $$ $$       $$$$$$$$$ $$  $  $$ $$$$$$$$$   $$     $$     $$ $$  $$$$
$$    $$ $$       $$     $$ $$     $$ $$     $$  $$      $$     $$ $$   $$$ 
 $$$$$$  $$$$$$$$ $$     $$ $$     $$ $$     $$ $$$$$$$$  $$$$$$$  $$    $$ 
 `.yellow)
    console.log("Welcome to SLAMAZON, where we're made of your money!\nWe have the prescription for your shopping addiction!\n".green)
    console.log("Here are Today's Deals!\n".cyan)

    //Instantiate the product table for the CLI
    let products = new table({
      head: ["ID".yellow, "Product Description".yellow, "Price".yellow],
      colWidths: [4, 55, 9]
    });

    for (let i = 0; i < res.length; i++) {
      products.push([`${res[i].item_id}`, `${res[i].product_name}`, `$${res[i].price.toFixed(2)}`]);
    };
    console.log (products.toString());
    console.log("\n");
    // Call the slamazonBuy function to prompt the user for what they want to buy
    slamazonBuy();
  });
}

// The function slamazonBuy prompts the user for what products they want to buy
function slamazonBuy() {
  // Inquirer prompts consumer for the product and quantity they want to buy
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
    .then(function (input) {
      // After obtaining the consumer input, check the quantity in the database to make sure there is enough
      // to complete the order
      connection.query(
        "SELECT * FROM slamazonDB.products WHERE item_id=?", input.item_id, function (err, res) {
          if (err) throw err;
          // console.log("Item:", input.item_id)
          // console.log("Units:", input.stock_quantity)
          // console.log("Query:", res);
          // console.log(`Price: $${res[0].price}`);
          // console.log(`Total Cost: $${res[0].price*input.stock_quantity}`)

          if (res[0].stock_quantity < input.stock_quantity) {
            console.log(`\nWe are sorry, but Slamazon currently does not have enough inventory to fulfill the quantity you requested.`);
            console.log(`Slamazon currently has`, `${res[0].stock_quantity}`.red,`units available.`);
            console.log(`\nPlease press Ctrl+C to exit and create a new order if you would like to purchase the quantity available.`);
          }
          else {
            totalPrice = input.stock_quantity * res[0].price
            console.log("\nYour order was completed successfully!".green);
            console.log("-----------------------------------------------------------------------------");
            console.log("Here is a summary of your purchase:".cyan);
            console.log(`Product Purchased: `,`${res[0].product_name}`.yellow);
            console.log(`Quantity Purchased: `,`${input.stock_quantity}`.yellow);
            console.log(`Total Price: `,`$${totalPrice.toFixed(2)}`.yellow);
            console.log("\nYou will receive a confirmation email when your order has shipped.  Thank you for choosing Slamazon!");

            // Update the inventory
            let newQuantity = (res[0].stock_quantity - input.stock_quantity);
            let stockItem = input.item_id;

            updateStock(newQuantity, stockItem)
          }
        }
      )
    });
};

// The function updateStock updates the stock_quantity after each purchase is completed
function updateStock(newQuantity, stockItem) {

  connection.query(
    `UPDATE slamazonDB.products SET stock_quantity = ${newQuantity}  WHERE item_id = ${stockItem}`
  )

};

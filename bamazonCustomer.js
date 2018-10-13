var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected as user: ' + connection.threadId);
    // Function here.
    start();
});

function start() {
    connection.query('SELECT * FROM product', function (error, results) {
        if (error) throw error;
        console.log("\n================================================================\n");
        for (var i = 0; i < results.length; i++) {
            console.log(' | ID: ' + results[i].item_id + ' | Product: ' + results[i].product_name + ' | Department: ' + results[i].department_name + ' | Price: ' + results[i].price + ' | Quantity: ' + results[i].stock_quantity + ' | ')
        }
        console.log("\n================================================================\n");
        customerPurchase();
    });
}

function customerPurchase() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the product ID of the product you would like to purchase?',
                name: 'itemID'
            },
            {
                type: 'input',
                message: 'How many would you like to buy?',
                name: 'itemQuantity'
            }
        ])
        .then(customerResponse => {
            connection.query('SELECT product_name, price, stock_quantity FROM product WHERE item_id =' + customerResponse.itemID, function (error, results) {
                if (error) throw error;
                console.log('\nYou selected: ' + results[0].product_name);
                if (customerResponse.itemQuantity > results[0].stock_quantity) {
                    console.log("We don't have enough " + results[0].product_name + "'s to fulfill your request!\nWe only have " + results[0].stock_quantity + " left.")
                    start();
                } else {
                    updateProduct((results[0].stock_quantity - customerResponse.itemQuantity), customerResponse.itemID)
                    console.log(customerResponse.itemQuantity + " " + results[0].product_name + "'s added to cart!");
                    console.log("The total cost of this purchase is: $" + (results[0].price*customerResponse.itemQuantity));
                    start();
                }
            })
        });
}

function updateProduct(updatedQuantity, itemID) {
    connection.query("UPDATE product SET ? WHERE item_id =" + itemID,
    [
        {
            stock_quantity: updatedQuantity
        }
    ], 
    function(error, result) {
        if (error) throw error;
        console.log("Updated the quantity of " + result.affectedRows + " product!");
    })
}


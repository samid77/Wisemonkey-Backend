const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const reactConnection = require('cors');

var app = express();

/** Register the database and connect */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '8889',
    database: 'wisemonkey'
});
db.connect();

/** Making the node accessible by React */
app.use(reactConnection());

/** Bodyparser middleware setup */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/** Establish a web server */
app.listen(8003, (req, res) => {
    console.log('Server started at port 8003 ...');
});

/** Input data baru */
app.post('/saveData', (req, res) => {
    var productCode = req.body.productcode;
    var productName = req.body.productname;
    var productDescription = req.body.description;
    var productPrice = req.body.price;

    var sql = `INSERT INTO product VALUES("${''}", "${productCode}", "${productName}", "${productDescription}", "${productPrice}", "${''}", "${''}", "${''}")`;

    db.query(sql, (err, result) => {
        if(err){
            throw err;
        } else {
            res.end('Data berhasil disimpan');
        }
    });

});

/** Grab all the data */
app.get('/productlist', (req, res) => {
    var sql = `SELECT * FROM product`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send(result);
        }
    });
});

/** Edit product data */
app.get('/editproduct/:id', (req, res) => {
    var sql = `SELECT * FROM product WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send(result);
        }
    });
})

app.post('/updateData', (req, res) => {
    var id = req.body.id;
    var productName = req.body.productname;
    var productCode = req.body.productcode;
    var productPrice = req.body.price;
    var productDescription = req.body.description;

    var queryUpdate = `UPDATE product SET product_name = "${productName}", product_code = "${productCode}", price = "${productPrice}", description = "${productDescription}" WHERE id = "${id}"`;
    db.query(queryUpdate, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send('Update berhasil');
        }
    });
});

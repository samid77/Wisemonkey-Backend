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
    database: 'wisemonkey',
    multipleStatements: true,
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

/*******************************
 ******** PRODUCT AREA *********
 ******************************/

/** Grab all the product data */
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
/** Update Product Data */
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

/*******************************
 ******** CATEGORY AREA *********
 ******************************/

 
/** Insert Category Data */
app.post('/saveCatData', (req, res) => {
    var categoryCode = req.body.categorycode;
    var categoryName = req.body.categoryname;
    var categoryDescription = req.body.categorydescription;

    var sql = `INSERT INTO master_category VALUES ("${''}", "${categoryCode}", "${categoryName}", "${categoryDescription}", "${''}")`;

    db.query(sql, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send('Data berhasil diinput');
        }
    });
})

/** Grab Category and Sub Category Data */
app.get('/getCatData', (req, res) => {

    /** Category */
    var sql = `SELECT * FROM master_category`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send(result);
        }
    });
})
/** Delete Category */
app.post('/deleteCategory', (req, res) => {
    var id = req.body.id;
    var sql = `DELETE FROM master_category WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
            var status = 'data gagal dihapus';
            res.send(status);
        } else {
            var status = 'oke';
            res.send(status)
        }
    })
});
/** Edit category data */
app.get('/editcategory/:id', (req, res) => {
    var sql = `SELECT * FROM master_category WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send(result);
        }
    });
})
/** Update Category Data */
app.post('/updateCategory', (req, res) => {
    var id = req.body.id;
    var category_code = req.body.category_code;
    var category_name = req.body.category_name;
    var description = req.body.description;

    var queryUpdate = `UPDATE master_category SET category_code = "${category_code}", category_name = "${category_name}", description = "${description}" WHERE id = "${id}"`;
    db.query(queryUpdate, (err, result) => {
        if(err){
            throw err;
        } else {
            var status = 'oke';
            res.send(status);
        }
    });
});

/*******************************
 ******* SUB CATEGORY AREA ****
 ******************************/

/** Get Sub Category Data */
app.get('/getSubCatData', (req, res) => {
    db.query(`SELECT * FROM master_subcategory INNER JOIN master_category ON master_subcategory.category_id = master_category.id;SELECT * FROM master_category`, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send(result);
        }
    });
})

/** Save sub category data */
app.post('/saveSubCategoryData', (req, res) => {
    var subcategoryname = req.body.subcategoryname;
    var categoryid = req.body.categoryid;
    var sql = `INSERT INTO master_subcategory VALUES("${''}", "${subcategoryname}", "${categoryid}", "${''}")`;
    db.query(sql , (err, result) => {
        if(err){
            throw err;
        } else {
            res.send('Data berhasil disimpan');
        }
    });
})


/** Edit sub category data */
app.get('/editsubcategory/:id', (req, res) => {
    var sql = `SELECT * FROM master_subcategory INNER JOIN master_category ON master_category.id=master_subcategory.category_id WHERE subcatid = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send(result);
        }
    });
});
/** Update Sub Category Data */
app.post('/updateSubCategory', (req, res) => {
    var id = req.body.id;
    var subcategory_name = req.body.subcategory_name;
    var category_name = req.body.category_name;

    var queryUpdate = `UPDATE master_subcategory SET subcategory_name = "${subcategory_name}", category_id = "${category_name}" WHERE subcatid = "${id}"`;
    db.query(queryUpdate, (err, result) => {
        if(err){
            throw err;
        } else {
            var status = 'oke';
            res.send(status);
        }
    });
});

/** Delete Category */
app.post('/deleteSubCategory', (req, res) => {
    var id = req.body.id;
    var sql = `DELETE FROM master_subcategory WHERE subcatid = ${id}`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
            var status = 'data gagal dihapus';
            res.send(status);
        } else {
            var status = 'oke';
            res.send(status)
        }
    })
});
/*******************************
 ******* USER MANAGEMENT AREA ****
 ******************************/

/** Get User Data */
app.get('/getUsers', (req, res) => {
    var sql = `SELECT * FROM users`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            console.log(result);
            res.send(result);
        }
    });
});


/*******************************
 ******* INVOICE AREA ****
 ******************************/

 /** Grab all the invoice data */
 app.get('/invoiceHistory', (req, res) => {
     var sql = `SELECT * FROM invoice`;
     db.query(sql, (err, result) => {
         if(err){
             throw err;
         } else {
             res.send(result);
         }
     });
 })
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const reactConnection = require('cors');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const multipart = require('connect-multiparty');

var app = express();
var multipartMiddleware = multipart();

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

/** Upload function initialization */
app.use(fileUpload());

/** Bodyparser middleware setup */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/** Initialize file upload */
// app.use(fileUpload());
// app.use('/public', express.static(__dirname + '/public'));

/** Establish a web server */
app.listen(8003, (req, res) => {
    console.log('Server started at port 8003 ...');
});

/****************************************************
 ******** USERS AREA (LOGIN & REGISTRATION) *********
 ***************************************************/
app.post('/login', (req, res) => {

});
app.post('/register', (req, res) => {

});


/*******************************
 ******** PRODUCT AREA *********
 ******************************/

/** Grab all the product data */
app.get('/productlist', (req, res) => {
    db.query(`SELECT * FROM product; SELECT * FROM master_category; SELECT * FROM master_subcategory; SELECT p.id, p.product_name,
    COUNT(i.product_id) AS quantity
    FROM product_item i 
    INNER JOIN product AS p ON p.id = i.product_id
    GROUP BY p.product_name`, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send(result);
        }
    });
});

/** Input data product */
app.post('/saveData', (req, res) => {
    var KodeProduk = req.body.productcode;
    var productName = req.body.productname;
    var productDescription = req.body.productdescription;
    var productPrice = req.body.productprice;
    var subCategoryID = req.body.subcategoryid;
    var fotoproduk1 = req.files.fotoproduk1.name;
    var fotoproduk2 = req.files.fotoproduk2.name;
    var fotoproduk3 = req.files.fotoproduk3.name;
    var fotoproduk4 = req.files.fotoproduk4.name;

    var datafile = req.files.fotoproduk1;
    datafile.mv("./files/"+fotoproduk1, (error) => {
        if(error){
            throw error;
        } else {
            console.log('Upload file pertama success');
        }
    });
    var datafile2 = req.files.fotoproduk2;
    datafile2.mv("./files/"+fotoproduk2, (error) => {
        if(error){
            throw error;
        } else {
            console.log('Upload file kedua success');
        }
    });
    var datafile3 = req.files.fotoproduk3;
    datafile3.mv("./files/"+fotoproduk3, (error) => {
        if(error){
            throw error;
        } else {
            console.log('Upload file ketiga success');
        }
    });
    var datafile4 = req.files.fotoproduk4;
    datafile4.mv("./files/"+fotoproduk4, (error) => {
        if(error){
            throw error;
        } else {
            console.log('Upload file keempat success');
        }
    });

    var sql = `INSERT INTO product VALUES("${''}", "${KodeProduk}", "${productName}", "${productDescription}", "${productPrice}", "${fotoproduk1}", "${fotoproduk2}", "${fotoproduk3}", "${fotoproduk4}", "${subCategoryID}", "${''}")`;

    db.query(sql, (err, result) => {
        if(err){
            throw err;
        } else {
            var status = 'oke';
            res.status(200).send(status);
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

    if(req.files){

    } else {
        
    }

    var queryUpdate = `UPDATE product SET product_name = "${productName}", product_code = "${productCode}", price = "${productPrice}", description = "${productDescription}" WHERE id = "${id}"`;
    db.query(queryUpdate, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send('Update berhasil');
        }
    });
});

/** Delete data produk */
app.post('/deleteData', (req, res) => {
    var id = req.body.id;
    var sql = `DELETE FROM product WHERE id = "${id}"`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            var status = 'oke';
            res.send(status);
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
    db.query(`SELECT * FROM master_subcategory INNER JOIN master_category ON master_subcategory.category_id = master_category.id; SELECT * FROM master_category`, (err, result) => {
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

 /*******************************
 ******* PRODUCT ITEM AREA ****
 ******************************/
app.get('/itemlist', (req, res) => {
    var sql = `SELECT * FROM product_item INNER JOIN product ON product.id = product_item.product_id; SELECT * FROM product`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            res.send(result);
        }
    })

})

 /** Test upload file */
const storage = multer.diskStorage({
    destination: './files',
    filename(req, file, cb) {
        cb(null, `${new Date()}-${file.originalname}`);
    },
});
const upload = multer({storage});

app.post('/uploadFile', (req, res) => {
    if(req.files != undefined){
        var inputsatu = req.body.testinput1;
        var inputkedua = req.body.testinput2;
        var namafile = req.files.filekesatu.name;
        var namafile2 = req.files.filekedua.name;
        var namafile3 = req.files.fileketiga.name;
        var namafile4 = req.files.filekeempat.name;

        var datafile = req.files.filekesatu;
            datafile.mv("./files/"+namafile, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file pertama success');
                }
            });
            var datafile2 = req.files.filekedua;
            datafile2.mv("./files/"+namafile2, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file kedua success');
                }
            });
            var datafile3 = req.files.fileketiga;
            datafile3.mv("./files/"+namafile3, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file ketiga success');
                }
            });
            var datafile4 = req.files.filekeempat;
            datafile4.mv("./files/"+namafile4, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file keempat success');
                }
            });

            var sql = `INSERT INTO testupload VALUES("${''}", "${inputsatu}", "${inputkedua}", "${namafile}", "${namafile2}", "${namafile3}", "${namafile4}", "${''}")`;
            db.query(sql, (err, result) => {
                if(err) {
                    throw err;
                } else {
                    res.send('Upload berhasil');
                }
            });
    }
});


app.post('/uploadfile', (req, res) => {
    if(req.files != undefined){
        if(req.files.filekesatu != null && req.files.filekedua != null && req.files.fileketiga != null && req.files.keempat != null){
            var inputsatu = req.body.testinput1;
            var inputkedua = req.body.testinput2;
            var namafile = req.files.filekesatu.name;
            var namafile2 = req.files.filekedua.name;
            var namafile3 = req.files.fileketiga.name;
            var namafile4 = req.files.filekeempat.name;

            var datafile = req.files.filekesatu;
            datafile.mv("./files/"+namafile, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file pertama success');
                }
            });
            var datafile2 = req.files.filekedua;
            datafile2.mv("./files/"+namafile2, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file kedua success');
                }
            });
            var datafile3 = req.files.fileketiga;
            datafile3.mv("./files/"+namafile3, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file ketiga success');
                }
            });
            var datafile4 = req.files.filekeempat;
            datafile4.mv("./files/"+namafile4, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file keempat success');
                }
            });

            var sql = `INSERT INTO testupload VALUES("${''}", "${inputsatu}", "${inputkedua}", "${namafile}", "${namafile2}", "${namafile3}", "${namafile4}", "${''}")`;
            db.query(sql, (err, result) => {
                if(err) {
                    throw err;
                } else {
                    res.send('Upload berhasil');
                }
            });
        } else if(req.files.filekesatu != null && req.files.filekedua != null && req.files.fileketiga != null){
            var inputsatu = req.body.testinput1;
            var inputkedua = req.body.testinput2;
            var namafile = req.files.filekesatu.name;
            var namafile2 = req.files.filekedua.name;
            var namafile3 = req.files.fileketiga.name;

            var datafile = req.files.filekesatu;
            datafile.mv("./files/"+namafile, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file pertama success');
                }
            });
            var datafile2 = req.files.filekedua;
            datafile2.mv("./files/"+namafile2, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file kedua success');
                }
            });
            var datafile3 = req.files.fileketiga;
            datafile3.mv("./files/"+namafile3, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file ketiga success');
                }
            });

            var sql = `INSERT INTO testupload VALUES("${''}", "${inputsatu}", "${inputkedua}", "${namafile}", "${namafile2}", "${namafile3}", "${''}", "${''}")`;
            db.query(sql, (err, result) => {
                if(err) {
                    throw err;
                } else {
                    res.send('Upload berhasil');
                }
            });
        } 
        else if(req.files.filekesatu != null && req.files.filekedua != null){
            var inputsatu = req.body.testinput1;
            var inputkedua = req.body.testinput2;
            var namafile = req.files.filekesatu.name;
            var namafile2 = req.files.filekedua.name;

            var datafile = req.files.filekesatu;
            datafile.mv("./files/"+namafile, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file pertama success');
                }
            });
            var datafile2 = req.files.filekedua;
            datafile2.mv("./files/"+namafile2, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file kedua success');
                }
            });

            var sql = `INSERT INTO testupload VALUES("${''}", "${inputsatu}", "${inputkedua}", "${namafile}", "${namafile2}", "${''}", "${''}", "${''}")`;
            db.query(sql, (err, result) => {
                if(err) {
                    throw err;
                } else {
                    res.send('Upload berhasil');
                }
            });
        } else if(req.files.filekesatu != null){
            var inputsatu = req.body.testinput1;
            var inputkedua = req.body.testinput2;
            var namafile = req.files.filekesatu.name;

            var datafile = req.files.filekesatu;
            datafile.mv("./files/"+namafile, (error) => {
                if(error){
                    throw error;
                } else {
                    console.log('Upload file pertama success');
                }
            });

            var sql = `INSERT INTO testupload VALUES("${''}", "${inputsatu}", "${inputkedua}", "${namafile}", "${''}", "${''}", "${''}", "${''}")`;
            db.query(sql, (err, result) => {
                if(err) {
                    throw err;
                } else {
                    res.send('Upload berhasil');
                }
            });
        }
    }
})
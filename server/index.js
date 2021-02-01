//node, express - backend
//connects with mysql database

const express = require('express');
const mysql = require("mysql");
const cors = require("cors");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const fs = require('fs');
const fetch = require('node-fetch');
const { Console } = require('console');
const { request } = require('http');

const app = express();

app.set('view engine','ejs')

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true //IMPORTANT - Allow cookies
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    key: "userId",
    secret: "top_secret", //In production its IMPORTANT AF
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24, //After this time (mili sec - 24h) session will expire
    }
}))

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Password123",
    database: "epurchase",
});

app.post("/register",(req,res)=>{
    //1. Register
    const username = req.body.username;
    const password = req.body.password;


    const name= req.body.name;
    const surname= req.body.surname;
    const city= req.body.city;
    const postCode= req.body.postCode;
    const street= req.body.street;
    const phoneNumber= req.body.phoneNumber;


    //Insert address
    db.query(
        "INSERT INTO address (city, postCode, street, phone) VALUES (?,?,?,?)",
        [city,postCode,street,phoneNumber],
        (err, result) => {
            console.log(err);
            //Insert user
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                db.query(
                    "INSERT INTO users (username, password, reputation, isVerified, isAdmin, address_id,name,surname) VALUES (?,?,?,?,?,?,?,?)",
                    [username, hash, 0, 0, 0, result.insertId, name, surname],
                    (err, result) => {
                        console.log(err);
                        //Login user
                        db.query(
                            "SELECT * FROM users WHERE username = ?",
                            username,
                            (err,result)=>{
                                bcrypt.compare(password, result[0].password,(error, response)=>{
                                    if(response){
                                        req.session.user = result; //creating a session
                                        //console.log(req.session.user);
                                        res.send(result);
                                    }
                                    else{
                                        res.send({message: "Wrong username/password combination!"})
                                    }
                                });
                            },
                            db.query(
                                "insert into bank(value,users_id) values (?,?)",
                                [1000,result.insertId],
                            )
                        )
                    }
                )
            });
        }
    );

});

app.post("/addNewAuctions",(req,res)=>{

    const itemName = req.body.itemName;
    const itemCategory = req.body.itemCategory;
    const itemDesc = req.body.itemDesc;
    const itemQuant = req.body.itemQuant;
    const itemPrice = req.body.itemPrice;
    const imgBase64 = req.body.imgBase64;

    let imageTitle = "image.png";

    //Get category

    //Input to db
    db.query(
        "INSERT INTO items (name, price, description, quantity,id_category) VALUES (?,?,?,?,?)",
        [itemName, itemPrice, itemDesc, itemQuant,itemCategory],
        (err, result) => {
            console.log(err);
            imageTitle = result.insertId +".png"
            fs.writeFile("./productImages/"+imageTitle+"", imgBase64, 'base64', function(err) {
                console.log(err);
            });
        })
});

app.get("/getAllAuctions",(req,res)=>{



    db.query(
        "SELECT * FROM items",
        (err, result) => {
            console.log(result);
            res.send(result);
        }
    )
});


app.get("/getAllOpinions",(req,res)=>{
    db.query(
        "SELECT * FROM opinions",
        (err, result) => {
            res.send(result);
        }
    )
});
app.post("/addOpinion",(req,res)=>{

    const itemId = req.body.itemId;
    const opinion = req.body.opinion;
    db.query(
        "INSERT INTO opinions (contents,itemId) VALUES (?,?)",
        [opinion, itemId],
        (err, result) => {
            console.log(err);
        })
});





app.post("/addItemToCart",(req,res)=>{
    const itemId = req.body.itemId;
    console.log(itemId);
    const itemName = req.body.itemName;
    const itemPrice = req.body.itemPrice
    const userId = req.session.user[0].id;
    const quantity = 1;

    db.query(
        "SELECT * FROM usercart WHERE user_id = ? AND item_id = ?",
        [userId,itemId],
        (err,result)=>{
            if(result.length > 0){
                //mamy juz taki item w bazie, zwiekszamy quantity
                db.query(
                    "SELECT quantity FROM items where id=?",
                    itemId,
                    (err,resultTwo)=>{
                        if(result[0].quantity < resultTwo[0].quantity) {
                            db.query(
                                "UPDATE usercart SET quantity= quantity+1 WHERE user_id = ? AND item_id = ?",
                                [userId, itemId],
                                (err, result) => {
                                }
                            );
                        }

                    }
                )
            }
            else{
                //nie ma takiego itemu w bazie, dodajemy
                db.query(
                    "INSERT INTO usercart (user_id, item_id, quantity,product_name, price) VALUES (?,?,?,?,?)",
                    [userId, itemId, quantity,itemName,itemPrice],
                    (err, result) => {
                        console.log(err)
                    }
                );
            }
        }
    );
});

app.post("/buyOneItem",(req,res)=>{
    const userId = req.session.user[0].id;
    const itemId = req.body.itemId;
    const itemName = req.body.itemName;
    const itemQuant = req.body.itemQuant;
    const itemPrice = req.body.itemPrice;

    let itemBougth = [{itemId:itemId, itemName: itemName, itemQuantity: itemQuant, itemPrice:itemPrice}]

    console.log("ID = "+itemId)
    db.query(
        "SELECT quantity FROM items WHERE id=?",
        itemId,
        (err, auctionQuantity)=> {
            if (auctionQuantity[0].quantity - 1 === 0) {
                //usuwamy item z aukcji i dodajemy do tabeli order
                db.query(
                    "DELETE FROM items WHERE id = ?",
                    itemId,
                    (err, resultEnd) => {
                    }
                );
            } else {
                //dekrementujemy quntity itemu w aukcjach i dodajemy do tabeli order
                db.query(
                    "UPDATE items SET quantity=quantity-? WHERE id=?",
                    [1, itemId],
                    (err, resultEnd) => {
                    }
                );
            }
        });

    db.query(
        "INSERT INTO orderdetails(user_id,orderItems) VALUES (?,?)",
        [userId,JSON.stringify(itemBougth)]
    )
    db.query(
        "UPDATE bank SET value = value - ? WHERE users_id = ?",
        [itemPrice,userId]
    );


});

app.post("/submitCart",(req,res)=> {
    const userId = req.session.user[0].id;
    const cartSum = req.body.cartSum;
    db.query(
        "SELECT * FROM usercart WHERE user_id = ?",
        userId,
        (err, itemsFromCart) => {
            for(let i = 0; i < itemsFromCart.length; i++){
                db.query(
                    "SELECT quantity FROM items WHERE id=?",
                    itemsFromCart[i].item_id,
                    (err, auctionQuantity)=> {
                        if(auctionQuantity[0].quantity-itemsFromCart[i].quantity===0){
                            //usuwamy item z aukcji i dodajemy do tabeli order
                            db.query(
                              "DELETE FROM items WHERE id = ?",
                                itemsFromCart[i].item_id,
                                (err,resultEnd)=>{
                                }
                            );
                        }
                        else{
                            //dekrementujemy quntity itemu w aukcjach i dodajemy do tabeli order
                            db.query(
                                "UPDATE items SET quantity=quantity-? WHERE id=?",
                                [itemsFromCart[i].quantity,itemsFromCart[i].item_id],
                                (err,resultEnd)=>{
                                }
                            );
                        }
                        //na koniec czyscimy koszyk
                        db.query(
                          "DELETE FROM usercart"
                        );
                        //i usuwamy hajs z konta
                        db.query(
                            "UPDATE bank SET value = value - ? WHERE users_id = ?",
                            [cartSum,userId],
                            (err,resultacik)=>{

                            }
                        );

                        //Last iteration - prepare order items and create order
                        if(i === itemsFromCart.length-1) {
                            let orderItems = [];

                            for(let j = 0; j < itemsFromCart.length; j++){
                                let obj = {
                                    itemId: itemsFromCart[j].item_id,
                                    itemName: itemsFromCart[j].product_name,
                                    itemQuantity: itemsFromCart[j].quantity,
                                    itemPrice: itemsFromCart[j].price * itemsFromCart[j].quantity,
                                }
                                orderItems.push(obj);

                                if(j===itemsFromCart.length-1){
                                    db.query(
                                        "INSERT INTO orderdetails(user_id,orderItems) VALUES (?,?)",
                                        [userId,JSON.stringify(orderItems)]
                                    )
                                }
                            }

                        }
                    }
                )
            }

        });
});


app.post("/removeItemFromCart",(req,res)=>{
    const itemId = req.body.itemId;
    const userId = req.session.user[0].id;

    db.query(
        "SELECT * FROM usercart WHERE user_id = ? AND item_id = ?",
        [userId,itemId],
        (err,result)=>{
            if(result.length > 0){
                db.query(
                    "UPDATE usercart SET quantity= quantity-1 WHERE user_id = ? AND item_id = ?",
                    [userId,itemId],
                    (err,result)=>{
                        db.query(
                            "SELECT quantity FROM usercart WHERE user_id = ? AND item_id = ?",
                            [userId,itemId],
                            (err,result)=>{
                                if(result[0].quantity === 0 || result[0].quantity < 0){
                                    db.query(
                                        "DELETE FROM usercart WHERE user_id = ? AND item_id = ?",
                                        [userId,itemId],
                                        (err,result)=>{
                                        });
                                }
                            });
                    }
                );
            }
        }
    );
});

app.post("/getCartContent",(req,res)=>{
    const userId = req.session.user[0].id;

        db.query(
            "SELECT * FROM usercart WHERE user_id=?",
            userId,
            (err, resultOne) => {
                const tableLen = resultOne.length;
                const tableOfObject = [];
                for (let i = 0; i < tableLen; i++) {
                    //1. Get item ID
                    db.query(
                        "SELECT * FROM items WHERE id = ?",
                        resultOne[i].item_id,
                        (err, resultTwo) => {
                            //resultOne - result from table 'usercart'
                            //resultTwo - result from table 'items'
                            function base64_encode(file) {
                                let bitmap = fs.readFileSync(file);
                                return new Buffer.from(bitmap).toString('base64');
                            }

                            //imageItemBase64 -> image of product base 64 string
                            let imageItemBase64 = base64_encode("./productImages/" + resultOne[i].item_id + ".png");
                            tableOfObject.push({
                                itemId: resultTwo[0].id,
                                itemName: resultTwo[0].name,
                                itemImage64: imageItemBase64,
                                quantity: resultOne[i].quantity,
                                price: resultTwo[0].price
                            });
                            //Last iteration
                            if (i === tableLen - 1) {
                                //console.log(tableOfObject);
                                res.send(tableOfObject);
                            }
                        }
                    );
                }
            }
        );


});


app.get("/getUserOrders",(req,res)=>{
    const userId = req.session.user[0].id;
    db.query(
        "SELECT * FROM orderdetails WHERE user_id=?",
        userId,
        (err,result)=>{
            res.send(result);
        }
    )
});


app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});

app.post("/logout", (req,res)=>{
   if(req.session.user){
       req.session.destroy()
   }
});

app.post("/getImage", (req,res)=>{
    const imgNum = req.body.imgNum;

    function base64_encode(file) {
        let bitmap = fs.readFileSync(file);
        return new Buffer.from(bitmap).toString('base64');
    }

    let base64str = base64_encode( "./productImages/"+imgNum+".png");

    res.send({imgBase64:base64str});
});

app.get("/getItemCategory",(req,res)=>{
    db.query(
        "SELECT name FROM category",
        (err,result)=>{
            res.send(result);
        })
});


app.get("/getNumberOfImages",(req,res)=>{
    fs.readdir("./productImages", (err, files) => {
        let productImageNumber = [];
        files.forEach(file => {
            file = file.toString();
            file = file.slice(0, -3);
            file = parseInt(file);
            productImageNumber.push(file);
        });

        res.send([
            productImageNumber[Math.floor(Math.random() * productImageNumber.length)],
            productImageNumber[Math.floor(Math.random() * productImageNumber.length)],
            productImageNumber[Math.floor(Math.random() * productImageNumber.length)],
            productImageNumber[Math.floor(Math.random() * productImageNumber.length)]
            ]);
    });
});


app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        username,
        (err,result)=>{
            if(err){
                res.send({err:err});
            }
            if(result.length > 0){
                bcrypt.compare(password, result[0].password,(error, response)=>{
                   if(response){
                       req.session.user = result; //creating a session
                       //console.log(req.session.user);
                       res.send(result);
                   }
                   else{
                       res.send({message: "Wrong username/password combination!"})
                   }
                });
            }
            else{
                res.send({message: "User doesn't exist!"})
            }
        }
    )
});

app.listen(3001,()=>{
    console.log("server is running!");
});


app.post("/addMoney", (req, res)=>{
    const amount=req.body.amount;
    const userId = req.session.user[0].id;
    db.query(
        "update bank set value = value + ? where users_id = ?",
        [amount,userId],
        (err,result)=>{
            console.log(err)
        }
    )
});

app.post("/subMoney", (req, res)=>{
    const amount=req.body.amount;
    const userId = req.session.user[0].id;
    db.query(
        "update bank set value = value - ? where users_id = ?",
        [amount,userId],
        (err,result)=>{
            console.log(err)
            console.log(amount)
        }
    )
    });

app.get("/accountInfo", (req, res) => {
    const userId = req.session.user[0].id;
    db.query(
        "SELECT * FROM users WHERE id = ?",
        userId,
        (err,result1)=>{
            db.query(
                "SELECT value FROM bank WHERE users_id = ?",
                userId,
                (err,result2)=>{
                    res.send([{res1: result1[0], res2: result2[0]}])
                });
        }
    )
});

app.post("/clearCart",(req,res)=>{
    const userId = req.session.user[0].id;
    const itemId = req.body.itemId;
    db.query(
        "DELETE FROM usercart WHERE user_id=? AND item_id=?",
        [userId,itemId],
        (err,result)=>{
        }
    );
});

app.post("/message/send", (req, res)=>{
    const message = req.body.messageText;
    const idFrom = req.body.idFrom;
    const idTo = req.body.idTo;

    db.query(
        "INSERT INTO message (contents, UsersFrom, UsersTo) VALUES (?,?,?)",
        [message, idFrom, idTo],
        (err, result) => {
            console.log(err);
        }
    )
});


// getting full chat with selected user
app.post("/message/get", (req, res) => {
    const idFrom = req.body.idFrom;
    const idTo = req.body.idTo;

    db.query(
        "SELECT message.id, message.contents, message.UsersFrom, message.UsersTo, users.username " +
        "FROM message " +
        "LEFT JOIN users ON message.UsersFrom = users.id " +
        "AND ((message.UsersFrom = ? AND message.UsersTo = ?) OR (message.UsersFrom = ? AND message.UsersTo = ?)) " +
        "WHERE users.username IS NOT NULL " +
        "ORDER BY message.id ",
        [idFrom, idTo, idTo, idFrom],
        (err, result) => {
            console.log(err);
            console.log(result);
            res.send({result});
        }
    )
});

// Getting list of people that user had a conversation with
app.post("/message/getlist", (req, res) => {
    const idFrom = req.body.idFrom;
    db.query("SELECT message.id, message.UsersFrom, message.UsersTo, users.username " +
            "FROM message " +
            "JOIN users ON message.UsersFrom = users.id " +
            "AND message.UsersTo = ? " +
            "GROUP BY users.username " +
            "ORDER BY message.id",
            idFrom,
            (err, result) => {
                //console.log(err)
                res.send({result});
            })
});


// Get searched user id
app.post("/message/findUser", (req, res) => {
    const name = req.body.name;

    db.query("SELECT * FROM users WHERE username = ?",
        name,
        (err, result) => {
            res.send({result})
            console.log(result);
        })
})

app.get("/getNumberOfOpinions", (req, res) => {
    const userId = req.session.user[0].id;

    db.query("SELECT count(id) as number FROM message WHERE UsersTo = ?",
    userId,
        (err, result) => {
            res.send({result})
        })

    })

    app.post("/setVerified", (req, res) => {
        const userId = req.session.user[0].id;
        const number = req.body.number;
        console.log(number + "siema")
        if(number>0){
        if(number>2){
        db.query("update users set isVerified = 1 where id = ?",
        userId,
            (err, result) => {
                res.send({result})
            })
        }
        else{
            db.query("update users set isVerified = 0 where id = ?",
            userId,
                (err, result) => {
                    res.send({result})
                })
            }
        }
        })

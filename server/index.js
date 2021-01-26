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

const app = express();

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
                            }
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

app.post("/addItemToCart",(req,res)=>{
    const itemId = req.body.itemId;
    const userId = req.session.user[0].id;
    const quantity = 1;

    db.query(
        "SELECT * FROM usercart WHERE user_id = ? AND item_id = ?",
        [userId,itemId],
        (err,result)=>{
            if(result.length > 0){
                //mamy juz taki item w bazie, zwiekszamy quantity
                db.query(
                    "UPDATE usercart SET quantity= quantity+1 WHERE user_id = ? AND item_id = ?",
                    [userId,itemId],
                    (err,result)=>{}
                );
            }
            else{
                //nie ma takiego itemu w bazie, dodajemy
                db.query(
                    "INSERT INTO usercart (user_id, item_id, quantity) VALUES (?,?,?)",
                    [userId, itemId, quantity],
                    (err, result) => {
                    }
                );
            }
        }
    );
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
            for(let i= 0; i < tableLen; i++){
                //1. Get item ID
                db.query(
                    "SELECT * FROM items WHERE id = ?",
                    resultOne[i].item_id,
                    (err,resultTwo)=>{
                        //resultOne - result from table 'usercart'
                        //resultTwo - result from table 'items'
                        function base64_encode(file) {
                            let bitmap = fs.readFileSync(file);
                            return new Buffer.from(bitmap).toString('base64');
                        }
                        //imageItemBase64 -> image of product base 64 string
                        let imageItemBase64 = base64_encode( "./productImages/"+resultOne[i].item_id+".png");
                        tableOfObject.push({
                            itemId: resultTwo[0].id,
                            itemName: resultTwo[0].name,
                            itemImage64: imageItemBase64,
                            quantity: resultOne[i].quantity,
                            price: resultTwo[0].price
                        });
                        //Last iteration
                        if(i===tableLen-1){
                            //console.log(tableOfObject);
                            res.send(tableOfObject);
                        }
                    }
                );
            }
        }

    );

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
            console.log(result);
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


app.get("/accountInfo", (req, res) => {
    const userId = req.session.user[0].id;

    db.query(
        "SELECT * FROM users WHERE id = ?",
        userId,
        (err,result)=>{
            res.send(result[0]);
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




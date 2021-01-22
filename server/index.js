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
    const username = req.body.username;
    const password = req.body.password;

    console.log("username= " + username);
    console.log("password= " + password);

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query(
            "INSERT INTO login_system (username, password, role) VALUES (?,?,?)",
            [username, hash, "user"],
            (err, result) => {
                console.log(err);
            }
        )
    });
})

app.post("/addNewAuctions",(req,res)=>{

    const itemName = req.body.itemName;
    const itemCategory = req.body.itemCategory;
    const itemDesc = req.body.itemDesc;
    const itemQuant = req.body.itemQuant;
    const itemPrice = req.body.itemPrice;
    const imgBase64 = req.body.imgBase64;

    let imageTitle = "image.png";

    //Input to db
    db.query(
        "INSERT INTO items (name, price, description, quantity) VALUES (?,?,?,?)",
        [itemName, itemPrice, itemDesc, itemQuant],
        (err, result) => {
            console.log(err);
            imageTitle = result.insertId +".png"
            console.log(imageTitle);
            fs.writeFile("./productImages/"+imageTitle+"", imgBase64, 'base64', function(err) {
                console.log(err);
            });
        }
    );

});

app.get("/getAllAuctions",(req,res)=>{
    db.query(
        "SELECT * FROM items",
        (err, result) => {
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

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM login_system WHERE username = ?",
        username,
        (err,result)=>{
            if(err){
                res.send({err:err});
            }
            if(result.length > 0){
                bcrypt.compare(password, result[0].password,(error, response)=>{
                   if(response){
                       req.session.user = result; //creating a session
                       console.log(req.session.user);
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
    db.query(
        "SELECT username FROM login_system",
        (err,result)=>{
            console.log("zadzialalem");
            if(err){
                res.send({err:err});
            }
            if(result.length > 0){
            res.send({result});
            }
        }
    )
        res.send({ loggedIn: false });
    
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




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
app.post("/message/get", (req, res) =>{
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
            [idFrom],
            (err, result) => {
                res.send({result});
                //console.log(result);
            })
});


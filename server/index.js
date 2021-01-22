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

app.get("/message/get", (req, res) =>{
    const idFrom = req.body.idFrom;
    const idTo = req.body.idTo;

    db.query(
        "SELECT message.id, message.contents, message.UsersFrom,users.username, message.UsersTo, users.username " +
        "FROM message " +
        "LEFT JOIN users ON message.UsersFrom = users.id " +
        "AND ((message.UsersFrom = 1 AND message.UsersTo = 2) OR (message.UsersFrom = 2 AND message.UsersTo = 1)) " +
        "ORDER BY message.id ",
        [1, 2, 2, 1],
        (err, result) => {
            console.log(err);
            console.log(result);
            res.send({result});
        }
    )
});


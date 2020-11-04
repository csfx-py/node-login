//jshint esversion:6

//----------declarations----------
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

mongoose.connect("mongodb://localhost:27017/loginDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    email: String,
    pass: String,
});

const User = new mongoose.model("User", userSchema);

//----------get routes----------
app.get('/', (req, res) => {
    res.render("home");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/register', (req, res) => {
    res.render("register");
});

//----------post routes----------
app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        pass: md5(req.body.password),
    })

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    })
});

app.post('/login', (req, res) => {
    const userName = req.body.username;
    const passWord = md5(req.body.password);

    User.findOne({ email: userName }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser.pass === passWord) {
                res.render("secrets");
            } else {
                console.log("wrong pass");
            }
        }
    })
});

//----------listen----------
app.listen(PORT, () => {
    console.log("Listening on port 3000");
});
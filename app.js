var express = require("express");
var app = express();
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb",
});
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//connection.connect();

connection.query("SELECT * from mytable1", function(err, rows, fields) {
    if (!err) console.log("The solution is: ", rows);
    else console.log("Error while performing Query.");
});

//connection.end();
// Binding express app to port 3000
app.listen(3000, function() {
    console.log("Node server running @ http://localhost:3000");
});

app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use("/style", express.static(__dirname + "/style"));

app.get("/", function(req, res) {
    res.render("pages/index");
});

app.get("/signin", function(req, res) {
    res.render("pages/signin");
});
app.get("/signup", function(req, res) {
    res.render("pages/signup");
});
app.get("/showSignUpPage", function(req, res) {
    res.render("pages/index");
});
app.get("/showProfilePage", function(req, res) {
    res.render("pages/index");
});
app.get("/showModsPage", function(req, res) {
    res.render("pages/index");
});
app.get("/showContactPage", function(req, res) {
    res.render("pages/index");
});
app.get("/showAboutPage", function(req, res) {
    res.render("pages/index");
});

app.post("/myaction", function(req, res) {
    console.log("req.body");
    console.log(req.body);
    var record = { email: req.body.email, pass: req.body.pass };

    //connection.connect();
    connection.query("INSERT INTO mytable1 SET ?", record, function(err, res) {
        if (err) throw err;
        console.log("Last record insert id:", res.insertId);
    });

    res.redirect("/message");
    //connection.end();

    res.end();
});

app.post("/verifyuser", function(req, res) {
    console.log("checking user in database");
    console.log(req.body.pass);
    var selectString = 'SELECT COUNT(email) FROM mytable1 WHERE email="' + req.body.email + '" AND pass="' + req.body.pass + '" ';

    connection.query(selectString, function(err, results) {
        console.log(results);
        var string = JSON.stringify(results);
        console.log(string);
        //this is a walkaround of checking if the email pass combination is 1 or not it will fail if wrong pass is given
        if (string === '[{"COUNT(email)":1}]') {
            res.redirect("/loggedin");
        }
        if (string === '[{"COUNT(email)":0}]') {
            res.redirect("/showSignInPageretry");
        }
    });
});
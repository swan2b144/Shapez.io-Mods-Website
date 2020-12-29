var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//connection.end();
// Binding express app to port 3000
app.listen(3007, function() {
    console.log("Node server running @ http://localhost:3007");
});

app.use("/static", express.static(__dirname + "/public"));
app.get("/", function(req, res) {
    req.user = "";
    res.render("pages/index", { user: req.user, title: "Shapez.io - Mods" });
});

app.get("/profile", function(req, res) {
    res.render("pages/profile", { user: req.user, title: "Shapez.io - Profile" });
});

app.get("/mods", function(req, res) {
    res.render("pages/mods", { user: req.user, title: "Shapez.io - Mods" });
});

app.get("/contact", function(req, res) {
    res.render("pages/contact", { user: req.user, title: "Shapez.io - Contact" });
});

app.get("/about", function(req, res) {
    res.render("pages/about", { user: req.user, title: "Shapez.io - About" });
});

app.use(function(req, res, next) {
    if (req.accepts("html")) {
        res.render("pages/notfound", { user: req.user, title: "Shapez.io - Not found" });
        return;
    }
});
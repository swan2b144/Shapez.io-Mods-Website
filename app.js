const express = require("express");
const bodyParser = require("body-parser");
const device = require("device");
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
    if (device(req.headers["user-agent"]).is("phone")) res.render("mobile/pages/index", { user: req.user, title: "Shapez.io - Mods" });
    else res.render("desktop/pages/index", { user: req.user, title: "Shapez.io - Mods" });
});

app.get("/profile", function(req, res) {
    if (device(req.headers["user-agent"]).is("phone")) res.render("mobile/pages/profile", { user: req.user, title: "Shapez.io - Profile" });
    else res.render("desktop/pages/profile", { user: req.user, title: "Shapez.io - Profile" });
});

app.get("/mods", function(req, res) {
    if (device(req.headers["user-agent"]).is("phone")) res.render("mobile/pages/mods", { user: req.user, title: "Shapez.io - Mods" });
    else res.render("desktop/pages/mods", { user: req.user, title: "Shapez.io - Mods" });
});

app.get("/contact", function(req, res) {
    if (device(req.headers["user-agent"]).is("phone")) res.render("mobile/pages/contact", { user: req.user, title: "Shapez.io - Contact" });
    else res.render("desktop/pages/contact", { user: req.user, title: "Shapez.io - Contact" });
});

app.get("/about", function(req, res) {
    if (device(req.headers["user-agent"]).is("phone")) res.render("mobile/pages/about", { user: req.user, title: "Shapez.io - About" });
    else res.render("desktop/pages/about", { user: req.user, title: "Shapez.io - About" });
});

app.use(function(req, res, next) {
    if (req.accepts("html")) {
        if (device(req.headers["user-agent"]).is("phone")) res.render("mobile/pages/notfound", { user: req.user, title: "Shapez.io - Not found" });
        else res.render("desktop/pages/notfound", { user: req.user, title: "Shapez.io - Not found" });
        return;
    }
});
require("./api/v1/auth/discord");

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const device = require("device");

var app = express();
app.set("view engine", "ejs");
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Auth
//Init session
app.use(
    session({
        secret: `ae 26 77 8a c9 ca dd 82 b8 93 aa 28 ce 95 9f 34 
        ef cc 2e 16 88 8 f 80 dc e2 c8 b5 f8 bc ed e2 7 b
        57 67 97 1 f e6 51 b3 04 27 2e 81 e2 5 b 59 ae ae
        8 f fd 9 c 7 a e2 18 fd 23 fc 73 8 f 73 3 f 4 b 66 21
        b7 12 b7 47 b6 2 b e3 54 87 c9 fd a1 38 33 f5 4e
        ff e9 8 b d3 ed fd db 19 d6 e9 cc cc 56 11 03 9 d
        71 b1 49 b6 `, //Random bytes
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, //One day
        saveUninitialized: true,
        resave: false,
    })
);
//Init passport
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1", require("./api/v1"));

// Binding express app to port 3007
app.listen(3007, function() {
    console.log("Node server running @ http://localhost:3007");
});

app.use("/static", express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.render("pages/index", { user: req.user, title: "Shapez.io - Mods" });
});

app.get("/profile", function(req, res) {
    res.render("pages/profile", { user: req.user, title: "Shapez.io - Profile" });
});

app.get("/mods", function(req, res) {
    res.render("pages/mods", { user: req.user, title: "Shapez.io - Mods" });
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
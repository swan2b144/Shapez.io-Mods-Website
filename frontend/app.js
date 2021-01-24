require("dotenv").config();
require("./api/v1/auth/discord");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const languages = require("./api/v1/languages");
const dashboard = require("./dashboard/dashboard");
const mods = require("./mods");
const user = require("./user");
const mod = require("./mod");
const modpack = require("./modpack");
const { findUser } = require("./api/v1/database/users");
let findUserPromise = (data) =>
    new Promise((resolve, reject) =>
        findUser(data, (err, user) => {
            if (user) resolve(user);
            if (err) reject(err);
            reject();
        })
    );

var app = express();
app.set("view engine", "ejs");
app.use(
    express.json({
        limit: "1mb",
    })
); // for parsing application/json
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
app.listen(process.env.PORT, function() {
    console.log(`Node server running @ ${process.env.HOST}${process.env.ENABLE_PORT === "true" ? ":" + process.env.PORT : ""}`);
});

app.use("/static", express.static(__dirname + "/public"));
app.use("/v", express.static(__dirname + "/play/v"));
//Update user and language
app.use(async(req, res, next) => {
    if (!req.language) req.language = languages.languages[languages.baseLanguage];
    if (req.user) {
        let baseLanguage = JSON.parse(JSON.stringify(languages.languages[languages.baseLanguage]));
        let user = await findUserPromise({ discordId: req.user.discordId });
        if (user) req.user = user;
        languages.matchDataRecursive(baseLanguage, languages.languages[req.user.settings.language]);
        req.language = baseLanguage;
    }
    next();
});

//Put /build/index.html in /play
//Put other files in /play/v/<commit hash>/
app.get("/play", function(req, res) {
    if (!req.user) return res.redirect("/api/v1/auth/login");
    res.sendFile(__dirname + "/play/index.html");
});

app.get("/", function(req, res) {
    res.render("pages/index", { user: req.user, language: req.language, title: "Shapez.io - Mods" });
});

app.get("/mods", function(req, res) {
    return mods.getMods(req, res);
});

app.get("/about", function(req, res) {
    res.render("pages/about", { user: req.user, language: req.language, title: "Shapez.io - About" });
});

app.get("/dashboard/:category?", function(req, res) {
    if (!req.user) {
        res.redirect("/forbidden");
        return;
    }

    return dashboard.getDashbaord(req, res);
});

app.get("/user/:id", function(req, res) {
    return user.getUser(req, res);
});

app.get("/mod/:id", function(req, res) {
    return mod.getMod(req, res);
});

app.get("/modpack/:id", function(req, res) {
    return modpack.getModpack(req, res);
});

app.get("/forbidden", function(req, res) {
    res.render("pages/forbidden", { user: req.user, language: req.language, title: "Shapez.io - Forbidden" });
});

app.use(function(req, res, next) {
    if (req.accepts("html")) {
        res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
        return;
    }
});
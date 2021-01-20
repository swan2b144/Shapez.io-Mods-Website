require("./api/v1/auth/discord");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const usersDB = require("./api/v1/database/users");
const languages = require("./api/v1/languages");
const dashboard = require("./dashboard/dashboard");

const PORT = 3007;
const HOST = "http://localhost";

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
app.listen(PORT, function() {
    console.log(`Node server running @ ${HOST}:${PORT}`);
});

app.use("/static", express.static(__dirname + "/public"));
//Update language
app.use((req, res, next) => {
    if (!req.language) req.language = languages.languages[languages.baseLanguage];
    if (req.user) {
        let baseLanguage = Object.assign({}, languages.languages[languages.baseLanguage]);
        languages.matchDataRecursive(baseLanguage, languages.languages[req.user.settings.language]);
        req.language = baseLanguage;
    }
    next();
});

app.get("/", function(req, res) {
    res.render("pages/index", { user: req.user, language: req.language, title: "Shapez.io - Mods" });
});

app.get("/profile", function(req, res) {
    res.render("pages/profile", { user: req.user, language: req.language, title: "Shapez.io - Profile" });
});

app.get("/mods", function(req, res) {
    res.render("pages/mods", {
        user: req.user,
        language: req.language,
        title: "Shapez.io - Mods",
        //TODO: read from data base
        modOTW: {
            id: "c56721f4-7907-4882-a67b-2dc221265c54",
            authors: [{
                    id: 337667762484674572,
                    username: "Shrimp The Neko",
                },
                {
                    id: 324243324342324234,
                    username: "Shadow",
                },
                {
                    id: 359712922877952000,
                    username: "Thomas (DJ1TJOO)",
                },
            ],
            images: ["/static/images/mod_test/cube.gif", "/static/images/mod_test/colorz.gif", "/static/images/mod_test/counter.gif"],
        },
    });
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
    usersDB.findUser({ discordId: req.params.id }, (err, user) => {
        if (err) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        if (!user) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        res.render("pages/user", { user: req.user, language: req.language, requestedUser: user, description: format(user.description), title: "Shapez.io - " + user.username });
    });
});

function format(inputText) {
    //Escape html
    inputText = inputText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    inputText = inputText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    inputText = inputText.replace(/==(.*?)==/g, "<h1>$1</h1>");
    inputText = inputText.replace(/-=(.*?)=-/g, "<h2>$1</h2>");
    inputText = inputText.replace(/=-(.*?)-=/g, "<h3>$1</h3>");
    inputText = inputText.replace(/__(.*?)__/g, "<u>$1</u>");
    inputText = inputText.replace(/~~(.*?)~~/g, "<i>$1</i>");
    inputText = inputText.replace(/--(.*?)--/g, "<del>$1</del>");
    inputText = inputText.replace(/```([a-z]*)(.*?)```/gms, (match, group1, group2, offset, input_string) => {
        return "<pre class='" + group1 + "'><code style='background-color: #535866; margin: 0;' class='" + group1 + "'>" + group2.trim() + "</code></pre>";
    });
    inputText = inputText.replace(/---/g, "<hr>");
    inputText = inputText.replace(/(?:\r\n|\r|\n)/g, "<br>");

    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

app.get("/forbidden", function(req, res) {
    res.render("pages/forbidden", { user: req.user, language: req.language, title: "Shapez.io - Forbidden" });
});

app.use(function(req, res, next) {
    if (req.accepts("html")) {
        res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
        return;
    }
});
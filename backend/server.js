const express = require("express");
const discord = require("discord-oauth2");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", require("./api"));

app.listen(3009, () => {
    console.log("Running on http://localhost:3009");
});
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    let connection = require("../database").getConnection();
    connection.query("select * from users", function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        results.map((user) => {
            user.settings = JSON.parse(user.settings);
            return user;
        });

        return res.status(200).send({
            status: 200,
            data: results,
        });
    });
    connection.end();
});

router.post("/", (req, res) => {
    let token = " "; //Not need it yet so not going to store
    let discordId = req.body.discordId;
    let email = req.body.email;
    let username = req.body.username;
    let tag = req.body.tag;
    if (!token || !discordId || !username || !email || !tag)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let connection = require("../database").getConnection();
    connection.query(`select * from users WHERE id='${discordId}'`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        if (results.length > 0)
            return res.status(409).send({
                status: 409,
                error: "Conflict",
            });

        connection.query(`INSERT INTO users (id, email, username, tag, token) VALUES ('${discordId}', '${email}', '${username}', '${tag}', '${token}')`, function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(501).send({
                    status: 501,
                    error: "Internal server error",
                });
            }

            connection.query(`select * from users WHERE id='${discordId}'`, function(error, results, fields) {
                if (error) {
                    console.log(error);
                    return res.status(501).send({
                        status: 501,
                        error: "Internal server error",
                    });
                }

                if (results.length < 1)
                    return res.status(404).send({
                        status: 404,
                        error: "Not found",
                    });

                results.map((user) => {
                    user.settings = JSON.parse(user.settings);
                    return user;
                });

                return res.status(200).send({
                    status: 200,
                    data: results[0],
                });
            });
            connection.end();
        });
    });
});

router.get("/:id", (req, res) => {
    let connection = require("../database").getConnection();
    connection.query(`select * from users WHERE id='${req.params.id}'`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        if (results.length < 1)
            return res.status(404).send({
                status: 404,
                error: "Not found",
            });

        results.map((user) => {
            user.settings = JSON.parse(user.settings);
            return user;
        });

        return res.status(200).send({
            status: 200,
            data: results[0],
        });
    });
    connection.end();
});

router.patch("/:id", (req, res) => {
    let token = req.body.token;
    let email = req.body.email;
    let username = req.body.username;
    let tag = req.body.tag;
    let settings = req.body.settings;
    let verified = req.body.verified;
    let seen = req.body.seen;
    let role = req.body.role;
    if (!token && !email && !username && !tag && !settings && !verified && !seen && !role)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let values = "";
    if (token) values += ` token = '${token}'`;
    if (email) values += ` email = '${email}'`;
    if (username) values += ` username = '${username}'`;
    if (tag) values += ` tag = '${tag}'`;
    if (settings) values += ` settings = '${settings}'`;
    if (verified) values += ` verified = '${verified}'`;
    if (seen) values += ` seen = '${seen}'`;
    if (role) values += ` role = '${role}'`;

    let connection = require("../database").getConnection();
    connection.query(`UPDATE users SET${values} WHERE id='${req.params.id}'`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from users WHERE id='${req.params.id}'`, function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(501).send({
                    status: 501,
                    error: "Internal server error",
                });
            }

            if (results.length < 1)
                return res.status(404).send({
                    status: 404,
                    error: "Not found",
                });

            results.map((user) => {
                user.settings = JSON.parse(user.settings);
                return user;
            });

            return res.status(200).send({
                status: 200,
                data: results[0],
            });
        });
        connection.end();
    });
});

router.delete("/:id", (req, res) => {
    let connection = require("../database").getConnection();
    connection.query(`select * from users WHERE id='${req.params.id}'`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        if (results.length < 1)
            return res.status(404).send({
                status: 404,
                error: "Not found",
            });

        results.map((user) => {
            user.settings = JSON.parse(user.settings);
            return user;
        });

        const user = results[0];

        connection.query(`delete from users WHERE id='${req.params.id}'`, function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(501).send({
                    status: 501,
                    error: "Internal server error",
                });
            }

            return res.status(200).send({
                status: 200,
                data: user,
            });
        });
        connection.end();
    });
});

module.exports = router;
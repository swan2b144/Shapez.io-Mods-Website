const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    let connection = require("../database").getConnection();
    connection.query("select * from comments", function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        return res.status(200).send({
            status: 200,
            data: results,
        });
    });
    connection.end();
});

router.post("/", (req, res) => {
    let postId = req.body.postId;
    let modId = req.body.modId;
    let userId = req.body.userId;
    let text = req.body.text;
    if (!userId || (!modId && !postId) || !text)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let connection = require("../database").getConnection();
    connection.query(`INSERT INTO comments (user_id, text${modId ? ", mod_id" : ""}${postId ? ", post_id" : ""}) VALUES ('${userId}', '${text}'${modId ? ", '" + modId + "'" : ""}${postId ? ", '" + postId + "'" : ""})`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from comments WHERE id='${results.insertId}'`, function(error, results, fields) {
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

            return res.status(200).send({
                status: 200,
                data: results[0],
            });
        });
        connection.end();
    });
});

router.get("/:id", (req, res) => {
    let connection = require("../database").getConnection();
    connection.query(`select * from comments WHERE id='${req.params.id}'`, function(error, results, fields) {
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

        return res.status(200).send({
            status: 200,
            data: results[0],
        });
    });
    connection.end();
});

router.patch("/:id", (req, res) => {
    let text = req.body.text;
    let likes = req.body.likes;
    if (!text && !likes)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let values = "";
    if (text) text += ` text = '${text}'`;
    if (likes) likes += ` likes = '${likes}'`;

    let connection = require("../database").getConnection();
    connection.query(`UPDATE comments SET${values} WHERE id='${req.params.id}'`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from comments WHERE id='${req.params.id}'`, function(error, results, fields) {
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
    connection.query(`select * from comments WHERE id='${req.params.id}'`, function(error, results, fields) {
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

        const comment = results[0];

        connection.query(`delete from comments WHERE id='${req.params.id}'`, function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(501).send({
                    status: 501,
                    error: "Internal server error",
                });
            }

            return res.status(200).send({
                status: 200,
                data: comment,
            });
        });
        connection.end();
    });
});

module.exports = router;
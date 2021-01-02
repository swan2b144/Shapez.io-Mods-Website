const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    let connection = require("../database").getConnection();
    connection.query("select * from posts", function(error, results, fields) {
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
    let userId = req.body.userId;
    let text = req.body.text;
    let photos = req.body.photos;
    if (!user_id || !text)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let connection = require("../database").getConnection();
    connection.query(`INSERT INTO posts (user_id, text${photos ? ", photos" : ""}) VALUES ('${userId}', '${text}'${photos ? ", '" + photos + "'" : ""})`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from posts WHERE id='${results.insertId}'`, function(error, results, fields) {
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
    connection.query(`select * from posts WHERE id='${req.params.id}'`, function(error, results, fields) {
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
    let photos = req.body.photos;
    let likes = req.body.likes;
    let seen = req.body.seen;
    if (!text && !likes && !seen && !photos)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let values = "";
    if (text) values += ` token = '${text}'`;
    if (photos) values += ` seen = '${photos}'`;
    if (likes) values += ` email = '${likes}'`;
    if (seen) values += ` seen = '${seen}'`;

    let connection = require("../database").getConnection();
    connection.query(`UPDATE posts SET${values} WHERE id='${req.params.id}'`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from posts WHERE id='${req.params.id}'`, function(error, results, fields) {
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
    connection.query(`select * from posts WHERE id='${req.params.id}'`, function(error, results, fields) {
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

        const post = results[0];

        connection.query(`delete from posts WHERE id='${req.params.id}'`, function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(501).send({
                    status: 501,
                    error: "Internal server error",
                });
            }

            return res.status(200).send({
                status: 200,
                data: post,
            });
        });
        connection.end();
    });
});

module.exports = router;
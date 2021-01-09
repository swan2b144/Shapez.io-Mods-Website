const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    let connection = require("../database").getConnection();
    connection.query("select * from mods", function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        results.map((mod) => {
            mod.collaberators = JSON.parse(mod.collaberators);
            return mod;
        });

        return res.status(200).send({
            status: 200,
            data: results,
        });
    });
    connection.end();
});

router.post("/", (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let page = req.body.page;
    let modid = req.body.modid;
    let collaberators = req.body.collaberators;
    let version = req.body.version;
    let gameversion = req.body.gameversion;
    let photos = req.body.photos;
    if (!title || !description || !page || !modid || !collaberators || !version || !gameversion)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let connection = require("../database").getConnection();
    connection.query(`INSERT INTO mods (title, description, page, modid, collaberators, version, gameversion${photos ? ", photos" : ""}) VALUES ('${title}', '${description}', '${page}', '${modid}', '${collaberators}', '${version}', '${gameversion}'${photos ? ", '" + photos + "'" : ""})`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from mods WHERE id='${results.insertId}'`, function(error, results, fields) {
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

            results.map((mod) => {
                mod.settings = JSON.parse(mod.settings);
                return mod;
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
    connection.query(`select * from mods WHERE id='${req.params.id}'`, function(error, results, fields) {
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

        results.map((mod) => {
            mod.collaberators = JSON.parse(mod.collaberators);
            return mod;
        });

        return res.status(200).send({
            status: 200,
            data: results[0],
        });
    });
    connection.end();
});

router.patch("/:id", (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let page = req.body.page;
    let collaberators = req.body.collaberators;
    let version = req.body.version;
    let gameversion = req.body.gameversion;
    let seen = req.body.seen;
    let likes = req.body.likes;
    let photos = req.body.photos;
    let downloads = req.body.downloads;
    if (!title && !description && !page && !collaberators && !version && !gameversion && !seen && !likes && !photos && !downloads)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let values = "";
    if (title) values += ` title = '${title}'`;
    if (description) values += ` description = '${description}'`;
    if (collaberators) values += ` collaberators = '${collaberators}'`;
    if (version) values += ` version = '${version}'`;
    if (gameversion) values += ` gameversion = '${gameversion}'`;
    if (likes) values += ` likes = '${likes}'`;
    if (seen) values += ` seen = '${seen}'`;
    if (photos) values += ` photos = '${photos}'`;
    if (downloads) values += ` downloads = '${downloads}'`;

    let connection = require("../database").getConnection();
    connection.query(`UPDATE mods SET${values} WHERE id='${req.params.id}'`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from mods WHERE id='${req.params.id}'`, function(error, results, fields) {
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

            results.map((mod) => {
                mod.settings = JSON.parse(mod.settings);
                return mod;
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
    connection.query(`select * from mods WHERE id='${req.params.id}'`, function(error, results, fields) {
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

        results.map((mod) => {
            mod.collaberators = JSON.parse(mod.collaberators);
            return mod;
        });

        const mod = results[0];

        connection.query(`delete from mods WHERE id='${req.params.id}'`, function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(501).send({
                    status: 501,
                    error: "Internal server error",
                });
            }

            return res.status(200).send({
                status: 200,
                data: mod,
            });
        });
        connection.end();
    });
});

module.exports = router;
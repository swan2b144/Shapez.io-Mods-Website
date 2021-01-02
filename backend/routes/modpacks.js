const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    let connection = require("../database").getConnection();
    connection.query("select * from modpacks", function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        results.map((modpack) => {
            modpack.collaborators = JSON.parse(modpack.collaborators);
            modpack.mods = JSON.parse(modpack.mods);
            return modpack;
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
    let collaborators = req.body.collaborators;
    let mods = req.body.mods;
    let photos = req.body.photos;
    if (!title || !description || !page || !collaborators || !mods)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let connection = require("../database").getConnection();
    connection.query(`INSERT INTO modpacks (title, description, page, collaborators, mods${photos ? ", photos" : ""}) VALUES ('${title}', '${description}', '${page}', '${collaborators}', '${mods}'${photos ? ", '" + photos + "'" : ""})`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from modpacks WHERE id='${results.insertId}'`, function(error, results, fields) {
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

            results.map((modpack) => {
                modpack.collaborators = JSON.parse(modpack.collaborators);
                modpack.mods = JSON.parse(modpack.mods);
                return modpack;
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
    connection.query(`select * from modpacks WHERE id='${req.params.id}'`, function(error, results, fields) {
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

        results.map((modpack) => {
            modpack.collaborators = JSON.parse(modpack.collaborators);
            modpack.mods = JSON.parse(modpack.mods);
            return modpack;
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
    let collaborators = req.body.collaborators;
    let mods = req.body.mods;
    let seen = req.body.seen;
    let photos = req.body.photos;
    if (!title && !description && !page && !collaborators && !mods && !seen && !photos)
        return res.status(403).send({
            status: 403,
            error: "Bad request",
        });

    let values = "";
    if (title) values += ` title = '${title}'`;
    if (description) values += ` description = '${description}'`;
    if (page) values += ` page = '${page}'`;
    if (collaborators) values += ` collaborators = '${collaborators}'`;
    if (mods) values += ` mods = '${mods}'`;
    if (seen) values += ` seen = '${seen}'`;
    if (photos) values += ` photos = '${photos}'`;

    let connection = require("../database").getConnection();
    connection.query(`UPDATE modpacks SET${values} WHERE id='${req.params.id}'`, function(error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(501).send({
                status: 501,
                error: "Internal server error",
            });
        }

        connection.query(`select * from modpacks WHERE id='${req.params.id}'`, function(error, results, fields) {
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

            results.map((modpack) => {
                modpack.collaborators = JSON.parse(modpack.collaborators);
                modpack.mods = JSON.parse(modpack.mods);
                return modpack;
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
    connection.query(`select * from modpacks WHERE id='${req.params.id}'`, function(error, results, fields) {
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

        results.map((modpack) => {
            modpack.collaborators = JSON.parse(modpack.collaborators);
            modpack.mods = JSON.parse(modpack.mods);
            return modpack;
        });

        const mpdpack = results[0];

        connection.query(`delete from modpacks WHERE id='${req.params.id}'`, function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(501).send({
                    status: 501,
                    error: "Internal server error",
                });
            }

            return res.status(200).send({
                status: 200,
                data: mpdpack,
            });
        });
        connection.end();
    });
});

module.exports = router;
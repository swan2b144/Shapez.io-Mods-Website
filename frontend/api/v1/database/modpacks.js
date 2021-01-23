const db = require("./db");
const fs = require("fs");
const path = require("path");
const mongo = require("mongodb");
var rimraf = require("rimraf");

const modpacks = (callback) => {
    db.findAll("modpacks", callback);
};

const findModpack = (data, callback) => {
    db.find("modpacks", data, callback);
};

const findMultipleModpacks = (data, callback) => {
    db.findMultiple("modpacks", data, callback);
};

const addModpack = (data, callback) => {
    db.add("modpacks", data, callback);
};

const editModpack = (id, data, callback) => {
    db.edit("modpacks", id, data, callback);
};

const removeModpack = (id, callback) => {
    db.remove("modpacks", id, callback);
};

const calcScore = (modpack) => {
    const now = new Date();
    let likes = 0;
    for (let j = 0; j < modpack.likes.length; j++) {
        const likeData = modpack.likes[j];
        if (likeData.getWeek() !== now.getWeek()) continue;
        likes++;
    }
    let downloads = 0;
    for (let j = 0; j < modpack.downloads.length; j++) {
        const downloadData = modpack.downloads[j];
        if (downloadData.getWeek() !== now.getWeek()) continue;
        downloads++;
    }
    let seen = 0;
    for (let j = 0; j < modpack.seen.length; j++) {
        const seenData = modpack.seen[j];
        if (seenData.getWeek() !== now.getWeek()) continue;
        seen++;
    }
    let rated = likes + downloads;
    let score;
    if (rated === 0 && seen === 0) score = 0;
    else score = rated / seen;
    return score;
};

const getModpacksOTW = (callback) => {
    modpacks((err, docs) => {
        if (err) callback(err, null);
        else if (docs.length > 0) {
            let modpacks = [];
            for (let i = 0; i < docs.length; i++) {
                const modpack = docs[i];
                modpacks.push({ score: calcScore(modpack), modpack: modpack });
            }
            modpacks.sort(({ score1, modpack1 }, { score2, modpack2 }) => score1 - score2);
            callback(null, modpacks);
        } else callback(null, null);
    });
};

const router = require("express").Router();

router.get("/uuid", (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    modpacks((err, modpacks) => {
        if (!err && modpacks) {
            let exists = modpacks.some((mod) => mod.modpackid === req.body.modpackid);
            if (exists) res.sendStatus(406);
            else res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });
});

router.get("/:id", (req, res) => {
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
    let data = {};
    if (/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(req.params.id)) {
        data = { modpackid: req.params.id };
    } else {
        data = { _id: new mongo.ObjectID(req.params.id) };
    }
    findModpack(data, (err, modpack) => {
        if (!err && modpack) {
            res.json(modpack);
        } else if (!err) {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    });
});
router.delete("/:id", (req, res) => {
    let data = {};
    if (/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(req.params.id)) {
        data = { modpackid: req.params.id };
    } else {
        data = { _id: new mongo.ObjectID(req.params.id) };
    }
    findModpack(data, (err, modpack) => {
        if (err) {
            return res.sendStatus(500);
        }
        if (!modpack) return res.sendStatus(404);
        if (!req.user || !req.user.verified || modpack.owner !== req.user.discordId) {
            res.sendStatus(401);
            return;
        }
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        removeModpack(req.params.id, (err, modpack) => {
            if (err) {
                return res.sendStatus(500);
            }
            if (!modpack) return res.sendStatus(500);
            let dir = path.join(__dirname, "..", "..", "..", "public", "modpacks", `${modpack.modpackid}`);
            rimraf(dir, (err) => {
                if (err) return res.sendStatus(500);
                res.sendStatus(200);
            });
        });
    });
});

router.post("/", (req, res) => {
    if (!req.user || !req.user.verified) {
        res.sendStatus(401);
        return;
    }
    if (!req.body) {
        res.sendStatus(400);
        return;
    }

    let name = req.body.name.trim();
    let description = req.body.description.trim();
    let modpackid = req.body.modpackid.trim();
    let version = req.body.version.trim();
    let page = req.body.page.trim();
    let collaberators = req.body.collaberators;
    let gameversion = req.body.gameversion;
    let photos = req.body.photos;
    let bundle = req.body.bundle;
    if (name.length < 5 || name.length > 255) {
        return res.sendStatus(400);
    }

    if (description.length < 5 || description.length > 255) {
        return res.sendStatus(400);
    }

    if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(modpackid)) {
        return res.sendStatus(400);
    }

    modpacks((err, modpacks) => {
        if (!err && modpacks) {
            let exists = modpacks.some((mod) => mod.modpackid === req.body.modpackid);
            if (exists) return res.sendStatus(406);

            if (version.length < 1 || version.length > 255 || !/[^A-Za-z0-9_.]*/.test(version.value)) {
                return res.sendStatus(400);
            }

            if (!bundle) {
                return res.sendStatus(400);
            }

            if (photos.length < 2 && photos.length > 3) {
                return res.sendStatus(400);
            }

            addModpack({
                    name: name,
                    description: description,
                    page: page,
                    modpackid: modpackid,
                    owner: req.user.discordId,
                    collaberators: collaberators,
                    currentVersion: version,
                    version: [{
                        id: version,
                        date: new Date(),
                        gameversion: gameversion,
                    }, ],
                    currentGameversion: gameversion,
                    photos: photos,
                    likes: [],
                    seen: [],
                    downloads: [],
                    verified: false,
                },
                (err, mod) => {
                    if (err) {
                        return res.sendStatus(500);
                    }
                    let dir = path.join(__dirname, "..", "..", "..", "public", "modpacks", `${modpackid}`);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    fs.writeFileSync(path.join(dir, `${version}.js`), bundle);
                    res.sendStatus(200);
                }
            );
        } else {
            res.sendStatus(500);
            return;
        }
    });
});

router.patch("/:id", (req, res) => {
    let data = {};
    if (/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(req.params.id)) {
        data = { modpackid: req.params.id };
    } else {
        data = { _id: new mongo.ObjectID(req.params.id) };
    }
    findModpack(data, (err, modpack) => {
        if (!modpack) return res.sendStatus(404);
        if (!req.user || !req.user.verified || (!req.user.roles.includes("mod") && modpack.owner !== req.user.discordId)) {
            res.sendStatus(401);
            return;
        }
        if (!req.body) {
            res.sendStatus(400);
            return;
        }

        let data = {};

        let version = req.body.version;
        if (typeof version !== "undefined") {
            if (!version.id || !version.gameversion || !version.bundle || !version.modpackid) return res.sendStatus(400);

            data.currentGameversion = version.gameversion;
            data.currentVersion = version.id;
            if (!data.$push) data.$push = {};
            data.$push.versions = {
                id: version.id,
                gameversion: version.gameversion,
                date: new Date(),
            };
        }

        let name = req.body.name;
        if (typeof name !== "undefined") {
            name = name.trim();
            if (name.length < 5 || name.length > 255) return res.sendStatus(400);

            data.name = name;
        }

        let description = req.body.description;
        if (typeof description !== "undefined") {
            description = description.trim();
            if (description.length < 5 || description.length > 255) return res.sendStatus(400);

            data.description = description;
        }

        let collaberators = req.body.collaberators;
        if (typeof collaberators !== "undefined") data.collaberators = collaberators;

        let page = req.body.page;
        if (typeof page !== "undefined") data.page = page.trim();

        let photos = req.body.photos;
        if (typeof photos !== "undefined") {
            if (photos.length < 2 && photos.length > 3) return res.sendStatus(400);
            data.photos = photos;
        }

        let verified = req.body.verified;
        if (typeof verified !== "undefined") data.verified = verified;

        editModpack(modpack._id, data, (err, mod) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if (version) {
                let dir = path.join(__dirname, "..", "..", "..", "public", "modpacks", `${version.modpackid}`);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                fs.writeFileSync(path.join(dir, `${version.id}.js`), version.bundle);
            }
            res.sendStatus(200);
        });
    });
});
module.exports = { modpacks, findModpack, addModpack, editModpack, removeModpack, getModpacksOTW, findMultipleModpacks, router };
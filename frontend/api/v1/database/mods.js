const db = require("./db");
const fs = require("fs");
const path = require("path");
const mongo = require("mongodb");
var rimraf = require("rimraf");

const mods = (callback) => {
    db.findAll("mods", callback);
};

const findMod = (data, callback) => {
    db.find("mods", data, callback);
};

const findMultipleMods = (data, callback) => {
    db.findMultiple("mods", data, callback);
};

const addMod = (data, callback) => {
    db.add("mods", data, callback);
};

const editMod = (id, data, callback) => {
    db.edit("mods", id, data, callback);
};

const removeMod = (id, callback) => {
    db.remove("mods", id, callback);
};

const getModOTW = (callback) => {
    mods((err, docs) => {
        if (err) callback(err, null);
        else if (docs.length > 0) {
            let best = { score: 0, mod: null };
            for (let i = 0; i < docs.length; i++) {
                const mod = docs[i];
                const now = new Date();
                let likes = 0;
                for (let j = 0; j < mod.likes.length; j++) {
                    const likeData = mod.likes[j];
                    if (likeData.getWeek() !== now.getWeek()) continue;
                    likes++;
                }
                let downloads = 0;
                for (let j = 0; j < mod.downloads.length; j++) {
                    const downloadData = mod.downloads[j];
                    if (downloadData.getWeek() !== now.getWeek()) continue;
                    downloads++;
                }
                let seen = 0;
                for (let j = 0; j < mod.seen.length; j++) {
                    const seenData = mod.seen[j];
                    if (seenData.getWeek() !== now.getWeek()) continue;
                    seen++;
                }
                let rated = likes + downloads;
                if (rated === 0) continue;
                let score = rated / seen;
                if (score >= bestScore) best = { score: score, mod: mod };
            }
            callback(null, best);
        } else callback(null, null);
    });
};

const router = require("express").Router();
router.delete("/:id", (req, res) => {
    findMod({ _id: new mongo.ObjectID(req.params.id) }, (err, mod) => {
        if (err) {
            return res.sendStatus(500);
        }
        if (!mod) return res.sendStatus(404);
        if (!req.user || !req.user.verified || mod.owner !== req.user.discordId) {
            res.sendStatus(401);
            return;
        }
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        removeMod(req.params.id, (err, mod) => {
            if (err) return res.sendStatus(500);

            if (!mod) return res.sendStatus(500);
            let dir = path.join(__dirname, "..", "..", "..", "public", "mods", `${mod.modid}`);
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
    let modid = req.body.modid.trim();
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

    if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(modid)) {
        return res.sendStatus(400);
    }

    mods((err, mods) => {
        if (!err && mods) {
            let exists = mods.some((mod) => mod.modid === req.body.modid);
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

            addMod({
                    name: name,
                    description: description,
                    page: page,
                    modid: modid,
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
                    let dir = path.join(__dirname, "..", "..", "..", "public", "mods", `${modid}`);
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
    findMod({ _id: new mongo.ObjectID(req.params.id) }, (err, mod) => {
        if (!mod) return res.sendStatus(404);
        if (!req.user || !req.user.verified || mod.owner !== req.user.discordId) {
            res.sendStatus(401);
            return;
        }
        if (!req.body) {
            res.sendStatus(400);
            return;
        }

        let data = {};

        let version = req.body.version;
        if (version) {
            if (!version.id || !version.gameversion || !version.bundle || !version.modid) return res.sendStatus(400);

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
        if (name) {
            name = name.trim();
            if (name.length < 5 || name.length > 255) return res.sendStatus(400);

            data.name = name;
        }

        let description = req.body.description;
        if (description) {
            description = description.trim();
            if (description.length < 5 || description.length > 255) return res.sendStatus(400);

            data.description = description;
        }

        let collaberators = req.body.collaberators;
        if (collaberators) data.collaberators = collaberators;

        let page = req.body.page;
        if (page) data.page = page.trim();

        let photos = req.body.photos;
        if (photos) {
            if (photos.length < 2 && photos.length > 3) return res.sendStatus(400);
            data.photos = photos;
        }

        editMod(req.params.id, data, (err, mod) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if (version) {
                let dir = path.join(__dirname, "..", "..", "..", "public", "mods", `${version.modid}`);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                fs.writeFileSync(path.join(dir, `${version.id}.js`), version.bundle);
            }
            res.sendStatus(200);
        });
    });
});

router.get("/uuid", (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    mods((err, mods) => {
        if (!err && mods) {
            let exists = mods.some((mod) => mod.modid === req.body.modid);
            if (exists) res.sendStatus(406);
            else res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });
});

module.exports = { mods, findMod, addMod, editMod, removeMod, getModOTW, findMultipleMods, router };
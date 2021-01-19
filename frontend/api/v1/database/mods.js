const db = require("./db");
const mods = (callback) => {
    db.findAll("mods", callback);
};

const findMod = (data, callback) => {
    db.find("mods", data, callback);
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
router.get("/uuid", (req, res) => {
    if (!req.user) {
        res.status(401).redirect("/forbidden");
        return;
    }
    if (!res.body) {
        res.sendStatus(400);
    }
    mods((err, mods) => {
        if (!err && mods) {
            let exists = mods.some((mod) => mod.id === req.body);
            if (exists) res.sendStatus(406);
            else res.sendStatus(200);
        } else {
            res.sendStatus(501);
        }
    });
});

module.exports = { mods, findMod, addMod, editMod, removeMod, getModOTW, router };
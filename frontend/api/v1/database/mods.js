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

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
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
module.exports = { mods, findMod, addMod, editMod, removeMod, getModOTW };
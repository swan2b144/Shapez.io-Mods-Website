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

const getModOTW = () => {
    let best = { score: 0, mod: null };
    const mods = db.getMods();
    for (let i = 0; i < mods.length; i++) {
        const mod = mods[i];
        let rated = mod.likes + mod.downloads;
        if (rated === 0) continue;
        let score = rated / mod.seen;
        if (score >= bestScore) best = { score: score, mod: mod };
    }
};
module.exports = { mods, findMod, addMod, editMod, removeMod, getModOTW };
const db = require("./db");
const modpacks = (callback) => {
    db.findAll("modpacks", callback);
};

const findModpack = (data, callback) => {
    db.find("modpacks", data, callback);
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

module.exports = { modpacks, findModpack, addModpack, editModpack, removeModpack };
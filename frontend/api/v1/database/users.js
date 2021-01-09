const db = require("./db");
const users = (callback) => {
    db.findAll("users", callback);
};

const findUser = (data, callback) => {
    db.find("users", data, callback);
};

const addUser = (data, callback) => {
    db.add("users", data, callback);
};

const editUser = (id, data, callback) => {
    db.edit("users", id, data, callback);
};

const removeUser = (id, callback) => {
    db.remove("users", id, callback);
};

module.exports = { users, findUser, addUser, editUser, removeUser };
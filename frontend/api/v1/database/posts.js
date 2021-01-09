const db = require("./db");
const posts = (callback) => {
    db.findAll("posts", callback);
};

const findPost = (data, callback) => {
    db.find("posts", data, callback);
};

const addPost = (data, callback) => {
    db.add("posts", data, callback);
};

const editPost = (id, data, callback) => {
    db.edit("posts", id, data, callback);
};

const removePost = (id, callback) => {
    db.remove("posts", id, callback);
};

module.exports = { posts, findPost, addPost, editPost, removePost };
const { use } = require("../auth/auth");
const db = require("./db");
const users = (callback) => {
    db.findAll("users", callback);
};

const findUser = (data, callback) => {
    db.find("users", data, callback);
};

const findMultipleUsers = (data, callback) => {
    db.findMultiple("users", data, callback);
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

const router = require("express").Router();

router.patch("/", (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    editUser(req.user._id, req.body, (err, user) => {
        if (!err && user) {
            req.user = user;
            res.sendStatus(200);
            return;
        } else {
            res.sendStatus(500);
        }
    });
});
router.get("/", (req, res) => {
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
    users((err, users) => {
        if (!err && users) {
            users = users.map((user) => {
                if (user.settings.publicTag) {
                    let { email, settings, roles, ...returnUser } = user;
                    return returnUser;
                } else {
                    let { email, settings, roles, tag, ...returnUser } = user;
                    return returnUser;
                }
            });
            res.json(users);
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
    findUser({ discordId: req.params.id }, (err, user) => {
        if (!err && user) {
            if (user.settings.publicTag) {
                let { email, settings, roles, ...returnUser } = user;
                res.json(returnUser);
                return;
            } else {
                let { email, settings, roles, tag, ...returnUser } = user;
                res.json(returnUser);
                return;
            }
        } else if (!err) {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    });
});

module.exports = { users, findUser, addUser, editUser, removeUser, findMultipleUsers, router };
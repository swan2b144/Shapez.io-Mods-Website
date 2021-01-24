const usersDB = require("./api/v1/database/users");
const modpacksDB = require("./api/v1/database/modpacks");
const format = require("./public/js/format");
let getModpack = (req, res) => {
    modpacksDB.findMod({ modpackid: req.params.id }, async(err, modpack) => {
        if (err) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        if (!modpack) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        let getUsers = () =>
            new Promise((resolve, reject) => {
                usersDB.users((err, users) => {
                    resolve(users);
                });
            });
        let users = await getUsers();
        modpack.page = format.format(modpack.page);
        mod.authors = mod.collaborators.slice();
        modpack.authors = modpack.authors.map((id) => {
            if (users) {
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    if (user.discordId === id) return { id: id, username: user.username };
                }
            }
            return { id: id, username: id };
        });
        let owner;
        if (users) {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user.discordId === modpack.owner) owner = user;
            }
        }
        if (owner) {
            modpack.authors.unshift({
                id: owner.discordId,
                username: owner.username,
            });
        }
        res.render("pages/modpack", { user: req.user, language: req.language, modpack: modpack, title: "Shapez.io - " + modpack.name });
    });
};

module.exports = { getModpack };
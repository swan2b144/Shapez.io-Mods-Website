const usersDB = require("./api/v1/database/users");
const modsDB = require("./api/v1/database/mods");
const format = require("./public/js/format");
let getMod = (req, res) => {
    modsDB.findMod({ modid: req.params.id }, async(err, mod) => {
        if (err) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        if (!mod) {
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
        mod.page = format.format(mod.page);
        mod.authors = mod.collaborators.slice();
        mod.authors = mod.authors.map((id) => {
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
                if (user.discordId === mod.owner) owner = user;
            }
        }
        if (owner) {
            mod.authors.unshift({
                id: owner.discordId,
                username: owner.username,
            });
        }
        res.render("pages/mod", { user: req.user, language: req.language, mod: mod, title: "Shapez.io - " + mod.name });
    });
};

module.exports = { getMod };
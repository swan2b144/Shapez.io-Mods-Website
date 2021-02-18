const usersDB = require("./api/v1/database/users");
const modsDB = require("./api/v1/database/mods");
const modpacksDB = require("./api/v1/database/modpacks");
const format = require("./static/js/format");
let getUser = (req, res) => {
    usersDB.findUser({ discordId: req.params.id }, (err, user) => {
        if (err) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        if (!user) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        modsDB.findMultipleMods({ $or: [{ owner: user.discordId }, { collaborators: user.discordId }] }, (err, mods) => {
            let combined = [];
            if (mods) combined = combined.concat(mods);
            modpacksDB.findMultipleModpacks({ $or: [{ owner: user.discordId }, { collaborators: user.discordId }] }, async(err, modpacks) => {
                if (modpacks) combined = combined.concat(modpacks);

                let getUsers = () =>
                    new Promise((resolve, reject) => {
                        usersDB.users((err, users) => {
                            resolve(users);
                        });
                    });

                let users = await getUsers();
                for (let i = 0; i < combined.length; i++) {
                    const mod = combined[i];
                    if (mod.collaborators) mod.authors = mod.collaborators.slice();
                    else mod.authors = [];
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
                }
                usersDB.editUser(
                    user._id, {
                        $push: {
                            seen: new Date(),
                        },
                    },
                    (err, user) => {}
                );
                res.render("pages/user", { user: req.user, language: req.language, requestedUser: user, combined: combined, description: format.format(user.description), title: "Shapez.io - " + user.username });
            });
        });
    });
};

module.exports = { getUser };
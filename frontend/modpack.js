const modpacksDB = require("./api/v1/database/modpacks");
const format = require("./public/js/format");
let getModpack = (req, res) => {
    modpacksDB.findMod({ modpackid: req.params.id }, (err, modpack) => {
        if (err) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        if (!modpack) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        modpack.page = format.format(modpack.page);
        res.render("pages/modpack", { user: req.user, language: req.language, modpack: modpack, title: "Shapez.io - " + modpack.name });
    });
};

module.exports = { getModpack };
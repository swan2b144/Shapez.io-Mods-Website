const modsDB = require("./api/v1/database/mods");
const format = require("./public/js/format");
let getMod = (req, res) => {
    modsDB.findMod({ modid: req.params.id }, (err, mod) => {
        if (err) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        if (!mod) {
            res.render("pages/notfound", { user: req.user, language: req.language, title: "Shapez.io - Not found" });
            return;
        }
        mod.page = format.format(mod.page);
        res.render("pages/mod", { user: req.user, language: req.language, mod: mod, title: "Shapez.io - " + mod.name });
    });
};

module.exports = { getMod };
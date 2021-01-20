const modsDB = require("../api/v1/database/mods");
const languages = require("../api/v1/languages");

let getMods = (req, res, discordId) => {
    return new Promise((resolve, reject) => {
        modsDB.findMultipleMods({ owner: discordId }, (err, mods) => {
            if (err) return reject(err);

            let buttons = [];
            let categories = [];
            for (let i = 0; i < mods.length; i++) {
                const mod = mods[i];
                buttons.push({
                    contentType: "button",
                    title: mod.name,
                    desc: mod.description,
                    category: `mod-${mod.modid}-${mod._id}`,
                });
                categories.push(require("./categories/mod")(req, res, mod));
            }
            resolve({
                buttons: buttons,
                categories: categories,
            });
        });
    });
};

let getDashbaord = async(req, res) => {
    let mods = await getMods(req, res, req.user.discordId);
    let categories = [require("./categories/mods")(req, res, mods), require("./categories/settings")(req, res), ...mods.categories];
    return res.render("pages/dashboard", { user: req.user, languages: languages.languages, language: req.language, title: "Shapez.io - Dashboard", categories: categories, category: req.params.category });
};

module.exports = { getDashbaord };
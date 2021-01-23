const modsDB = require("../api/v1/database/mods");
const modpacksDB = require("../api/v1/database/modpacks");
const userDB = require("../api/v1/database/users");
const languages = require("../api/v1/languages");
const mod = require("./categories/mod");

let getMod = (id) => {
    return new Promise((resolve, reject) => {
        modsDB.findMod({ modid: id }, (err, mod) => {
            if (err) return reject(err);
            resolve(mod);
        });
    });
};

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

let getModpacks = (req, res, discordId) => {
    return new Promise((resolve, reject) => {
        modpacksDB.findMultipleModpacks({ owner: discordId }, (err, modpacks) => {
            if (err) return reject(err);

            let buttons = [];
            let categories = [];
            for (let i = 0; i < modpacks.length; i++) {
                const modpack = modpacks[i];
                buttons.push({
                    contentType: "button",
                    title: modpack.name,
                    desc: modpack.description,
                    category: `modpack-${modpack.modpackid}-${modpack._id}`,
                });
                categories.push(require("./categories/modpack")(req, res, modpack));
            }
            resolve({
                buttons: buttons,
                categories: categories,
            });
        });
    });
};

let getInstances = (req, res, user) => {
    return new Promise(async(resolve, reject) => {
        if (typeof user.instances === "undefined") {
            userDB.editUser(user._id, { instances: [] }, (err, user) => {
                req.user = user;
                resolve({ buttons: [], categories: [], modCategories: [] });
            });
            return;
        }

        let buttons = [];
        let categories = [];
        let modCategories = [];
        for (let i = 0; i < user.instances.length; i++) {
            let instance = user.instances[i];
            instance.modButtons = [];
            instance.index = i;
            for (let j = 0; j < instance.mods.length; j++) {
                let modInstance = instance.mods[j];
                let mod = await getMod(modInstance.id);
                modInstance.index = j;
                instance.modButtons.push({
                    contentType: "button",
                    title: mod.name,
                    desc: mod.description,
                    category: `instance-${instance.name}-mod-${mod.modid}-${instance.index}-${modInstance.index}`,
                });
                modCategories.push(require("./categories/instance-mod")(req, res, instance, modInstance, mod));
            }
            buttons.push({
                contentType: "button",
                title: instance.name,
                desc: "",
                category: `instance-${instance.name}`,
            });
            categories.push(require("./categories/instance")(req, res, instance));
        }
        resolve({
            buttons: buttons,
            categories: categories,
            modCategories: modCategories,
        });
    });
};

let getDashbaord = async(req, res) => {
    let mods = await getMods(req, res, req.user.discordId);
    let modpacks = await getModpacks(req, res, req.user.discordId);
    let instances = await getInstances(req, res, req.user);
    let categories = [require("./categories/instances")(req, res, instances), require("./categories/mods")(req, res, mods), require("./categories/modpacks")(req, res, modpacks), require("./categories/settings")(req, res), ...mods.categories, ...modpacks.categories, ...instances.categories, ...instances.modCategories];

    if (req.user.roles.includes("mod")) {
        categories.splice(3, 0, require("./categories/verify")(req, res));
    }
    return res.render("pages/dashboard", { user: req.user, languages: languages.languages, language: req.language, title: "Shapez.io - Dashboard", categories: categories, category: req.params.category });
};

module.exports = { getDashbaord };
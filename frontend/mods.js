const usersDB = require("./api/v1/database/users");
const modsDB = require("./api/v1/database/mods");
const modpacksDB = require("./api/v1/database/modpacks");

let getMods = (req, res) => {
  modsDB.getModsOTW((err, mods) => {
    let modOTW;
    let type;
    if (mods && mods[0] && mods[0].mod) {
      modOTW = mods[0];
      type = "mod";
    }
    modpacksDB.getModpacksOTW(async (err, modpacks) => {
      let combined = [];
      if (mods) combined = combined.concat(mods);
      if (modpacks) combined = combined.concat(modpacks);
      combined.sort(({ score1, mod1 }, { score2, mod2 }) => score1 - score2);
      if (
        modpacks &&
        modpacks[0] &&
        modpacks[0].mod &&
        modpacks[0].score > modOTW.score
      ) {
        modOTW = modpacks[0];
        type = "modpack";
      }
      let getUsers = () =>
        new Promise((resolve, reject) => {
          usersDB.users((err, users) => {
            resolve(users);
          });
        });
      let users = await getUsers();
      combined = combined.map((best) => (best.mod ? best.mod : best.modpack));
      for (let i = 0; i < combined.length; i++) {
        const mod = combined[i];
        mod.authors = mod.collaborators.slice();
        mod.authors = mod.authors.map((id) => {
          if (users) {
            for (let i = 0; i < users.length; i++) {
              const user = users[i];
              if (user.discordId === id)
                return { id: id, username: user.username };
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
      if (modOTW) {
        let currentModOTW = modOTW.mod;
        let owner;
        if (users) {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user.discordId === currentModOTW.owner) owner = user;
          }
        }
        let authors = currentModOTW.collaborators.map((id) => {
          if (users) {
            for (let i = 0; i < users.length; i++) {
              const user = users[i];
              if (user.discordId === id)
                return { id: id, username: user.username };
            }
          }
          return { id: id, username: id };
        });
        if (owner) {
          authors.unshift({
            id: owner.discordId,
            username: owner.username,
          });
        }
        modOTW = {
          type: type,
          id: type === "mod" ? currentModOTW.modid : currentModOTW.modpackid,
          authors: authors,
          images: currentModOTW.photos,
          name: currentModOTW.name,
          description: currentModOTW.description,
          verified: currentModOTW.verified,
        };

        return res.render("pages/mods", {
          user: req.user,
          language: req.language,
          title: "Shapez.io - Mods",
          modOTW: modOTW,
          combined: combined,
        });
      } else {
        return res.render("pages/mods", {
          user: req.user,
          language: req.language,
          title: "Shapez.io - Mods",
          combined: combined,
        });
      }
    });
  });
};
module.exports = { getMods };

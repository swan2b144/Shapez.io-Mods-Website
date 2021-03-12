const db = require("./db");
const userDB = require("./users");
const fs = require("fs");
const path = require("path");
const mongo = require("mongodb");
var rimraf = require("rimraf");

const modpacks = (callback) => {
  db.findAll("modpacks", callback);
};

const findModpack = (data, callback) => {
  db.find("modpacks", data, callback);
};

const findMultipleModpacks = (data, callback) => {
  db.findMultiple("modpacks", data, callback);
};

const addModpack = (data, callback) => {
  db.add("modpacks", data, callback);
};

const editModpack = (id, data, callback) => {
  db.edit("modpacks", id, data, callback);
};

const removeModpack = (id, callback) => {
  db.remove("modpacks", id, callback);
};

const calcScore = (modpack) => {
  const now = new Date();
  let likes = 0;
  for (let j = 0; j < modpack.likes.length; j++) {
    const likeData = modpack.likes[j];
    if (likeData.getWeek() !== now.getWeek()) continue;
    likes++;
  }
  let downloads = 0;
  for (let j = 0; j < modpack.downloads.length; j++) {
    const downloadData = modpack.downloads[j];
    if (downloadData.getWeek() !== now.getWeek()) continue;
    downloads++;
  }
  let seen = 0;
  for (let j = 0; j < modpack.seen.length; j++) {
    const seenData = modpack.seen[j];
    if (seenData.getWeek() !== now.getWeek()) continue;
    seen++;
  }
  let rated = likes + downloads;
  let score;
  if (rated === 0 && seen === 0) score = 0;
  else score = rated / seen;
  return score;
};

Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

const getModpacksOTW = (callback) => {
  modpacks((err, docs) => {
    if (err) callback(err, null);
    else if (docs.length > 0) {
      let modpacks = [];
      for (let i = 0; i < docs.length; i++) {
        const modpack = docs[i];
        modpacks.push({ score: calcScore(modpack), modpack: modpack });
      }
      modpacks.sort((modpack1, modpack2) => modpack2.score - modpack1.score);
      callback(null, modpacks);
    } else callback(null, null);
  });
};

const router = require("express").Router();

router.get("/uuid", (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  if (!req.body) {
    res.sendStatus(400);
    return;
  }
  modpacks((err, modpacks) => {
    if (!err && modpacks) {
      let exists = modpacks.some((mod) => mod.modpackid === req.body.modpackid);
      if (exists) res.sendStatus(406);
      else res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
});

router.post("/instance", (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  if (
    !req.body ||
    !req.body.name ||
    !req.body.modpackid ||
    req.body.name.length < 5 ||
    req.body.name.length > 255
  ) {
    res.sendStatus(400);
    return;
  }

  findModpack({ modpackid: req.body.modpackid }, (err, modpack) => {
    if (modpack && !err) {
      let dir = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "static",
        "modpacks",
        `${modpack.modpackid}`
      );
      let versionFile = path.join(dir, `${modpack.currentVersion}.js`);
      const modpackFile = require(versionFile);
      if (!modpackFile || !modpackFile.mods) {
        return req.sendStatus(404);
      }

      userDB.editUser(
        req.user._id,
        {
          $push: {
            instances: {
              name: req.body.name,
              gameversion: modpack.currentGameversion,
              mods: modpackFile.mods,
            },
          },
        },
        (err, user) => {
          if (!err && user) {
            req.user = user;
            res.sendStatus(200);
            return;
          } else {
            res.sendStatus(500);
          }
        }
      );
    } else if (!err) {
      return req.sendStatus(404);
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
  let data = {};
  if (
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      req.params.id
    )
  ) {
    data = { modpackid: req.params.id };
  } else {
    data = { _id: new mongo.ObjectID(req.params.id) };
  }
  findModpack(data, (err, modpack) => {
    if (!err && modpack) {
      res.json(modpack);
    } else if (!err) {
      res.sendStatus(404);
    } else {
      res.sendStatus(500);
    }
  });
});
router.delete("/:id", (req, res) => {
  let data = {};
  if (
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      req.params.id
    )
  ) {
    data = { modpackid: req.params.id };
  } else {
    data = { _id: new mongo.ObjectID(req.params.id) };
  }
  findModpack(data, (err, modpack) => {
    if (err) {
      return res.sendStatus(500);
    }
    if (!modpack) return res.sendStatus(404);
    if (
      !req.user ||
      !req.user.verified ||
      modpack.owner !== req.user.discordId
    ) {
      res.sendStatus(401);
      return;
    }
    if (!req.body) {
      res.sendStatus(400);
      return;
    }
    removeModpack(req.params.id, (err, modpack) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (!modpack) return res.sendStatus(500);
      let dir = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "static",
        "modpacks",
        `${modpack.modpackid}`
      );
      rimraf(dir, (err) => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
      });
    });
  });
});

router.post("/", (req, res) => {
  if (!req.user || !req.user.verified) {
    res.sendStatus(401);
    return;
  }
  if (!req.body) {
    res.sendStatus(400);
    return;
  }

  let name = req.body.name.trim();
  let description = req.body.description.trim();
  let modpackid = req.body.modpackid.trim();
  let version = req.body.version.trim();
  let page = req.body.page.trim();
  let collaborators = req.body.collaborators;
  let gameversion = req.body.gameversion;
  let photos = req.body.photos;
  let bundle = req.body.bundle;
  if (name.length < 5 || name.length > 255) {
    return res.sendStatus(400);
  }

  if (description.length < 5 || description.length > 255) {
    return res.sendStatus(400);
  }

  if (
    !/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      modpackid
    )
  ) {
    return res.sendStatus(400);
  }

  modpacks((err, modpacks) => {
    if (!err && modpacks) {
      let exists = modpacks.some((mod) => mod.modpackid === req.body.modpackid);
      if (exists) return res.sendStatus(406);

      if (
        version.length < 1 ||
        version.length > 255 ||
        !/[^A-Za-z0-9_.]*/.test(version.value)
      ) {
        return res.sendStatus(400);
      }

      if (!bundle) {
        return res.sendStatus(400);
      }

      if (photos.length < 2 && photos.length > 3) {
        return res.sendStatus(400);
      }

      addModpack(
        {
          name: name,
          description: description,
          page: page,
          modpackid: modpackid,
          owner: req.user.discordId,
          collaborators: collaborators,
          currentVersion: version,
          versions: [
            {
              id: version,
              date: new Date(),
              gameversion: gameversion,
            },
          ],
          currentGameversion: gameversion,
          photos: photos,
          likes: [],
          seen: [],
          downloads: [],
          verified: false,
        },
        (err, mod) => {
          if (err) {
            return res.sendStatus(500);
          }
          let dir = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "static",
            "modpacks",
            `${modpackid}`
          );
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          fs.writeFileSync(path.join(dir, `${version}.js`), bundle);
          res.sendStatus(200);
        }
      );
    } else {
      res.sendStatus(500);
      return;
    }
  });
});

router.patch("/:id", (req, res) => {
  let data = {};
  if (
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      req.params.id
    )
  ) {
    data = { modpackid: req.params.id };
  } else {
    data = { _id: new mongo.ObjectID(req.params.id) };
  }
  findModpack(data, (err, modpack) => {
    if (!modpack) return res.sendStatus(404);
    if (req.body && req.body.seen) {
      editModpack(
        modpack._id,
        { $push: { seen: new Date() } },
        (err, modpack) => {
          if (modpack) return res.sendStatus(200);
          return res.sendStatus(500);
        }
      );
      return;
    } else if (req.body && req.body.downloads) {
      editModpack(
        modpack._id,
        { $push: { downloads: new Date() } },
        (err, modpack) => {
          if (modpack) return res.sendStatus(200);
          return res.sendStatus(500);
        }
      );
      return;
    } else if (req.body && req.body.likes) {
      editModpack(
        modpack._id,
        { $push: { likes: new Date() } },
        (err, modpack) => {
          if (modpack) return res.sendStatus(200);
          return res.sendStatus(500);
        }
      );
      return;
    } else if (
      !req.user ||
      !req.user.verified ||
      (!req.user.roles.includes("mod") && modpack.owner !== req.user.discordId)
    ) {
      return res.sendStatus(401);
    }
    if (!req.body) {
      res.sendStatus(400);
      return;
    }

    let data = {};

    let version = req.body.version;
    if (typeof version !== "undefined") {
      if (
        typeof version.id === "undefined" ||
        typeof version.modpackid === "undefined" ||
        /[<>:"\/\\\|?*\x00-\x1F]/g.test(version.id) ||
        /^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)(\..+)?$/.test(
          version.id
        )
      )
        return res.sendStatus(400);

      if (modpack.versions.find((v) => v.id === version.id)) {
        if (version.delete) {
          if (!data.$pull) data.$pull = {};
          data.$pull.versions = {
            id: version.id,
          };
        } else {
          if (
            typeof version.newId === "undefined" ||
            typeof version.index === "undefined" ||
            typeof version.gameversion === "undefined"
          )
            return res.sendStatus(400);
          data[`versions.${version.index}.id`] = version.newId;
          data[`versions.${version.index}.gameversion`] = version.gameversion;
        }
      } else {
        if (
          typeof version.bundle === "undefined" ||
          typeof version.gameversion === "undefined"
        )
          return res.sendStatus(400);
        data.currentGameversion = version.gameversion;
        data.currentVersion = version.id;
        if (!data.$push) data.$push = {};
        data.$push.versions = {
          id: version.id,
          gameversion: version.gameversion,
          date: new Date(),
        };
      }
    }

    let name = req.body.name;
    if (typeof name !== "undefined") {
      name = name.trim();
      if (name.length < 5 || name.length > 255) return res.sendStatus(400);

      data.name = name;
    }

    let description = req.body.description;
    if (typeof description !== "undefined") {
      description = description.trim();
      if (description.length < 5 || description.length > 255)
        return res.sendStatus(400);

      data.description = description;
    }

    let collaborators = req.body.collaborators;
    if (typeof collaborators !== "undefined")
      data.collaborators = collaborators;

    let page = req.body.page;
    if (typeof page !== "undefined") data.page = page.trim();

    let photos = req.body.photos;
    if (typeof photos !== "undefined") {
      if (photos.length < 2 && photos.length > 3) return res.sendStatus(400);
      data.photos = photos;
    }

    let verified = req.body.verified;
    if (typeof verified !== "undefined") data.verified = verified;

    editModpack(modpack._id, data, (err, mod) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (version) {
        let dir = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "static",
          "modpacks",
          `${version.modpackid}`
        );
        let versionFile = path.join(dir, `${version.id}.js`);
        if (version.bundle) {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          fs.writeFileSync(versionFile, version.bundle);
        } else if (version.delete && fs.existsSync(versionFile)) {
          fs.unlinkSync(versionFile);
        }
      }
      res.sendStatus(200);
    });
  });
});
module.exports = {
  modpacks,
  findModpack,
  addModpack,
  editModpack,
  removeModpack,
  getModpacksOTW,
  findMultipleModpacks,
  router,
};

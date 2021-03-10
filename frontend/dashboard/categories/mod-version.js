const versions = require("../../api/v1/version");
module.exports = (req, res, mod, version) => {
  return {
    back: `mod-${mod.modid}-${mod._id}-versions`,
    id: `mod-${mod.modid}-${mod._id}-version-${version.id}`,
    title: mod.name,
    visible: false,
    content: [
      {
        contentType: "var",
        id: `mod-${mod.modid}-version-${version.id}-index`,
        value: version.index,
      },
      {
        contentType: "form",
        content: [
          {
            type: "text",
            id: `mod-${mod.modid}-version-${version.id}-name`,
            title: req.language.dashboard.mods.content.versions.fields.version,
            classes: [],
            value: version.id,
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "select",
            id: `mod-${mod.modid}-version-${version.id}-gameversion`,
            title:
              req.language.dashboard.mods.content.addMod.fields.gameVersion,
            options: versions.gameVersions,
            value: version.gameversion,
            classes: [],
            getText: (languages, language, user) => (value) => value,
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "js",
            id: `mod-${mod.modid}-version-${version.id}-bundle`,
            max: 1,
            min: 1,
            title: req.language.dashboard.mods.content.versions.fields.bundle,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "button",
            id: `mod-${mod.modid}-version-${version.id}-update`,
            title: req.language.dashboard.mods.content.versions.post,
            classes: [],
            onChange: (languages, language, user) => async (value) => {
              let fomeElements = document
                .getElementsByClassName("category active")[0]
                .getElementsByClassName("incorrect");
              for (let i = 0; i < fomeElements.length; i++) {
                fomeElements[i].classList.remove("incorrect");
              }
              let idList = document
                .getElementsByClassName("category active")[0]
                .id.split("-");
              let modid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
              let _id = idList[6];
              let versionId = idList[8];
              let version = document.getElementById(
                `mod-${modid}-version-${versionId}-name`
              );
              let gameversion = document.getElementById(
                `mod-${modid}-version-${versionId}-gameversion`
              );
              let bundle = document.getElementById(
                `mod-${modid}-version-${versionId}-bundle`
              );
              let index = document.getElementById(
                `mod-${modid}-version-${versionId}-index`
              );

              let incorrect = false;

              if (version.value.length < 5 || version.value.length > 255) {
                version.classList.add("incorrect");
                incorrect = true;
              }

              if (bundle.files.length > 1) {
                bundle.previousElementSibling.classList.add("incorrect");
                incorrect = true;
              }

              if (incorrect) {
                return;
              }

              let data = {};
              data.version = {
                index: index.getAttribute("value"),
                id: versionId,
                newId: version.value,
                modid: modid,
                gameversion: gameversion.value,
              };
              if (bundle.files.length === 1)
                data.version.bundle = await readFile(bundle.files[0]);

              let xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              xhr.open(`PATCH`, `/api/v1/database/mods/${_id}`, true);
              xhr.setRequestHeader(`Content-Type`, `application/json`);
              xhr.onreadystatechange = async (e) => {
                if (e.target.readyState === XMLHttpRequest.DONE) {
                  if (e.target.status === 200)
                    window.location.href = `/dashboard/mod-${modid}-${_id}-version-${version.value}`;
                }
              };
              xhr.send(JSON.stringify(data));
            },
          },
        ],
      },
      {
        contentType: "form",
        content: [
          {
            type: "text",
            id: `mod-${mod.modid}-version-${version.id}-deleteName`,
            title: req.language.dashboard.mods.content.versions.fields.name,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "button",
            red: true,
            id: `mod-${mod.modid}-version-${version.id}-delete`,
            title: req.language.dashboard.mods.content.versions.fields.delete,
            classes: [],
            onChange: (languages, language, user) => (value) => {
              let fomeElements = document
                .getElementsByClassName("category active")[0]
                .getElementsByClassName("incorrect");
              for (let i = 0; i < fomeElements.length; i++) {
                fomeElements[i].classList.remove("incorrect");
              }
              let idList = document
                .getElementsByClassName("category active")[0]
                .id.split("-");
              let modid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
              let _id = idList[6];
              let versionId = idList[8];
              let id = document.getElementById(
                `mod-${modid}-version-${versionId}-deleteName`
              );

              let incorrect = false;
              if (
                id.value.length < 5 ||
                id.value.length > 255 ||
                id.value !== versionId
              ) {
                id.classList.add("incorrect");
                incorrect = true;
              }

              if (incorrect) {
                return;
              }

              let data = {};
              data.version = {
                id: versionId,
                delete: true,
                modid: modid,
              };

              let xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              xhr.open(`PATCH`, `/api/v1/database/mods/${_id}`, true);
              xhr.setRequestHeader(`Content-Type`, `application/json`);
              xhr.onreadystatechange = async (e) => {
                if (e.target.readyState === XMLHttpRequest.DONE) {
                  if (e.target.status === 200)
                    window.location.href = `/dashboard/mod-${modid}-${_id}-versions`;
                }
              };
              xhr.send(JSON.stringify(data));
            },
          },
        ],
      },
    ],
  };
};

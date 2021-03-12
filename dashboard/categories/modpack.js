const version = require("../../api/v1/version");
module.exports = (req, res, modpack) => {
  return {
    back: "modpacks",
    id: `modpack-${modpack.modpackid}-${modpack._id}`,
    title: modpack.name,
    visible: false,
    content: [
      {
        post: {
          title: req.language.dashboard.modpacks.content.updateModpack.post,
          onChange: (languages, language, user) => async (button) => {
            let fomeElements = document
              .getElementsByClassName("category active")[0]
              .getElementsByClassName("incorrect");
            for (let i = 0; i < fomeElements.length; i++) {
              fomeElements[i].classList.remove("incorrect");
            }
            let idList = document
              .getElementsByClassName("category active")[0]
              .id.split("-");
            let modpackid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
            let _id = idList[6];
            let name = document.getElementById(`modpack-${modpackid}-name`);
            let description = document.getElementById(
              `modpack-${modpackid}-description`
            );
            let page = document.getElementById(`modpack-${modpackid}-page`);
            let collaborators = document.getElementById(
              `modpack-${modpackid}-collaborators`
            );
            let photos = document.getElementById(`modpack-${modpackid}-photos`);

            let incorrect = false;

            if (
              name.value.length < 5 ||
              name.value.length > 255 ||
              name.value.contains("-")
            ) {
              name.classList.add("incorrect");
              incorrect = true;
            }

            if (
              description.value.length < 5 ||
              description.value.length > 255
            ) {
              description.classList.add("incorrect");
              incorrect = true;
            }

            if (photos.files.length < 2 && photos.files.length > 3) {
              photos.previousElementSibling.classList.add("incorrect");
              incorrect = true;
            }

            if (incorrect) {
              return;
            }

            let data = {};
            data.name = name.value;
            data.description = description.value;
            data.page = page.value.trim();
            data.collaborators = [...collaborators.children].map((li) => {
              return li.id.split("-")[7];
            });
            if (photos.files.length > 0) {
              data.photos = [];
              for (let i = 0; i < photos.files.length; i++) {
                data.photos.push(await readFileDataURL(photos.files[i]));
              }
            }
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open(`PATCH`, `/api/v1/database/modpacks/${_id}`, true);
            xhr.onreadystatechange = async (e) => {
              if (e.target.readyState === XMLHttpRequest.DONE) {
                if (e.target.status === 200) window.location.reload();
              }
            };
            xhr.setRequestHeader(`Content-Type`, `application/json`);
            xhr.send(JSON.stringify(data));
          },
        },
        contentType: "form",
        content: [
          {
            type: "text",
            id: `modpack-${modpack.modpackid}-name`,
            title:
              req.language.dashboard.modpacks.content.addModpack.fields.name,
            value: modpack.name,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "text",
            id: `modpack-${modpack.modpackid}-description`,
            value: modpack.description,
            title:
              req.language.dashboard.modpacks.content.addModpack.fields
                .description,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "page",
            id: `modpack-${modpack.modpackid}-page`,
            value: modpack.page,
            title:
              req.language.dashboard.modpacks.content.addModpack.fields
                .modpackPage,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "list",
            id: `modpack-${modpack.modpackid}-collaborators`,
            value: modpack.collaborators,
            title:
              req.language.dashboard.modpacks.content.addModpack.fields
                .collaborators,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
            getText: (languages, language, user) => (value) => {
              let xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              xhr.open(`GET`, `/api/v1/database/users/${value}`, false);
              xhr.send();
              try {
                return JSON.parse(xhr.response).username;
              } catch (error) {
                return value;
              }
            },
          },
          {
            type: "images",
            id: `modpack-${modpack.modpackid}-photos`,
            max: 3,
            min: 2,
            title:
              req.language.dashboard.modpacks.content.addModpack.fields.photos,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
        ],
      },
      {
        contentType: "button",
        title: req.language.dashboard.modpacks.content.versions.title,
        desc: "",
        category: `modpack-${modpack.modpackid}-${modpack._id}-versions`,
      },
      {
        post: {
          red: true,
          title: req.language.dashboard.modpacks.content.deleteModpack.post,
          onChange: (languages, language, user) => async (button) => {
            let idList = document
              .getElementsByClassName("category active")[0]
              .id.split("-");
            let modpackid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
            let _id = idList[6];
            let fomeElements = document
              .getElementsByClassName("category active")[0]
              .getElementsByClassName("incorrect");
            for (let i = 0; i < fomeElements.length; i++) {
              fomeElements[i].classList.remove("incorrect");
            }
            let deleteName = document.getElementById(
              `modpack-${modpackid}-delete`
            );

            let incorrect = false;

            if (
              deleteName.value.trim() !==
              document
                .getElementById(idList.join("-") + "-content")
                .getElementsByClassName("title")[0]
                .innerHTML.trim()
            ) {
              deleteName.classList.add("incorrect");
              incorrect = true;
            }

            if (incorrect) {
              return;
            }

            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open(`DELETE`, `/api/v1/database/modpacks/${_id}`, true);
            xhr.setRequestHeader(`Content-Type`, `application/json`);
            xhr.onreadystatechange = async (e) => {
              if (e.target.readyState === XMLHttpRequest.DONE) {
                if (e.target.status === 200) window.location.reload();
              }
            };
            xhr.send(
              JSON.stringify({
                name: deleteName.value.trim(),
              })
            );
          },
        },
        contentType: "form",
        content: [
          {
            type: "text",
            id: `modpack-${modpack.modpackid}-delete`,
            title:
              req.language.dashboard.modpacks.content.deleteModpack.fields
                .delete,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
        ],
      },
    ],
  };
};

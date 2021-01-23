const version = require("../../api/v1/version");
module.exports = (req, res, modpack) => {
    return {
        id: `modpack-${modpack.modpackid}-${modpack._id}`,
        title: modpack.name,
        visible: false,
        content: [{
                post: {
                    title: req.language.dashboard.modpacks.content.updateModpack.post,
                    onChange: (languages, language, user) => async(button) => {
                        let fomeElements = document.getElementsByClassName("category active")[0].getElementsByClassName("incorrect");
                        for (let i = 0; i < fomeElements.length; i++) {
                            fomeElements[i].classList.remove("incorrect");
                        }
                        let idList = document.getElementsByClassName("category active")[0].id.split("-");
                        let modpackid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
                        let _id = idList[6];
                        let name = document.getElementById(`modpack-${modpackid}-name`);
                        let description = document.getElementById(`modpack-${modpackid}-description`);
                        let page = document.getElementById(`modpack-${modpackid}-page`);
                        let collaberators = document.getElementById(`modpack-${modpackid}-collaberators`);
                        let photos = document.getElementById(`modpack-${modpackid}-photos`);

                        let incorrect = false;

                        if (name.value.length < 5 || name.value.length > 255) {
                            name.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (description.value.length < 5 || description.value.length > 255) {
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
                        data.collaberators = [...collaberators.children].map((li) => {
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
                        xhr.open(`PATCH`, `http://mods.thomasbrants.nl/api/v1/database/modpacks/${_id}`, true);
                        xhr.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                window.location.reload();
                            }
                        };
                        xhr.setRequestHeader(`Content-Type`, `application/json`);
                        xhr.send(JSON.stringify(data));
                    },
                },
                contentType: "form",
                content: [{
                        type: "text",
                        id: `modpack-${modpack.modpackid}-name`,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.name,
                        value: modpack.name,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "text",
                        id: `modpack-${modpack.modpackid}-description`,
                        value: modpack.description,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.description,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "page",
                        id: `modpack-${modpack.modpackid}-page`,
                        value: modpack.page,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.modpackPage,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "list",
                        id: `modpack-${modpack.modpackid}-collaberators`,
                        value: modpack.collaberators,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.collaberators,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                        getText: (languages, language, user) => (value) => {
                            let xhr = new XMLHttpRequest();
                            xhr.withCredentials = true;
                            xhr.open(`GET`, `http://mods.thomasbrants.nl/api/v1/database/users/${value}`, false);
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
                        title: req.language.dashboard.modpacks.content.addModpack.fields.photos,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                ],
            },
            {
                post: {
                    title: req.language.dashboard.modpacks.content.addVersion.post,
                    onChange: (languages, language, user) => async(button) => {
                        let fomeElements = document.getElementsByClassName("category active")[0].getElementsByClassName("incorrect");
                        for (let i = 0; i < fomeElements.length; i++) {
                            fomeElements[i].classList.remove("incorrect");
                        }
                        let idList = document.getElementsByClassName("category active")[0].id.split("-");
                        let modpackid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
                        let _id = idList[6];
                        let version = document.getElementById(`modpack-${modpackid}-version`);
                        let gameversion = document.getElementById(`modpack-${modpackid}-gameversion`);
                        let bundle = document.getElementById(`modpack-${modpackid}-bundle`);

                        let incorrect = false;

                        if (version.value.length < 5 || version.value.length > 255) {
                            version.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (bundle.files.length !== 1) {
                            bundle.previousElementSibling.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (incorrect) {
                            return;
                        }

                        let data = {};
                        data.version = {
                            id: version.value,
                            modpackid: modpackid,
                            gameversion: gameversion.value,
                            bundle: await readFile(bundle.files[0]),
                        };
                        let xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open(`PATCH`, `http://mods.thomasbrants.nl/api/v1/database/modpacks/${_id}`, true);
                        xhr.setRequestHeader(`Content-Type`, `application/json`);
                        xhr.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                window.location.reload();
                            }
                        };
                        xhr.send(JSON.stringify(data));
                    },
                },
                contentType: "form",
                content: [{
                        type: "text",
                        id: `modpack-${modpack.modpackid}-version`,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.version,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "select",
                        id: `modpack-${modpack.modpackid}-gameversion`,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.gameVersion,
                        options: version.gameVersions,
                        classes: [],
                        getText: (languages, language, user) => (value) => value,
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "js",
                        id: `modpack-${modpack.modpackid}-bundle`,
                        max: 1,
                        min: 1,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.bundle,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                ],
            },
            {
                post: {
                    red: true,
                    title: req.language.dashboard.modpacks.content.deleteModpack.post,
                    onChange: (languages, language, user) => async(button) => {
                        let idList = document.getElementsByClassName("category active")[0].id.split("-");
                        let modpackid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
                        let _id = idList[6];
                        let fomeElements = document.getElementsByClassName("category active")[0].getElementsByClassName("incorrect");
                        for (let i = 0; i < fomeElements.length; i++) {
                            fomeElements[i].classList.remove("incorrect");
                        }
                        let deleteName = document.getElementById(`modpack-${modpackid}-delete`);

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
                        xhr.open(`DELETE`, `http://mods.thomasbrants.nl/api/v1/database/modpacks/${_id}`, true);
                        xhr.setRequestHeader(`Content-Type`, `application/json`);
                        xhr.onreadystatechange = async(e) => {
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
                content: [{
                    type: "text",
                    id: `modpack-${modpack.modpackid}-delete`,
                    title: req.language.dashboard.modpacks.content.deleteModpack.fields.delete,
                    classes: [],
                    onChange: (languages, language, user) => (value) => {},
                }, ],
            },
        ],
    };
};
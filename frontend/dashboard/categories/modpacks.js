const version = require("../../api/v1/version");
module.exports = (req, res, modpacks) => {
    return {
        id: "modpacks",
        icon: "/static/images/icon.png",
        invert: false,
        title: req.language.dashboard.modpacks.title,
        visible: true,
        content: [
            ...modpacks.buttons,
            {
                title: req.language.dashboard.modpacks.content.addModpack.title,
                post: {
                    title: req.language.dashboard.modpacks.content.addModpack.post,
                    onChange: (languages, language, user) => async(button) => {
                        let fomeElements = document.getElementById("modpacks-content").getElementsByClassName("incorrect");
                        for (let i = 0; i < fomeElements.length; i++) {
                            fomeElements[i].classList.remove("incorrect");
                        }
                        let name = document.getElementById("modpack-name");
                        let description = document.getElementById("modpack-description");
                        let page = document.getElementById("modpack-add-new-modpack-page");
                        let modpackid = document.getElementById("modpack-modpackid");
                        let collaborators = document.getElementById("modpack-collaborators");
                        let version = document.getElementById("modpack-version");
                        let gameversion = document.getElementById("modpack-gameversion");
                        let photos = document.getElementById("modpack-photos");
                        let bundle = document.getElementById("modpack-bundle");

                        let incorrect = false;

                        if (name.value.length < 5 || name.value.length > 255 || name.value.contains("-")) {
                            name.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (description.value.length < 5 || description.value.length > 255) {
                            description.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (version.value.length < 1 || version.value.length > 255 || !/[^A-Za-z0-9_.]*/.test(version.value)) {
                            version.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (bundle.files.length !== 1) {
                            bundle.previousElementSibling.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (photos.files.length < 2 && photos.files.length > 3) {
                            photos.previousElementSibling.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(modpackid.value)) {
                            modpackid.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (incorrect) {
                            return;
                        }

                        let xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open(`GET`, `/api/v1/database/modpacks/uuid`, false);
                        xhr.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                if (e.target.status !== 200) {
                                    modpackid.classList.add("incorrect");
                                    incorrect = true;
                                }
                                if (incorrect) {
                                    return;
                                }
                                let data = {};
                                data.name = name.value;
                                data.description = description.value;
                                data.page = page.value.trim();
                                data.modpackid = modpackid.value;
                                data.version = version.value;
                                data.gameversion = gameversion.value;
                                data.collaborators = [...collaborators.children].map((li) => {
                                    return li.id.split("-")[2];
                                });
                                data.photos = [];
                                for (let i = 0; i < photos.files.length; i++) {
                                    data.photos.push(await readFileDataURL(photos.files[i]));
                                }
                                data.bundle = await readFile(bundle.files[0]);
                                let xhr = new XMLHttpRequest();
                                xhr.withCredentials = true;
                                xhr.open(`POST`, `/api/v1/database/modpacks`, true);
                                xhr.setRequestHeader(`Content-Type`, `application/json`);
                                xhr.onreadystatechange = async(e) => {
                                    if (e.target.status === 406) return modpackid.classList.add("incorrect");
                                    if (e.target.status !== 200) return;
                                    window.location.reload();
                                };
                                xhr.send(JSON.stringify(data));
                            }
                        };
                        xhr.setRequestHeader(`Content-Type`, `application/json`);
                        xhr.send(JSON.stringify({ modpackid: modpackid.value }));
                    },
                },
                contentType: "form",
                content: [{
                        type: "text",
                        id: "modpack-name",
                        title: req.language.dashboard.modpacks.content.addModpack.fields.name,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "text",
                        id: "modpack-description",
                        title: req.language.dashboard.modpacks.content.addModpack.fields.description,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "page",
                        id: "modpack-add-new-modpack-page",
                        title: req.language.dashboard.modpacks.content.addModpack.fields.modpackPage,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "text",
                        id: "modpack-modpackid",
                        title: req.language.dashboard.modpacks.content.addModpack.fields.modpackId,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "list",
                        id: "modpack-collaborators",
                        title: req.language.dashboard.modpacks.content.addModpack.fields.collaborators,
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
                        type: "text",
                        id: "modpack-version",
                        title: req.language.dashboard.modpacks.content.addModpack.fields.version,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "select",
                        id: "modpack-gameversion",
                        title: req.language.dashboard.modpacks.content.addModpack.fields.gameVersion,
                        options: version.gameVersions,
                        classes: [],
                        getText: (languages, language, user) => (value) => value,
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "images",
                        id: "modpack-photos",
                        max: 3,
                        min: 2,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.photos,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "js",
                        id: "modpack-bundle",
                        max: 1,
                        min: 1,
                        title: req.language.dashboard.modpacks.content.addModpack.fields.bundle,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                ],
            },
        ],
    };
};
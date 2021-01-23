const version = require("../../api/v1/version");
module.exports = (req, res, mods) => {
    return {
        id: "mods",
        icon: "/static/images/icon.svg",
        invert: false,
        title: req.language.dashboard.mods.title,
        visible: true,
        content: [
            ...mods.buttons,
            {
                title: req.language.dashboard.mods.content.addMod.title,
                post: {
                    title: req.language.dashboard.mods.content.addMod.post,
                    onChange: (languages, language, user) => async(button) => {
                        let fomeElements = document.getElementById("mods-content").getElementsByClassName("incorrect");
                        for (let i = 0; i < fomeElements.length; i++) {
                            fomeElements[i].classList.remove("incorrect");
                        }
                        let name = document.getElementById("mod-name");
                        let description = document.getElementById("mod-description");
                        let page = document.getElementById("mod-add-new-mod-page");
                        let modid = document.getElementById("mod-modid");
                        let collaberators = document.getElementById("mod-collaberators");
                        let version = document.getElementById("mod-version");
                        let gameversion = document.getElementById("mod-gameversion");
                        let photos = document.getElementById("mod-photos");
                        let bundle = document.getElementById("mod-bundle");

                        let incorrect = false;

                        if (name.value.length < 5 || name.value.length > 255) {
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

                        if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(modid.value)) {
                            modid.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (incorrect) {
                            return;
                        }

                        let xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open(`GET`, `http://mods.thomasbrants.nl/api/v1/database/mods/uuid`, false);
                        xhr.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                if (e.target.status !== 200) {
                                    modid.classList.add("incorrect");
                                    incorrect = true;
                                }
                                if (incorrect) {
                                    return;
                                }
                                let data = {};
                                data.name = name.value;
                                data.description = description.value;
                                data.page = page.value.trim();
                                data.modid = modid.value;
                                data.version = version.value;
                                data.gameversion = gameversion.value;
                                data.collaberators = [...collaberators.children].map((li) => {
                                    return li.id.split("-")[2];
                                });
                                data.photos = [];
                                for (let i = 0; i < photos.files.length; i++) {
                                    data.photos.push(await readFileDataURL(photos.files[i]));
                                }
                                data.bundle = await readFile(bundle.files[0]);
                                let xhr = new XMLHttpRequest();
                                xhr.withCredentials = true;
                                xhr.open(`POST`, `http://mods.thomasbrants.nl/api/v1/database/mods`, true);
                                xhr.setRequestHeader(`Content-Type`, `application/json`);
                                xhr.onreadystatechange = async(e) => {
                                    if (e.target.status === 406) modid.classList.add("incorrect");
                                };
                                xhr.send(JSON.stringify(data));
                            }
                        };
                        xhr.setRequestHeader(`Content-Type`, `application/json`);
                        xhr.send(JSON.stringify({ modid: modid.value }));
                    },
                },
                contentType: "form",
                content: [{
                        type: "text",
                        id: "mod-name",
                        title: req.language.dashboard.mods.content.addMod.fields.name,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "text",
                        id: "mod-description",
                        title: req.language.dashboard.mods.content.addMod.fields.description,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "page",
                        id: "mod-add-new-mod-page",
                        title: req.language.dashboard.mods.content.addMod.fields.modPage,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "text",
                        id: "mod-modid",
                        title: req.language.dashboard.mods.content.addMod.fields.modId,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "list",
                        id: "mod-collaberators",
                        title: req.language.dashboard.mods.content.addMod.fields.collaberators,
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
                        type: "text",
                        id: "mod-version",
                        title: req.language.dashboard.mods.content.addMod.fields.version,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "select",
                        id: "mod-gameversion",
                        title: req.language.dashboard.mods.content.addMod.fields.gameVersion,
                        options: version.gameVersions,
                        classes: [],
                        getText: (languages, language, user) => (value) => value,
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "images",
                        id: "mod-photos",
                        max: 3,
                        min: 2,
                        title: req.language.dashboard.mods.content.addMod.fields.photos,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "js",
                        id: "mod-bundle",
                        max: 1,
                        min: 1,
                        title: req.language.dashboard.mods.content.addMod.fields.bundle,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                ],
            },
        ],
    };
};
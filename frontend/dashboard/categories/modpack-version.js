const versions = require("../../api/v1/version");
module.exports = (req, res, modpack, version) => {
    return {
        back: `modpack-${modpack.modpackid}-${modpack._id}-versions`,
        id: `modpack-${modpack.modpackid}-${modpack._id}-version-${version.id}`,
        title: modpack.name,
        visible: false,
        content: [{
                contentType: "var",
                id: `modpack-${modpack.modpackid}-version-${version.id}-index`,
                value: version.index,
            },
            {
                contentType: "form",
                content: [{
                        type: "text",
                        id: `modpack-${modpack.modpackid}-version-${version.id}-name`,
                        title: req.language.dashboard.modpacks.content.versions.fields.version,
                        classes: [],
                        value: version.id,
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "select",
                        id: `modpack-${modpack.modpackid}-version-${version.id}-gameversion`,
                        title: req.language.dashboard.modpacks.content.addMod.fields.gameVersion,
                        options: versions.gameVersions,
                        value: version.gameversion,
                        classes: [],
                        getText: (languages, language, user) => (value) => value,
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "js",
                        id: `modpack-${modpack.modpackid}-version-${version.id}-bundle`,
                        max: 1,
                        min: 1,
                        title: req.language.dashboard.modpacks.content.versions.fields.bundle,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "button",
                        id: `modpack-${modpack.modpackid}-version-${version.id}-update`,
                        title: req.language.dashboard.modpacks.content.versions.post,
                        classes: [],
                        onChange: (languages, language, user) => async(value) => {
                            let fomeElements = document.getElementsByClassName("category active")[0].getElementsByClassName("incorrect");
                            for (let i = 0; i < fomeElements.length; i++) {
                                fomeElements[i].classList.remove("incorrect");
                            }
                            let idList = document.getElementsByClassName("category active")[0].id.split("-");
                            let modpackid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
                            let _id = idList[6];
                            let versionId = idList[8];
                            let version = document.getElementById(`modpack-${modpackid}-version-${versionId}-name`);
                            let gameversion = document.getElementById(`modpack-${modpackid}-version-${versionId}-gameversion`);
                            let bundle = document.getElementById(`modpack-${modpackid}-version-${versionId}-bundle`);
                            let index = document.getElementById(`modpack-${modpackid}-version-${versionId}-index`);

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
                                modpackid: modpackid,
                                gameversion: gameversion.value,
                            };
                            if (bundle.files.length === 1) data.version.bundle = await readFile(bundle.files[0]);

                            let xhr = new XMLHttpRequest();
                            xhr.withCredentials = true;
                            xhr.open(`PATCH`, `/api/v1/database/modpacks/${_id}`, true);
                            xhr.setRequestHeader(`Content-Type`, `application/json`);
                            xhr.onreadystatechange = async(e) => {
                                if (e.target.readyState === XMLHttpRequest.DONE) {
                                    if (e.target.status === 200) window.location.href = `/dashboard/modpack-${modpackid}-${_id}-version-${version.value}`;
                                }
                            };
                            xhr.send(JSON.stringify(data));
                        },
                    },
                ],
            },
            {
                contentType: "form",
                content: [{
                        type: "text",
                        id: `modpack-${modpack.modpackid}-version-${version.id}-deleteName`,
                        title: req.language.dashboard.modpacks.content.versions.fields.name,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "button",
                        red: true,
                        id: `modpack-${modpack.modpackid}-version-${version.id}-delete`,
                        title: req.language.dashboard.modpacks.content.versions.fields.delete,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {
                            let fomeElements = document.getElementsByClassName("category active")[0].getElementsByClassName("incorrect");
                            for (let i = 0; i < fomeElements.length; i++) {
                                fomeElements[i].classList.remove("incorrect");
                            }
                            let idList = document.getElementsByClassName("category active")[0].id.split("-");
                            let modpackid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
                            let _id = idList[6];
                            let versionId = idList[8];
                            let id = document.getElementById(`modpack-${modpackid}-version-${versionId}-deleteName`);

                            let incorrect = false;
                            if (id.value.length < 5 || id.value.length > 255 || id.value !== versionId) {
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
                                modpackid: modpackid,
                            };

                            let xhr = new XMLHttpRequest();
                            xhr.withCredentials = true;
                            xhr.open(`PATCH`, `/api/v1/database/modpacks/${_id}`, true);
                            xhr.setRequestHeader(`Content-Type`, `application/json`);
                            xhr.onreadystatechange = async(e) => {
                                if (e.target.readyState === XMLHttpRequest.DONE) {
                                    if (e.target.status === 200) window.location.href = `/dashboard/modpack-${modpackid}-${_id}-versions`;
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
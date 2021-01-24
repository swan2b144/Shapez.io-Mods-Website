const version = require("../../api/v1/version");
module.exports = (req, res, mod) => {
    return {
        back: `mod-${mod.modid}-${mod._id}`,
        id: `mod-${mod.modid}-${mod._id}-versions`,
        title: `${mod.name} - ${req.language.dashboard.mods.content.versions.title}`,
        visible: false,
        content: [
            ...mod.versionButtons,
            {
                post: {
                    title: req.language.dashboard.mods.content.addVersion.post,
                    onChange: (languages, language, user) => async(button) => {
                        let fomeElements = document.getElementsByClassName("category active")[0].getElementsByClassName("incorrect");
                        for (let i = 0; i < fomeElements.length; i++) {
                            fomeElements[i].classList.remove("incorrect");
                        }
                        let idList = document.getElementsByClassName("category active")[0].id.split("-");
                        let modid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
                        let _id = idList[6];
                        let version = document.getElementById(`mod-${modid}-version`);
                        let gameversion = document.getElementById(`mod-${modid}-gameversion`);
                        let bundle = document.getElementById(`mod-${modid}-bundle`);

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
                            modid: modid,
                            gameversion: gameversion.value,
                            bundle: await readFile(bundle.files[0]),
                        };
                        let xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open(`PATCH`, `/api/v1/database/mods/${_id}`, true);
                        xhr.setRequestHeader(`Content-Type`, `application/json`);
                        xhr.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                if (e.target.status === 200) window.location.reload();
                            }
                        };
                        xhr.send(JSON.stringify(data));
                    },
                },
                contentType: "form",
                content: [{
                        type: "text",
                        id: `mod-${mod.modid}-version`,
                        title: req.language.dashboard.mods.content.addMod.fields.version,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "select",
                        id: `mod-${mod.modid}-gameversion`,
                        title: req.language.dashboard.mods.content.addMod.fields.gameVersion,
                        options: version.gameVersions,
                        classes: [],
                        getText: (languages, language, user) => (value) => value,
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "js",
                        id: `mod-${mod.modid}-bundle`,
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
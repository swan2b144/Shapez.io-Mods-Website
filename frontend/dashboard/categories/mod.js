module.exports = (req, res, mod) => {
    return {
        back: "mods",
        id: `mod-${mod.modid}-${mod._id}`,
        title: mod.name,
        visible: false,
        content: [{
                post: {
                    title: req.language.dashboard.mods.content.updateMod.post,
                    onChange: (languages, language, user) => async(button) => {
                        let fomeElements = document.getElementsByClassName("category active")[0].getElementsByClassName("incorrect");
                        for (let i = 0; i < fomeElements.length; i++) {
                            fomeElements[i].classList.remove("incorrect");
                        }
                        let idList = document.getElementsByClassName("category active")[0].id.split("-");
                        let modid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
                        let _id = idList[6];
                        let name = document.getElementById(`mod-${modid}-name`);
                        let description = document.getElementById(`mod-${modid}-description`);
                        let page = document.getElementById(`mod-${modid}-page`);
                        let collaborators = document.getElementById(`mod-${modid}-collaborators`);
                        let photos = document.getElementById(`mod-${modid}-photos`);

                        let incorrect = false;

                        if (name.value.length < 5 || name.value.length > 255 || name.value.contains("-")) {
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
                        xhr.open(`PATCH`, `/api/v1/database/mods/${_id}`, true);
                        xhr.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                if (e.target.status === 200) window.location.reload();
                            }
                        };
                        xhr.setRequestHeader(`Content-Type`, `application/json`);
                        xhr.send(JSON.stringify(data));
                    },
                },
                contentType: "form",
                content: [{
                        type: "text",
                        id: `mod-${mod.modid}-name`,
                        title: req.language.dashboard.mods.content.addMod.fields.name,
                        value: mod.name,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "text",
                        id: `mod-${mod.modid}-description`,
                        value: mod.description,
                        title: req.language.dashboard.mods.content.addMod.fields.description,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "page",
                        id: `mod-${mod.modid}-page`,
                        value: mod.page,
                        title: req.language.dashboard.mods.content.addMod.fields.modPage,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                    {
                        type: "list",
                        id: `mod-${mod.modid}-collaborators`,
                        value: mod.collaborators,
                        title: req.language.dashboard.mods.content.addMod.fields.collaborators,
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
                        id: `mod-${mod.modid}-photos`,
                        max: 3,
                        min: 2,
                        title: req.language.dashboard.mods.content.addMod.fields.photos,
                        classes: [],
                        onChange: (languages, language, user) => (value) => {},
                    },
                ],
            },
            {
                contentType: "button",
                title: req.language.dashboard.mods.content.versions.title,
                desc: "",
                category: `mod-${mod.modid}-${mod._id}-versions`,
            },
            {
                post: {
                    red: true,
                    title: req.language.dashboard.mods.content.deleteMod.post,
                    onChange: (languages, language, user) => async(button) => {
                        let idList = document.getElementsByClassName("category active")[0].id.split("-");
                        let modid = `${idList[1]}-${idList[2]}-${idList[3]}-${idList[4]}-${idList[5]}`;
                        let _id = idList[6];
                        let fomeElements = document.getElementsByClassName("category active")[0].getElementsByClassName("incorrect");
                        for (let i = 0; i < fomeElements.length; i++) {
                            fomeElements[i].classList.remove("incorrect");
                        }
                        let deleteName = document.getElementById(`mod-${modid}-delete`);

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
                        xhr.open(`DELETE`, `/api/v1/database/mods/${_id}`, true);
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
                    id: `mod-${mod.modid}-delete`,
                    title: req.language.dashboard.mods.content.deleteMod.fields.delete,
                    classes: [],
                    onChange: (languages, language, user) => (value) => {},
                }, ],
            },
        ],
    };
};
const languages = require("../../api/v1/languages");
module.exports = (req, res, instance, modInstance, mod) => {
    return {
        id: `instance-${instance.name}-mod-${mod.modid}-${instance.index}-${modInstance.index}`,
        icon: "/static/images/play.png",
        invert: true,
        title: `${instance.name} - ${mod.name}`,
        visible: false,
        content: [{
            post: {
                title: req.language.dashboard.instances.content.updateInstance.post,
                onChange: (languages, language, user) => (button) => {
                    let idList = document.getElementsByClassName("category active")[0].id.split("-");
                    let instanceName = idList[1];
                    let modId = `${idList[3]}-${idList[4]}-${idList[5]}-${idList[6]}-${idList[7]}`;
                    let instanceIndex = idList[8];
                    let modIndex = idList[9];
                    let config = document.getElementById(`instances-${instanceName}-mod-${modId}-config`);
                    let settings = document.getElementById(`instances-${instanceName}-mod-${modId}-settings`);
                    try {
                        let configJson;
                        try {
                            configJson = JSON.parse(config.value);
                            config.classList.remove("incorrect");
                        } catch (error) {
                            config.classList.add("incorrect");
                            return;
                        }

                        let settingsJson;
                        try {
                            settingsJson = JSON.parse(settings.value);
                            settings.classList.remove("incorrect");
                        } catch (error) {
                            settings.classList.add("incorrect");
                            return;
                        }

                        let data = {};
                        data[`instances.${instanceIndex}.mods.${modIndex}.config`] = configJson;
                        data[`instances.${instanceIndex}.mods.${modIndex}.settings`] = settingsJson;

                        let patch = new XMLHttpRequest();
                        patch.withCredentials = true;
                        patch.open(`PATCH`, `http://localhost:3007/api/v1/database/users`, true);
                        patch.setRequestHeader(`Content-Type`, `application/json`);
                        patch.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                if (e.target.status !== 200) return settings.classList.add("incorrect");

                                window.location.reload();
                            }
                        };
                        patch.send(JSON.stringify(data));
                    } catch (error) {
                        settings.classList.add("incorrect");
                        config.classList.add("incorrect");
                    }
                },
            },
            contentType: "form",
            content: [{
                    type: "textarea",
                    id: `instances-${instance.name}-mod-${mod.modid}-config`,
                    value: JSON.stringify(modInstance.config, null, 4),
                    title: req.language.dashboard.instances.content.updateInstance.fields.config,
                    classes: [],
                    onChange: (languages, language, user) => (value) => {},
                },
                {
                    type: "textarea",
                    id: `instances-${instance.name}-mod-${mod.modid}-settings`,
                    value: JSON.stringify(modInstance.settings, null, 4),
                    title: req.language.dashboard.instances.content.updateInstance.fields.settings,
                    classes: [],
                    onChange: (languages, language, user) => (value) => {},
                },
            ],
        }, ],
    };
};
module.exports = (req, res) => {
    return {
        id: "verify",
        icon: "/static/images/verify.png",
        invert: false,
        title: req.language.dashboard.verify.title,
        visible: true,
        content: [{
                post: {
                    title: req.language.dashboard.verify.content.mod.post,
                    onChange: (languages, language, user) => async(button) => {
                        let incorrect = false;
                        let modid = document.getElementById("verify-mod");

                        if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(modid.value)) {
                            modid.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (incorrect) {
                            return;
                        }

                        let xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open(`GET`, `http://localhost:3007/api/v1/database/mods/${modid.value}`, false);
                        xhr.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                if (e.target.status !== 200) {
                                    modid.classList.add("incorrect");
                                    return;
                                }
                                if (!e.target.response) {
                                    modid.classList.add("incorrect");
                                    return;
                                }
                                let mod = JSON.parse(e.target.response);
                                // if (mod.verified) {
                                //     modid.classList.add("incorrect");
                                //     return;
                                // }
                                let verify = !mod.verified;
                                let xhr = new XMLHttpRequest();
                                xhr.withCredentials = true;
                                xhr.open(`PATCH`, `http://localhost:3007/api/v1/database/mods/${modid.value}`, true);
                                xhr.setRequestHeader(`Content-Type`, `application/json`);
                                xhr.onreadystatechange = async(e) => {
                                    if (e.target.status === 200) return window.location.reload();
                                };
                                xhr.send(
                                    JSON.stringify({
                                        verified: verify,
                                    })
                                );
                            }
                        };
                        xhr.send();
                    },
                },
                contentType: "form",
                content: [{
                    type: "text",
                    id: `verify-mod`,
                    title: req.language.dashboard.verify.content.mod.fields.id,
                    classes: [],
                    onChange: (languages, language, user) => (value) => {},
                }, ],
            },
            {
                post: {
                    title: req.language.dashboard.verify.content.modpack.post,
                    onChange: (languages, language, user) => async(button) => {
                        let incorrect = false;
                        let modpackid = document.getElementById("verify-modpack");

                        if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(modpackid.value)) {
                            modpackid.classList.add("incorrect");
                            incorrect = true;
                        }

                        if (incorrect) {
                            return;
                        }

                        let xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open(`GET`, `http://localhost:3007/api/v1/database/modpacks/${modpackid.value}`, false);
                        xhr.onreadystatechange = async(e) => {
                            if (e.target.readyState === XMLHttpRequest.DONE) {
                                if (e.target.status !== 200) {
                                    modpackid.classList.add("incorrect");
                                    return;
                                }
                                if (!e.target.response) {
                                    modpackid.classList.add("incorrect");
                                    return;
                                }
                                let modpack = JSON.parse(e.target.response);
                                // if (modpack.verified) {
                                //     modpackid.classList.add("incorrect");
                                //     return;
                                // }
                                let xhr = new XMLHttpRequest();
                                xhr.withCredentials = true;
                                xhr.open(`PATCH`, `http://localhost:3007/api/v1/database/modpacks/${modpackid.value}`, true);
                                xhr.setRequestHeader(`Content-Type`, `application/json`);
                                xhr.onreadystatechange = async(e) => {
                                    if (e.target.status === 200) return window.location.reload();
                                };
                                xhr.send(
                                    JSON.stringify({
                                        verified: !modpack.verified,
                                    })
                                );
                            }
                        };
                        xhr.send();
                    },
                },
                contentType: "form",
                content: [{
                    type: "text",
                    id: `verify-modpack`,
                    title: req.language.dashboard.verify.content.modpack.fields.id,
                    classes: [],
                    onChange: (languages, language, user) => (value) => {},
                }, ],
            },
        ],
    };
};
const languages = require("../../api/v1/languages");
module.exports = (req, res, instance) => {
        let play = [];
        if (req.user.verified)
            play.push({
                    contentType: "button",
                    title: req.language.dashboard.instances.content.play,
                    desc: "",
                    play: () => {
                            let instanceName = document.getElementsByClassName("category active")[0].id.split("-")[1];
                            localStorage.setItem("instance", document.getElementById(`instance-var-${instanceName}`).getAttribute(`value`));

                            let xhr = new XMLHttpRequest();
                            xhr.withCredentials = true;
                            xhr.open(`GET`, `/api/v1/database/users/${document.getElementById(`instance-var-${instanceName}-userId`).getAttribute(`value`)}`, true);
				xhr.setRequestHeader(`Content-Type`, `application/json`);
				xhr.onreadystatechange = async (e) => {
					if (e.target.readyState === XMLHttpRequest.DONE) {
						if (e.target.status !== 200) return;
						if (!JSON.parse(e.target.response)) return;
						localStorage.setItem("user", e.target.response);
						window.location.href = `/play?fullVersion=1`;
					}
				};
				xhr.send();
			},
		});
	return {
		back: `instances`,
		id: `instance-${instance.name}`,
		icon: "/static/images/play.png",
		invert: true,
		title: instance.name,
		visible: false,
		content: [
			...play,
			{
				contentType: "var",
				id: `instance-var-${instance.name}`,
				value: JSON.stringify(instance),
			},
			{
				contentType: "var",
				id: `instance-var-${instance.name}-userId`,
				value: req.user.discordId,
			},
			...instance.modButtons,
			{
				post: {
					title: req.language.dashboard.instances.content.updateInstance.post,
					onChange: (languages, language, user) => async (button) => {
						let instanceName = document.getElementsByClassName("category active")[0].id.split("-")[1];
						let name = document.getElementById(`instances-${instanceName}-updateName`);

						if (name.value.length < 5 || name.value.length > 255) {
							name.classList.add("incorrect");
							return;
						}

						let data = {};
						data[`instances.${name.classList[0]}.name`] = name.value;

						let patch = new XMLHttpRequest();
						patch.withCredentials = true;
						patch.open(`PATCH`, `/api/v1/database/users`, true);
						patch.setRequestHeader(`Content-Type`, `application/json`);
						patch.onreadystatechange = async (e) => {
							if (e.target.readyState === XMLHttpRequest.DONE) {
								if (e.target.status !== 200) return name.classList.add("incorrect");

								window.location.href = `/dashboard/instance-` + name.value;
							}
						};
						patch.send(JSON.stringify(data));
					},
				},
				contentType: "form",
				content: [
					{
						type: "text",
						id: `instances-${instance.name}-updateName`,
						value: instance.name,
						title: req.language.dashboard.instances.content.updateInstance.fields.name,
						classes: [instance.index],
						onChange: (languages, language, user) => (value) => {},
					},
				],
			},
			{
				post: {
					title: req.language.dashboard.instances.content.addMod.post,
					onChange: (languages, language, user) => async (button) => {
						let instanceName = document.getElementsByClassName("category active")[0].id.split("-")[1];
						let modid = document.getElementById(`instances-${instanceName}-addMod`);

						if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(modid.value)) {
							modid.classList.add("incorrect");
							incorrect = true;
						}
						let xhr = new XMLHttpRequest();
						xhr.withCredentials = true;
						xhr.open(`GET`, `/api/v1/database/mods/${modid.value}`, true);
						xhr.setRequestHeader(`Content-Type`, `application/json`);
						xhr.onreadystatechange = async (e) => {
							if (e.target.readyState === XMLHttpRequest.DONE) {
								if (e.target.status !== 200) return modid.classList.add("incorrect");

								let mod = JSON.parse(e.target.response);
								mod.versions.sort(function (a, b) {
									return new Date(b.date) - new Date(a.date);
								});
								let modVersion = mod.versions.find((version) => version.gameversion === modid.classList[1]).id;
								let data = {};
								data.$push = {};
								data.$push[`instances.${modid.classList[0]}.mods`] = {
									url: `/static/mods/${modid.value}/${modVersion}.js`,
									id: modid.value,
									config: {},
									settings: {},
								};

								let patch = new XMLHttpRequest();
								patch.withCredentials = true;
								patch.open(`PATCH`, `/api/v1/database/users`, true);
								patch.setRequestHeader(`Content-Type`, `application/json`);
								patch.onreadystatechange = async (e) => {
									if (e.target.readyState === XMLHttpRequest.DONE) {
										if (e.target.status !== 200) return modid.classList.add("incorrect");

										window.location.reload();
									}
								};
								patch.send(JSON.stringify(data));
							}
						};
						xhr.send(JSON.stringify({ modid: modid.value }));
					},
				},
				contentType: "form",
				content: [
					{
						type: "text",
						id: `instances-${instance.name}-addMod`,
						title: req.language.dashboard.instances.content.addMod.fields.id,
						classes: [instance.index, instance.gameversion],
						onChange: (languages, language, user) => (value) => {},
					},
				],
			},
			{
				post: {
					red: true,
					title: req.language.dashboard.instances.content.deleteInstance.post,
					onChange: (languages, language, user) => async (button) => {
						let instanceName = document.getElementsByClassName("category active")[0].id.split("-")[1];
						let name = document.getElementById(`instances-${instanceName}-delete`);

						if (name.value.length < 5 || name.value.length > 255 || name.value !== instanceName) {
							name.classList.add("incorrect");
							return;
						}

						let xhr = new XMLHttpRequest();
						xhr.withCredentials = true;
						xhr.open(`GET`, `/api/v1/database/users/${name.classList[0]}`, true);
						xhr.setRequestHeader(`Content-Type`, `application/json`);
						xhr.onreadystatechange = async (e) => {
							if (e.target.readyState === XMLHttpRequest.DONE) {
								if (!JSON.parse(e.target.response).instances || !JSON.parse(e.target.response).instances.find((instance) => instance.name === name.value)) return name.classList.add("incorrect");

								let data = {};
								data.$pull = {};
								data.$pull.instances = {
									name: name.value,
								};
								let xhr = new XMLHttpRequest();
								xhr.withCredentials = true;
								xhr.open(`PATCH`, `/api/v1/database/users/`, true);
								xhr.setRequestHeader(`Content-Type`, `application/json`);
								xhr.onreadystatechange = async (e) => {
									if (e.target.readyState === XMLHttpRequest.DONE) {
										if (e.target.status === 200) window.location.reload();
									}
								};
								xhr.send(JSON.stringify(data));
							}
						};
						xhr.send();
					},
				},
				contentType: "form",
				content: [
					{
						type: "text",
						id: `instances-${instance.name}-delete`,
						title: req.language.dashboard.instances.content.deleteInstance.fields.name,
						classes: [],
						onChange: (languages, language, user) => (value) => {},
					},
				],
			},
		],
	};
};
const version = require("../../api/v1/version");
module.exports = (req, res, instances) => {
  return {
    id: "instances",
    icon: "/static/images/play.png",
    invert: true,
    title: req.language.dashboard.instances.title,
    visible: true,
    content: [
      ...instances.buttons,
      {
        post: {
          title: req.language.dashboard.instances.content.addInstance.post,
          onChange: (languages, language, user) => async (button) => {
            let name = document.getElementById("instances-name");
            let gameversion = document.getElementById("instances-gameversion");

            if (
              name.value.length < 5 ||
              name.value.length > 255 ||
              name.value.contains("-")
            ) {
              name.classList.add("incorrect");
              return;
            }

            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open(
              `GET`,
              `/api/v1/database/users/${name.classList[0]}`,
              true
            );
            xhr.setRequestHeader(`Content-Type`, `application/json`);
            xhr.onreadystatechange = async (e) => {
              if (e.target.readyState === XMLHttpRequest.DONE) {
                if (
                  JSON.parse(e.target.response).instances &&
                  JSON.parse(e.target.response).instances.find(
                    (instance) => instance.name === name.value
                  )
                )
                  return name.classList.add("incorrect");

                let data = {};
                data.$push = {};
                data.$push.instances = {
                  name: name.value,
                  gameversion: gameversion.value,
                  mods: [],
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
            id: `instances-name`,
            title:
              req.language.dashboard.instances.content.addInstance.fields.name,
            classes: [req.user.discordId],
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "select",
            id: "instances-gameversion",
            title:
              req.language.dashboard.instances.content.addInstance.fields
                .gameVersion,
            options: version.gameVersions,
            classes: [],
            getText: (languages, language, user) => (value) => value,
            onChange: (languages, language, user) => (value) => {},
          },
        ],
      },
    ],
  };
};

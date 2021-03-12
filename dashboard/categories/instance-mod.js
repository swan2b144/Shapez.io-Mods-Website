const languages = require("../../api/v1/languages");
module.exports = (req, res, instance, modInstance, mod) => {
  return {
    back: `instance-${instance.name}`,
    id: `instance-${instance.name}-mod-${mod.modid}-${instance.index}-${modInstance.index}`,
    icon: "/static/images/play.png",
    invert: true,
    title: `${instance.name} - ${mod.name}`,
    visible: false,
    content: [
      {
        post: {
          title: req.language.dashboard.instances.content.updateInstance.post,
          onChange: (languages, language, user) => (button) => {
            let idList = document
              .getElementsByClassName("category active")[0]
              .id.split("-");
            let instanceName = idList[1];
            let modId = `${idList[3]}-${idList[4]}-${idList[5]}-${idList[6]}-${idList[7]}`;
            let instanceIndex = idList[8];
            let modIndex = idList[9];
            let config = document.getElementById(
              `instances-${instanceName}-mod-${modId}-config`
            );
            let settings = document.getElementById(
              `instances-${instanceName}-mod-${modId}-settings`
            );
            let version = document.getElementById(
              `instances-${instanceName}-mod-${modId}-version`
            );
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
              data[
                `instances.${instanceIndex}.mods.${modIndex}.config`
              ] = configJson;
              data[
                `instances.${instanceIndex}.mods.${modIndex}.settings`
              ] = settingsJson;
              data[`instances.${instanceIndex}.mods.${modIndex}.version`] =
                version.value;
              data[
                `instances.${instanceIndex}.mods.${modIndex}.url`
              ] = `/static/mods/${modId}/${version.value}.js`;

              let patch = new XMLHttpRequest();
              patch.withCredentials = true;
              patch.open(`PATCH`, `/api/v1/database/users`, true);
              patch.setRequestHeader(`Content-Type`, `application/json`);
              patch.onreadystatechange = async (e) => {
                if (e.target.readyState === XMLHttpRequest.DONE) {
                  if (e.target.status !== 200)
                    return settings.classList.add("incorrect");

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
        content: [
          {
            type: "select",
            id: `instances-${instance.name}-mod-${mod.modid}-version`,
            title:
              req.language.dashboard.instances.content.updateInstance.fields
                .version,
            options: mod.versions.map((version) => version.id),
            value: modInstance.version,
            classes: [],
            getText: (languages, language, user) => (value) => value,
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "textarea",
            id: `instances-${instance.name}-mod-${mod.modid}-config`,
            value: JSON.stringify(modInstance.config, null, 4),
            title:
              req.language.dashboard.instances.content.updateInstance.fields
                .config,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
          {
            type: "textarea",
            id: `instances-${instance.name}-mod-${mod.modid}-settings`,
            value: JSON.stringify(modInstance.settings, null, 4),
            title:
              req.language.dashboard.instances.content.updateInstance.fields
                .settings,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
        ],
      },
      {
        contentType: "var",
        id: `instances-${instance.name}-mod-${mod.modid}-delete-modName`,
        value: mod.name,
      },
      {
        contentType: "var",
        id: `instances-${instance.name}-mod-${mod.modid}-delete-userId`,
        value: req.user.discordId,
      },
      {
        post: {
          red: true,
          title: req.language.dashboard.mods.content.deleteMod.post,
          onChange: (languages, language, user) => async (button) => {
            let idList = document
              .getElementsByClassName("category active")[0]
              .id.split("-");
            let instanceName = idList[1];
            let modId = `${idList[3]}-${idList[4]}-${idList[5]}-${idList[6]}-${idList[7]}`;
            let instanceIndex = idList[8];
            let modIndex = idList[9];
            let modName = document.getElementById(
              `instances-${instanceName}-mod-${modId}-delete-modName`
            );
            let userId = document.getElementById(
              `instances-${instanceName}-mod-${modId}-delete-userId`
            );
            let name = document.getElementById(
              `instances-${instanceName}-mod-${modId}-delete`
            );

            if (
              name.value.length < 5 ||
              name.value.length > 255 ||
              name.value !== modName.getAttribute("value")
            ) {
              name.classList.add("incorrect");
              return;
            }

            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open(
              `GET`,
              `/api/v1/database/users/${userId.getAttribute("value")}`,
              true
            );
            xhr.setRequestHeader(`Content-Type`, `application/json`);
            xhr.onreadystatechange = async (e) => {
              if (e.target.readyState === XMLHttpRequest.DONE) {
                if (e.target.status !== 200)
                  return name.classList.add("incorrect");
                if (
                  !JSON.parse(e.target.response).instances ||
                  !JSON.parse(e.target.response).instances.find(
                    (instance) => instance.name === instanceName
                  )
                )
                  return name.classList.add("incorrect");

                let data = {};
                data.$pull = {};
                data.$pull[`instances.${instanceIndex}.mods`] = {
                  id: modId,
                };
                let xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open(`PATCH`, `/api/v1/database/users/`, true);
                xhr.setRequestHeader(`Content-Type`, `application/json`);
                xhr.onreadystatechange = async (e) => {
                  if (e.target.readyState === XMLHttpRequest.DONE) {
                    if (e.target.status === 200)
                      window.location.href =
                        "/dashboard/instance-" + instanceName;
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
            id: `instances-${instance.name}-mod-${mod.modid}-delete`,
            title: req.language.dashboard.mods.content.deleteMod.fields.name,
            classes: [],
            onChange: (languages, language, user) => (value) => {},
          },
        ],
      },
    ],
  };
};

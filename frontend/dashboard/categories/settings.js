const languages = require("../../api/v1/languages");
module.exports = (req, res) => {
  return {
    id: "settings",
    icon: "/static/images/settings.png",
    invert: true,
    title: req.language.dashboard.settings.title,
    visible: true,
    content: [
      {
        contentType: "setting",
        type: "enum",
        options: Object.keys(languages.languages),
        getText: (languages, language, user) => (option) => {
          return languages[option].name;
        },
        onChange: (languages, language, user) => (option) => {
          let xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
              window.location.reload();
            }
          };
          xhr.open(`PATCH`, `/api/v1/database/users/`, true);
          xhr.setRequestHeader(`Content-Type`, `application/json`);
          xhr.send(
            JSON.stringify({
              [`settings.language`]: option,
            })
          );
        },
        value: req.user.settings.language,
        title: req.language.dashboard.settings.content.language.title,
        desc: req.language.dashboard.settings.content.language.description,
      },
      // {
      //     contentType: "setting",
      //     type: "range",
      //     min: 0,
      //     max: 200,
      //     step: 2,
      //     getText: (value) => Math.floor(value) + "%",
      //     onChange: (value) => {
      //         console.log(value);
      //     },
      //     value: 6,
      //     title: "Geluidsvolume",
      //     desc: "Stel het volume voor geluidseffecten in.",
      // },
      {
        contentType: "setting",
        type: "boolean",
        onChange: (languages, language, user) => (value) => {
          let xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.open(`PATCH`, `/api/v1/database/users/`, true);
          xhr.setRequestHeader(`Content-Type`, `application/json`);
          xhr.send(
            JSON.stringify({
              [`settings.publicTag`]: value,
            })
          );
        },
        value: req.user.settings.publicTag,
        title: req.language.dashboard.settings.content.publicTag.title,
        desc: req.language.dashboard.settings.content.publicTag.description,
      },
      {
        title: "Profile",
        contentType: "form",
        content: [
          {
            type: "page",
            id: "profile-page",
            classes: [],
            value: req.user.description,
            onChange: (languages, language, user) => (value) => {
              let xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              xhr.open(`PATCH`, `/api/v1/database/users/`, true);
              xhr.setRequestHeader(`Content-Type`, `application/json`);
              xhr.send(
                JSON.stringify({
                  [`description`]: value,
                })
              );
            },
          },
        ],
      },
      {
        contentType: "button",
        title:
          req.language.dashboard.settings.content.steam +
          (req.user.settings.steam ? ": " + req.user.settings.steam : ""),
        desc: "",
        href: `${process.env.HOST}${
          process.env.ENABLE_PORT === "true" ? ":" + process.env.PORT : ""
        }/api/v1/auth/login-steam`,
      },
    ],
  };
};

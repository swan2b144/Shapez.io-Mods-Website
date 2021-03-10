(() => {
  var t = {
      990: (t, e, n) => {
        "use strict";
        n.r(e), n.d(e, { AboutModsState: () => a });
        class a extends shapezAPI.exports.TextualGameState {
          constructor() {
            super("AboutModsState");
          }
          getStateHeaderTitle() {
            return shapezAPI.translations.aboutMods.title;
          }
          getMainContentHTML() {
            return `<div class="head"><div class="logo"><img src="${shapezAPI.exports.cachebust(
              "res/logo.png"
            )}" alt="shapez.io Logo"><span class="updateLabel">Mods</span></div></div><div class="text">${
              shapezAPI.translations.aboutMods.text
            }</div>`;
          }
          onEnter() {}
        }
      },
      469: (t, e, n) => {
        "use strict";
        n.r(e), n.d(e, { ModsState: () => o }), n(990);
        var a = n(411);
        class o extends shapezAPI.exports.TextualGameState {
          constructor() {
            super("ModsState");
          }
          getStateHeaderTitle() {
            return shapezAPI.translations.mods.title;
          }
          getMainContentHTML() {
            return `<div class="sidebar"><button class="styledButton categoryButton" data-category-btn="installedMods">${
              shapezAPI.translations.mods.categories.installedmods
            }</button><button class="styledButton categoryButton" data-category-btn="exploreMods">${
              shapezAPI.translations.mods.categories.exploreMods
            }</button><button class="styledButton categoryButton" data-category-btn="exploreModpacks">${
              shapezAPI.translations.mods.categories.exploreModpacks
            }</button><div class="other"><button class="styledButton aboutButton" data-category-btn="exploreModpacks">${
              shapezAPI.translations.aboutMods.title
            }</button></div></div><div class="categoryContainer"><div class="category" data-category="installedMods">${this.getMods()}</div></div>`;
          }
          getMods() {
            let t = "";
            for (const [e, n] of shapezAPI.mods)
              t += `<a class="setting cardbox enabled mod-settings-card-${e}"><div class="row"><label>${n.title}</label></div><div class="desc">${n.description}</div></a>`;
            return t;
          }
          onEnter() {
            this.htmlElement.querySelectorAll("a[href]").forEach((t) => {
              this.trackClicks(
                t,
                () =>
                  this.app.platformWrapper.openExternalLink(
                    t.getAttribute("href")
                  ),
                { preventClick: !0 }
              );
            }),
              this.initCategoryTrackClicks(),
              this.htmlElement
                .querySelector(".category")
                .classList.add("active"),
              this.htmlElement
                .querySelector(".categoryButton")
                .classList.add("active");
          }
          initCategoryTrackClicks() {
            const t = this.htmlElement.querySelector(
              "[data-category-btn='installedMods']"
            );
            this.trackClicks(
              t,
              () => {
                this.setActiveCategory("installedMods");
              },
              { preventDefault: !1 }
            );
            const e = this.htmlElement.querySelector(
              "[data-category-btn='exploreMods']"
            );
            this.trackClicks(
              e,
              () => {
                window.open("http://thomasbrants.nl/mods", "_blank").focus();
              },
              { preventDefault: !1 }
            );
            const n = this.htmlElement.querySelector(
              "[data-category-btn='exploreModpacks']"
            );
            this.trackClicks(
              n,
              () => {
                window.open("http://thomasbrants.nl/mods", "_blank").focus();
              },
              { preventDefault: !1 }
            );
            const o = this.htmlElement.querySelector(".aboutButton");
            this.trackClicks(
              o,
              () => {
                this.moveToStateAddGoBack("AboutModsState");
              },
              { preventDefault: !1 }
            );
            for (const [t, e] of shapezAPI.mods)
              Object.keys(e.settings).length > 0 &&
                this.trackClicks(
                  this.htmlElement.querySelector(`.mod-settings-card-${t}`),
                  () => {
                    (a.ModSettingsState.modId = t),
                      this.moveToStateAddGoBack("ModSettingsState");
                  },
                  { preventClick: !0 }
                );
          }
          setActiveCategory(t) {
            const e = this.htmlElement.querySelector(".category.active"),
              n = this.htmlElement.querySelector(".categoryButton.active");
            if (e.getAttribute("data-category") == t) return;
            e.classList.remove("active"), n.classList.remove("active");
            const a = this.htmlElement.querySelector(
                "[data-category='" + t + "']"
              ),
              o = this.htmlElement.querySelector(
                "[data-category-btn='" + t + "']"
              );
            a.classList.add("active"), o.classList.add("active");
          }
        }
        const s = (t) => ({
          htmlClass: "CreateModButton",
          text: t,
          action: (t) => () => {
            t.app.analytics.trackUiClick("create_mod"),
              shapezAPI.exports.generateFileDownload(
                "Basic_mod_layout.js",
                "http://thomasbrants.nl:3000/mods/"
              );
          },
        });
        (o.setAPI = (t) => {
          shapezAPI.exports.MainMenuState.extraTopButtons.push({
            htmlClass: "mods-list-button",
            htmlData: "data-icon='main_menu/mods.png'",
          }),
            shapezAPI.exports.MainMenuState.extraTrackClicks.push({
              htmlElement: ".mods-list-button",
              action: (t) => () => {
                t.moveToState("ModsState");
              },
              options: { preventDefault: !1 },
            }),
            shapezAPI.mods.get(t).settings.hasMakeModButton.value &&
              shapezAPI.exports.MainMenuState.extraSmallButtons.push(
                s(shapezAPI.translations.mainMenu.createMod)
              );
        }),
          (o.updateStaticTranslations = (t, e) => {
            shapezAPI.mods.get(t).settings.hasMakeModButton.value &&
              (shapezAPI.exports.MainMenuState.extraSmallButtons.find(
                (t) => "CreateModButton" === t.htmlClass
              ).text = shapezAPI.translations.mainMenu.createMod);
          }),
          (o.updateStaticSettings = (t) => {
            shapezAPI.mods.get(t).settings.hasMakeModButton.value
              ? shapezAPI.exports.MainMenuState.extraSmallButtons.push(
                  s(shapezAPI.translations.mainMenu.createMod)
                )
              : shapezAPI.exports.MainMenuState.extraSmallButtons.splice(
                  shapezAPI.exports.MainMenuState.extraSmallButtons.findIndex(
                    (t) => "CreateModButton" === t.htmlClass
                  ),
                  1
                );
          });
      },
      411: (t, e, n) => {
        "use strict";
        n.r(e), n.d(e, { ModSettingsState: () => c });
        class a {
          constructor(t, e, n, a, o, s) {
            (this.id = t),
              (this.changeCb = o),
              (this.enabledCb = s),
              (this.value = e),
              (this.title = n),
              (this.description = a);
          }
          getHtmlElement() {
            return document.querySelector(
              "[data-mod-setting='" + this.id + "']"
            );
          }
          setup() {}
          getHtml() {
            return `<div class="setting cardbox ${
              this.getIsAvailable() ? "enabled" : "disabled"
            }"><div class="row"><label>${
              this.title
            }</label>${this.getTypeHtml()}</div><div class="desc">${
              this.description
            }</div></div>`;
          }
          getTypeHtml() {
            return "";
          }
          getIsAvailable() {
            return !this.enabledCb || this.enabledCb();
          }
        }
        class o extends a {
          constructor(t, e, n, a, o, s) {
            super(t, e, n, a, o, s);
          }
          getTypeHtml() {
            return `<div class="value checkbox ${
              this.value ? "checked" : ""
            }" data-mod-setting="${this.id}"><span class="knob"></span></div>`;
          }
          modify() {
            (this.value = !this.value),
              this.getHtmlElement().classList.toggle("checked"),
              this.changeCb && this.changeCb(this.value);
          }
        }
        class s extends a {
          constructor(t, e, n, a, o, s, i, c) {
            super(t, e, o, s, i, c), (this.options = n), (this.textGetter = a);
          }
          getTypeHtml() {
            return `<div class="value enum" data-mod-setting="${this.id}">${this.value}</div>`;
          }
          modify(t) {
            const { optionSelected: e } = t.showOptionChooser(this.title, {
              active: this.value,
              options: this.options.map((t) => ({
                value: t,
                text: this.textGetter(t),
                desc: "",
                iconPrefix: null,
              })),
            });
            e.add((t) => {
              let e = "???";
              this.options.indexOf(t) >= 0
                ? ((e = this.textGetter(t)), (this.value = t))
                : console.warn(
                    "Setting value",
                    t,
                    "not found for",
                    this.id,
                    "!"
                  ),
                (this.getHtmlElement().innerHTML = e),
                this.changeCb && this.changeCb(this.value);
            }, this);
          }
        }
        class i extends a {
          constructor(t, e, n, a, o, s, i, c, r) {
            super(t, e, s, i, c, r),
              (this.min = n),
              (this.max = a),
              (this.stepSize = o);
          }
          getTypeHtml() {
            return `<div class="value rangeInputContainer noPressEffect" data-mod-setting="${this.id}"><label>${this.value}</label><input class="rangeInput" type="range" value="${this.value}" min="${this.min}" max="${this.max}" step="${this.stepSize}"></div>`;
          }
          updateLabels() {
            const t = Math.round(
              Number(
                100 *
                  this.getHtmlElement().querySelector("input.rangeInput").value
              ) / 100
            );
            this.getHtmlElement().querySelector(
              "label"
            ).innerText = t.toString();
          }
          setup() {
            this.getHtmlElement()
              .querySelector("input.rangeInput")
              .addEventListener("input", () => {
                this.updateLabels();
              }),
              this.getHtmlElement()
                .querySelector("input.rangeInput")
                .addEventListener("change", () => {
                  this.modify();
                });
          }
          modify() {
            (this.value = Math.round(
              Number(
                100 *
                  this.getHtmlElement().querySelector("input.rangeInput").value
              ) / 100
            )),
              this.changeCb && this.changeCb(this.value);
          }
        }
        class c extends shapezAPI.exports.TextualGameState {
          constructor() {
            super("ModSettingsState"), (this.settings = {});
          }
          getStateHeaderTitle() {
            return (
              shapezAPI.mods.get(c.modId).title +
              " " +
              shapezAPI.translations.settings.title
            );
          }
          getMainContentHTML() {
            return `${this.getSettings()} `;
          }
          getSettings() {
            let t = "";
            const e = shapezAPI.mods.get(c.modId).settings;
            for (const n in e)
              if (e.hasOwnProperty(n))
                if ("bool" === e[n].type) {
                  const a = new o(
                    n,
                    e[n].value,
                    e[n].title,
                    e[n].description,
                    (t) => {
                      (e[n].value = t),
                        this.updateSetting(n, t),
                        shapezAPI.mods.get(c.modId).updateStaticSettings();
                    },
                    () => e[n].enabled()
                  );
                  (t += a.getHtml()), (this.settings[n] = a);
                } else if ("enum" === e[n].type) {
                  const a = new s(
                    n,
                    e[n].value,
                    e[n].options,
                    e[n].textGetter,
                    e[n].title,
                    e[n].description,
                    (t) => {
                      (e[n].value = t),
                        this.updateSetting(n, t),
                        shapezAPI.mods.get(c.modId).updateStaticSettings();
                    },
                    () => e[n].enabled()
                  );
                  (t += a.getHtml()), (this.settings[n] = a);
                } else if ("range" === e[n].type) {
                  const a = new i(
                    n,
                    e[n].value,
                    e[n].min,
                    e[n].max,
                    e[n].stepSize,
                    e[n].title,
                    e[n].description,
                    (t) => {
                      (e[n].value = t),
                        this.updateSetting(n, t),
                        shapezAPI.mods.get(c.modId).updateStaticSettings();
                    },
                    () => e[n].enabled()
                  );
                  (t += a.getHtml()), (this.settings[n] = a);
                }
            return t;
          }
          updateSetting(t, e) {
            let n = JSON.parse(localStorage.getItem("instance")),
              a = n.index,
              o = n.mods.find((t) => t.id === c.modId).index;
            n.mods[o].settings[t] || (n.mods[o].settings[t] = {}),
              (n.mods[o].settings[t].value = e),
              localStorage.setItem("instance", JSON.stringify(n));
            let s = {};
            s[`instances.${a}.mods.${o}.settings.${t}.value`] = e;
            let i = new XMLHttpRequest();
            (i.withCredentials = !0),
              i.open(
                "PATCH",
                "http://mods.thomasbrants.nl/api/v1/database/users",
                !0
              ),
              i.setRequestHeader("Content-Type", "application/json"),
              i.send(JSON.stringify(s));
          }
          onEnter() {
            for (const t in this.settings)
              this.settings.hasOwnProperty(t) &&
                (this.settings[t].setup(),
                this.trackClicks(
                  this.settings[t].getHtmlElement(),
                  () => {
                    this.settings[t].modify(this.dialogs);
                  },
                  { preventDefault: !1 }
                ));
          }
        }
        c.modId = void 0;
      },
    },
    e = {};
  function n(a) {
    if (e[a]) return e[a].exports;
    var o = (e[a] = { exports: {} });
    return t[a](o, o.exports, n), o.exports;
  }
  (n.d = (t, e) => {
    for (var a in e)
      n.o(e, a) &&
        !n.o(t, a) &&
        Object.defineProperty(t, a, { enumerable: !0, get: e[a] });
  }),
    (n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (n.r = (t) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (() => {
      const { AboutModsState: t } = n(990),
        { ModsState: e } = n(469),
        { ModSettingsState: a } = n(411),
        o = "a18121cf-fc7c-4f23-906d-b7ab0512bbc8";
      registerMod({
        title: "Modlist",
        id: o,
        description: "The mod that adds the mods list",
        authors: ["DJ1TJOO"],
        version: "1.0.0",
        gameVersion: 1007,
        dependencies: [],
        incompatible: [],
        settings: {
          hasMakeModButton: {
            type: "bool",
            value: !1,
            title: "Make mod button",
            description: "Enable/Disable the make mod button",
            enabled: () => !0,
          },
        },
        translations: {
          en: {
            [o]: { description: "The mod that adds the mods list" },
            modSettings: { title: "Mod settings" },
            aboutMods: {
              title: "About mods",
              text: "This is a page about mods",
            },
            mods: {
              title: "Mods",
              categories: {
                installedmods: "Installed mods",
                exploreMods: "Explore mods",
                exploreModpacks: "Explore modpacks",
              },
            },
            mainMenu: { createMod: "Create a mod" },
            settings: {
              labels: {
                hasMakeModButton: {
                  title: "Make mod button",
                  description: "Enable/Disable the make mod button",
                },
              },
            },
          },
          nl: {
            [o]: { description: "De mod die de mod lijst toevoegd" },
            modSettings: { title: "Mod instellingen" },
            aboutMods: { title: "Over mods", text: "Dit is een pagina mods" },
            mods: {
              title: "Mods",
              categories: {
                installedmods: "Geïnstalleerde mods",
                exploreMods: "Verken mods",
                exploreModpacks: "Verken modpacks",
              },
            },
            mainMenu: { createMod: "Maak een mod" },
            settings: {
              labels: {
                hasMakeModButton: {
                  title: "Maak een mod knop",
                  description: "Schakel de make mod knop in/uit",
                },
              },
            },
          },
        },
        updateStaticSettings: () => {
          e.updateStaticSettings(o);
        },
        updateStaticTranslations: (t) => {
          shapezAPI.mods.get(o).description =
            shapezAPI.translations[o].description;
          for (let t = 0; t < shapezAPI.modOrder.length; t++) {
            const e = shapezAPI.modOrder[t];
            for (const t in shapezAPI.mods.get(e).settings) {
              const n = shapezAPI.mods.get(e).settings[t];
              (n.title = shapezAPI.translations.settings.labels[t].title),
                (n.description =
                  shapezAPI.translations.settings.labels[t].description);
            }
          }
          e.updateStaticTranslations(o, t);
        },
        gameInitializedRootClasses: (t) => {},
        gameInitializedRootManagers: (t) => {},
        gameBeforeFirstUpdate: (t) => {},
        main: (n) => {
          shapezAPI.injectCss(
            '/* Forces an element to get rendered on its own layer, increasing\nthe performance when animated. Use only transform and opacity in animations! */\n/** Increased click area for this element, helpful on mobile */\nbutton,\n.increasedClickArea {\n  position: relative; }\n  button::after,\n  .increasedClickArea::after {\n    content: "";\n    position: absolute;\n    top: D(-15px);\n    bottom: D(-15px);\n    left: D(-15px);\n    right: D(-15px); }\n\n/* Duplicates an animation and adds two classes .<classPrefix>Even and .<classPrefix>Odd which uses the\n  animation. This can be used to replay the animation by toggling between the classes, because\n  it is not possible to restart a css animation */\n/* Allows to use and define an animation without specifying its name */\n/* Animation prefab for a double bounce pop-in animation, useful for dialogs */\n/* Define a style which is only applied in horizontal mode */\n/* Define a style which is only applied in vertical mode */\n/* Define a style which is only while the hardware keyboard is open */\n/* Automatically transforms the game state if a hardware keyboard is open */\n/* Define a style which is only applied when the viewport is at least X pixels wide */\n/* Define a style which is only applied when the viewport is at least X pixels height */\n/* Define a style which is only applied when the viewport has at least the given dimensions */\n/* Define a style which is only applied when the viewport has at maximum the given dimensions */\n/* Define a style which is only applied when the viewport has at maximum the given height */\n/* Define a style which is only applied when the viewport has at maximum the given width */\n/* String replacement */\n.CreateModButton {\n  margin-top: calc(15px * var(--ui-scale))    ;\n  margin-left: calc(15px * var(--ui-scale))    ; }\n  .CreateModButton::after {\n    content: "";\n    position: absolute;\n    top: calc(0px * var(--ui-scale));\n    bottom: calc(0px * var(--ui-scale));\n    left: calc(0px * var(--ui-scale));\n    right: calc(0px * var(--ui-scale)); }\n\n.mods-list-button {\n  width: calc(25px * var(--ui-scale))    ;\n  height: calc(25px * var(--ui-scale))    ;\n  pointer-events: all;\n  cursor: pointer;\n  transition: opacity 0.12s ease-in-out;\n  opacity: 0.7; }\n  .mods-list-button {\n    background: url(data:image/png;base64,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) center center/contain no-repeat; }\n  .mods-list-button::after {\n    content: "";\n    position: absolute;\n    top: calc(-2px * var(--ui-scale));\n    bottom: calc(-2px * var(--ui-scale));\n    left: calc(-2px * var(--ui-scale));\n    right: calc(-2px * var(--ui-scale)); }\n  .mods-list-button:hover {\n    opacity: 1; }\n\n#state_ModsState .container .content {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  grid-gap: calc(10px * var(--ui-scale))    ; }\n  @media (max-width: 1000px) {\n    #state_ModsState .container .content {\n      grid-template-columns: 1fr;\n      grid-template-rows: auto 1fr; } }\n  #state_ModsState .container .content .sidebar {\n    display: grid;\n    min-width: calc(210px * var(--ui-scale))    ;\n    max-width: calc(320px * var(--ui-scale))    ;\n    grid-gap: calc(3px * var(--ui-scale))    ;\n    grid-template-rows: auto auto auto auto auto 1fr; }\n    @media (max-width: 1000px) {\n      #state_ModsState .container .content .sidebar {\n        grid-template-rows: 1fr 1fr;\n        grid-template-columns: auto auto;\n        max-width: unset !important; } }\n    #state_ModsState .container .content .sidebar button {\n      text-align: left;\n      width: 100%;\n      box-sizing: border-box; }\n      #state_ModsState .container .content .sidebar button::after {\n        content: unset; }\n      @media (max-width: 1000px) {\n        #state_ModsState .container .content .sidebar button {\n          text-align: center; } }\n    #state_ModsState .container .content .sidebar .other {\n      margin-top: calc(10px * var(--ui-scale))    ;\n      align-self: end; }\n      @media (max-width: 1000px) {\n        #state_ModsState .container .content .sidebar .other {\n          margin-top: 0; } }\n    #state_ModsState .container .content .sidebar button.styledButton {\n      background-color: #eeeff5;\n      color: #777a7f; }\n      #state_ModsState .container .content .sidebar button.styledButton.active {\n        background-color: #4a97df;\n        color: #fff; }\n        #state_ModsState .container .content .sidebar button.styledButton.active:hover {\n          opacity: 1; }\n      #state_ModsState .container .content .sidebar button.styledButton.pressed {\n        transform: none !important; }\n    #state_ModsState .container .content .sidebar .versionbar {\n      margin-top: calc(10px * var(--ui-scale))    ;\n      font-size: calc(10px * var(--ui-scale));\n      line-height: calc(13px * var(--ui-scale));\n      font-weight: 400;\n      font-family: "GameFont", sans-serif;\n      letter-spacing: 0.04em;\n      display: grid;\n      align-items: center;\n      grid-template-columns: 1fr auto; }\n      @media (max-width: 1000px) {\n        #state_ModsState .container .content .sidebar .versionbar {\n          display: none; } }\n      #state_ModsState .container .content .sidebar .versionbar .buildVersion {\n        display: flex;\n        flex-direction: column;\n        color: #aaadaf; }\n  #state_ModsState .container .content .categoryContainer {\n    overflow-y: scroll;\n    pointer-events: all;\n    padding-right: calc(10px * var(--ui-scale))    ; }\n    #state_ModsState .container .content .categoryContainer .category {\n      display: none; }\n      #state_ModsState .container .content .categoryContainer .category.active {\n        display: block; }\n      #state_ModsState .container .content .categoryContainer .category .setting {\n        display: block;\n        color: #777a7f;\n        padding: calc(10px * var(--ui-scale))    ;\n        background: #eeeff5;\n        border-radius: calc(2px * var(--ui-scale))    ;\n        margin-bottom: calc(5px * var(--ui-scale))    ; }\n        #state_ModsState .container .content .categoryContainer .category .setting .desc {\n          margin-top: calc(5px * var(--ui-scale))    ;\n          font-size: calc(13px * var(--ui-scale));\n          line-height: calc(17px * var(--ui-scale));\n          font-weight: 400;\n          font-family: "GameFont", sans-serif;\n          letter-spacing: 0.04em;\n          color: #aaadb2; }\n        #state_ModsState .container .content .categoryContainer .category .setting > .row {\n          display: grid;\n          align-items: center;\n          grid-template-columns: 1fr auto; }\n          #state_ModsState .container .content .categoryContainer .category .setting > .row > label {\n            text-transform: uppercase;\n            font-size: calc(16px * var(--ui-scale));\n            line-height: calc(21px * var(--ui-scale));\n            font-weight: 400;\n            font-family: "GameFont", sans-serif;\n            letter-spacing: 0.04em; }\n        #state_ModsState .container .content .categoryContainer .category .setting.disabled {\n          pointer-events: none;\n          position: relative; }\n          #state_ModsState .container .content .categoryContainer .category .setting.disabled * {\n            pointer-events: none !important;\n            cursor: default !important; }\n          #state_ModsState .container .content .categoryContainer .category .setting.disabled .standaloneOnlyHint {\n            font-size: calc(13px * var(--ui-scale));\n            line-height: calc(17px * var(--ui-scale));\n            font-weight: 400;\n            font-family: "GameFont", sans-serif;\n            letter-spacing: 0.04em;\n            position: absolute;\n            top: 0;\n            left: 0;\n            right: 0;\n            bottom: 0;\n            pointer-events: all;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(255, 255, 255, 0.5);\n            text-transform: uppercase;\n            color: #ef5072; }\n        #state_ModsState .container .content .categoryContainer .category .setting .value.enum {\n          background: #fff;\n          font-size: calc(13px * var(--ui-scale));\n          line-height: calc(17px * var(--ui-scale));\n          font-weight: 400;\n          font-family: "GameFont", sans-serif;\n          letter-spacing: 0.04em;\n          display: flex;\n          align-items: flex-start;\n          pointer-events: all;\n          cursor: pointer;\n          justify-content: center;\n          min-width: calc(100px * var(--ui-scale))    ;\n          border-radius: calc(2px * var(--ui-scale))    ;\n          padding: calc(4px * var(--ui-scale))    ;\n          padding-right: calc(15px * var(--ui-scale))    ;\n          transition: background-color 0.12s ease-in-out; }\n          #state_ModsState .container .content .categoryContainer .category .setting .value.enum {\n            /* @load-async */\n            background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAMFBMVEUAAAA1NTUzMzgzNDgyNTg0NDczNDgyNDg0NDoyNTgyNTgzMzkyNTc0NDczNDgAAAD72jo4AAAADnRSTlMAK3f8W1T7fyxWV1VcWHMRLTIAAAABYktHRACIBR1IAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH5AURCigoBDvPOAAAALlJREFUSMdjYBgFo4D6gBGboAASW9kBU541HcFmemeCqSDsXQGc3fzu2QR0ea68dxZwDncephFh7x4fQPC2vXuM5gqgHhtULpoR21AMwDQCzQBMI9ANQDcCwwB0IzANQDUCiwGoRmAzANkIrAYgG4HdAIQROAwAxi/UCMxwh4EwsAy2mEMxArcBECPwGAAxAp8BDAzX3j2ze5eLWx5kBF4DQK7A4wKIEfgNABqB3wBgal/AMApGwYACAONfYaN5YwyHAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTE3VDEwOjQwOjQwKzAwOjAw4dVEcAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xN1QxMDo0MDo0MCswMDowMJCI/MwAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC) calc(100% - calc(5px * var(--ui-scale))) calc(50% + calc(1px * var(--ui-scale))) / calc(15px * var(--ui-scale)) no-repeat; }\n          #state_ModsState .container .content .categoryContainer .category .setting .value.enum:hover {\n            background-color: #fafafa; }\n\nhtml[data-theme="dark"] #state_ModsState .container .content .sidebar button.categoryButton,\nhtml[data-theme="dark"] #state_ModsState .container .content .sidebar button.about, #state_ModsState[data-theme="dark"] .container .content .sidebar button.categoryButton,\n#state_ModsState[data-theme="dark"] .container .content .sidebar button.about {\n  color: #ccc;\n  background-color: #3c404a; }\n  html[data-theme="dark"] #state_ModsState .container .content .sidebar button.categoryButton.active,\n  html[data-theme="dark"] #state_ModsState .container .content .sidebar button.about.active, #state_ModsState[data-theme="dark"] .container .content .sidebar button.categoryButton.active,\n  #state_ModsState[data-theme="dark"] .container .content .sidebar button.about.active {\n    color: #fff;\n    background-color: #4a97df; }\n\nhtml[data-theme="dark"] #state_ModsState .container .content .categoryContainer .category .setting, #state_ModsState[data-theme="dark"] .container .content .categoryContainer .category .setting {\n  background: #3c404a; }\n  html[data-theme="dark"] #state_ModsState .container .content .categoryContainer .category .setting .value.enum, #state_ModsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.enum {\n    background-color: #484c58;\n    color: #ddd; }\n    html[data-theme="dark"] #state_ModsState .container .content .categoryContainer .category .setting .value.enum, #state_ModsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.enum {\n      /* @load-async */\n      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA1LTE3VDEyOjQwOjQ2KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wOS0xOVQxMzowOToxMyswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wOS0xOVQxMzowOToxMyswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyZTFkZWMyNS00NDU2LTg2NGUtYjhlOS1kOTc0OTMxMzQzZGQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkMzhlOWE3MC03MDU2LWRhNDgtYjNlMS0zNTAwZTlmZjNiMWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ZWMxZDgwYy03OTZjLWFhNDAtYWJmNi1mYTAyOTA3NDE2ZTIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjhlYzFkODBjLTc5NmMtYWE0MC1hYmY2LWZhMDI5MDc0MTZlMiIgc3RFdnQ6d2hlbj0iMjAyMC0wNS0xN1QxMjo0MDo0NiswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZTFkZWMyNS00NDU2LTg2NGUtYjhlOS1kOTc0OTMxMzQzZGQiIHN0RXZ0OndoZW49IjIwMjAtMDktMTlUMTM6MDk6MTMrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6wUpHvAAABvklEQVR42u3ZTU4CQRAF4FfobXRhJtNh4jk0mBijt3CriSbeQ8SfgyhkBuJCL2PQciFEJAIDdHd1wpsdbOj3zYSpfi2qik2+hAAEIAABCEAAAhCAAAQgAAEIQAACEIAAc66yLHecc+8pB1p2jbUB+v3uORTXojjNXHGXYviq6h0I9F6AqywvLr0BjMLfjD5+pogwDg9gGwAEuKiDsBCgqp53BY1XAFsTXw9FcZy54imF8IOy21JBexx+fKMUX3t5vv/m4Ql4OYRKZ/oHUngSpu/879rkLHPNtsf/gPQQZq+pXvil3wIpIfgIv9IckAKCr/ArD0KWCD7DrzUJWiD4Dr/2KBwTIUR4L3uBGAihwnvbDIVECBne624wBELo8N63wz4RYoQP0gf4QIgVPlghMns+X4wQ+/UarBFaBcFitghaiS2DYDVdBu8E6yBYjtZRStF5CNrQD8vNVbRWuKp6RwK9nQo6/Gmv/rZNCjnJ8+ZDjHVFrcVnPAmw7BainwvMQTApVkwORv5BMKvWzE6GJhDEslc0PRoblN0WAGSueLRaA88GCUAAAhCAAAQgAAEIQAACEIAABCAAAQiwYdc3Lqktn/8nMqoAAAAASUVORK5CYII=); }\n    html[data-theme="dark"] #state_ModsState .container .content .categoryContainer .category .setting .value.enum:hover, #state_ModsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.enum:hover {\n      background-color: #434752; }\n  html[data-theme="dark"] #state_ModsState .container .content .categoryContainer .category .setting .value.checkbox, #state_ModsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.checkbox {\n    background-color: #74767b; }\n    html[data-theme="dark"] #state_ModsState .container .content .categoryContainer .category .setting .value.checkbox.checked, #state_ModsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.checkbox.checked {\n      background-color: #4a97df; }\n\n#state_AboutModsState > .container .content {\n  max-width: calc(600px * var(--ui-scale))    ;\n  font-size: calc(13px * var(--ui-scale));\n  line-height: calc(17px * var(--ui-scale));\n  font-weight: 400;\n  font-family: "GameFont", sans-serif;\n  letter-spacing: 0.04em;\n  padding: 0;\n  background: transparent; }\n\n#state_AboutModsState .head {\n  padding: calc(20px * var(--ui-scale))    ; }\n\n#state_AboutModsState .text {\n  margin: calc(10px * var(--ui-scale))    ; }\n\n#state_AboutModsState a {\n  margin: calc(0px * var(--ui-scale)) calc(3px * var(--ui-scale))   ; }\n\n#state_AboutModsState .logo {\n  display: flex;\n  flex-grow: 1;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  padding-top: calc(20px * var(--ui-scale));\n  position: relative; }\n  #state_AboutModsState .logo img {\n    width: calc(350px * var(--ui-scale)); }\n  #state_AboutModsState .logo .updateLabel {\n    position: absolute;\n    transform: translateX(50%) rotate(-5deg);\n    color: #e74e3a;\n    font-size: calc(19px * var(--ui-scale));\n    line-height: calc(21px * var(--ui-scale));\n    font-weight: 400;\n    font-family: "GameFont", sans-serif;\n    letter-spacing: 0.04em;\n    font-weight: bold;\n    right: calc(40px * var(--ui-scale));\n    bottom: calc(20px * var(--ui-scale));\n    animation: modsStateUpdateLabel 1.3s ease-in-out infinite !important; }\n\n@keyframes modsStateUpdateLabel {\n  50% {\n    transform: translateX(50%) rotate(-7deg) scale(1.1); } }\n\n#state_ModSettingsState .container .content .setting {\n  display: block;\n  height: fit-content;\n  color: #777a7f;\n  padding: calc(10px * var(--ui-scale))    ;\n  background: #eeeff5;\n  border-radius: calc(2px * var(--ui-scale))    ;\n  margin-bottom: calc(5px * var(--ui-scale))    ; }\n  #state_ModSettingsState .container .content .setting .desc {\n    margin-top: calc(5px * var(--ui-scale))    ;\n    font-size: calc(13px * var(--ui-scale));\n    line-height: calc(17px * var(--ui-scale));\n    font-weight: 400;\n    font-family: "GameFont", sans-serif;\n    letter-spacing: 0.04em;\n    color: #aaadb2; }\n  #state_ModSettingsState .container .content .setting > .row {\n    display: grid;\n    align-items: center;\n    grid-template-columns: 1fr auto; }\n    #state_ModSettingsState .container .content .setting > .row > label {\n      text-transform: uppercase;\n      font-size: calc(16px * var(--ui-scale));\n      line-height: calc(21px * var(--ui-scale));\n      font-weight: 400;\n      font-family: "GameFont", sans-serif;\n      letter-spacing: 0.04em; }\n  #state_ModSettingsState .container .content .setting.disabled {\n    pointer-events: none;\n    position: relative; }\n    #state_ModSettingsState .container .content .setting.disabled * {\n      pointer-events: none !important;\n      cursor: default !important; }\n    #state_ModSettingsState .container .content .setting.disabled .standaloneOnlyHint {\n      font-size: calc(13px * var(--ui-scale));\n      line-height: calc(17px * var(--ui-scale));\n      font-weight: 400;\n      font-family: "GameFont", sans-serif;\n      letter-spacing: 0.04em;\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      pointer-events: all;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background: rgba(255, 255, 255, 0.5);\n      text-transform: uppercase;\n      color: #ef5072; }\n  #state_ModSettingsState .container .content .setting .value.enum {\n    background: #fff;\n    font-size: calc(13px * var(--ui-scale));\n    line-height: calc(17px * var(--ui-scale));\n    font-weight: 400;\n    font-family: "GameFont", sans-serif;\n    letter-spacing: 0.04em;\n    display: flex;\n    align-items: flex-start;\n    pointer-events: all;\n    cursor: pointer;\n    justify-content: center;\n    min-width: calc(100px * var(--ui-scale))    ;\n    border-radius: calc(2px * var(--ui-scale))    ;\n    padding: calc(4px * var(--ui-scale))    ;\n    padding-right: calc(15px * var(--ui-scale))    ;\n    transition: background-color 0.12s ease-in-out; }\n    #state_ModSettingsState .container .content .setting .value.enum {\n      /* @load-async */\n      background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAMFBMVEUAAAA1NTUzMzgzNDgyNTg0NDczNDgyNDg0NDoyNTgyNTgzMzkyNTc0NDczNDgAAAD72jo4AAAADnRSTlMAK3f8W1T7fyxWV1VcWHMRLTIAAAABYktHRACIBR1IAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH5AURCigoBDvPOAAAALlJREFUSMdjYBgFo4D6gBGboAASW9kBU541HcFmemeCqSDsXQGc3fzu2QR0ea68dxZwDncephFh7x4fQPC2vXuM5gqgHhtULpoR21AMwDQCzQBMI9ANQDcCwwB0IzANQDUCiwGoRmAzANkIrAYgG4HdAIQROAwAxi/UCMxwh4EwsAy2mEMxArcBECPwGAAxAp8BDAzX3j2ze5eLWx5kBF4DQK7A4wKIEfgNABqB3wBgal/AMApGwYACAONfYaN5YwyHAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTE3VDEwOjQwOjQwKzAwOjAw4dVEcAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xN1QxMDo0MDo0MCswMDowMJCI/MwAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC) calc(100% - calc(5px * var(--ui-scale))) calc(50% + calc(1px * var(--ui-scale))) / calc(15px * var(--ui-scale)) no-repeat; }\n    #state_ModSettingsState .container .content .setting .value.enum:hover {\n      background-color: #fafafa; }\n\nhtml[data-theme="dark"] #state_ModSettingsState .container .content .sidebar button.categoryButton,\nhtml[data-theme="dark"] #state_ModSettingsState .container .content .sidebar button.about, #state_ModSettingsState[data-theme="dark"] .container .content .sidebar button.categoryButton,\n#state_ModSettingsState[data-theme="dark"] .container .content .sidebar button.about {\n  color: #ccc;\n  background-color: #3c404a; }\n  html[data-theme="dark"] #state_ModSettingsState .container .content .sidebar button.categoryButton.active,\n  html[data-theme="dark"] #state_ModSettingsState .container .content .sidebar button.about.active, #state_ModSettingsState[data-theme="dark"] .container .content .sidebar button.categoryButton.active,\n  #state_ModSettingsState[data-theme="dark"] .container .content .sidebar button.about.active {\n    color: #fff;\n    background-color: #4a97df; }\n\nhtml[data-theme="dark"] #state_ModSettingsState .container .content .categoryContainer .category .setting, #state_ModSettingsState[data-theme="dark"] .container .content .categoryContainer .category .setting {\n  background: #3c404a; }\n  html[data-theme="dark"] #state_ModSettingsState .container .content .categoryContainer .category .setting .value.enum, #state_ModSettingsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.enum {\n    background-color: #484c58;\n    color: #ddd; }\n    html[data-theme="dark"] #state_ModSettingsState .container .content .categoryContainer .category .setting .value.enum, #state_ModSettingsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.enum {\n      /* @load-async */\n      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA1LTE3VDEyOjQwOjQ2KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wOS0xOVQxMzowOToxMyswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wOS0xOVQxMzowOToxMyswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyZTFkZWMyNS00NDU2LTg2NGUtYjhlOS1kOTc0OTMxMzQzZGQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkMzhlOWE3MC03MDU2LWRhNDgtYjNlMS0zNTAwZTlmZjNiMWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4ZWMxZDgwYy03OTZjLWFhNDAtYWJmNi1mYTAyOTA3NDE2ZTIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjhlYzFkODBjLTc5NmMtYWE0MC1hYmY2LWZhMDI5MDc0MTZlMiIgc3RFdnQ6d2hlbj0iMjAyMC0wNS0xN1QxMjo0MDo0NiswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZTFkZWMyNS00NDU2LTg2NGUtYjhlOS1kOTc0OTMxMzQzZGQiIHN0RXZ0OndoZW49IjIwMjAtMDktMTlUMTM6MDk6MTMrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6wUpHvAAABvklEQVR42u3ZTU4CQRAF4FfobXRhJtNh4jk0mBijt3CriSbeQ8SfgyhkBuJCL2PQciFEJAIDdHd1wpsdbOj3zYSpfi2qik2+hAAEIAABCEAAAhCAAAQgAAEIQAACEIAAc66yLHecc+8pB1p2jbUB+v3uORTXojjNXHGXYviq6h0I9F6AqywvLr0BjMLfjD5+pogwDg9gGwAEuKiDsBCgqp53BY1XAFsTXw9FcZy54imF8IOy21JBexx+fKMUX3t5vv/m4Ql4OYRKZ/oHUngSpu/879rkLHPNtsf/gPQQZq+pXvil3wIpIfgIv9IckAKCr/ArD0KWCD7DrzUJWiD4Dr/2KBwTIUR4L3uBGAihwnvbDIVECBne624wBELo8N63wz4RYoQP0gf4QIgVPlghMns+X4wQ+/UarBFaBcFitghaiS2DYDVdBu8E6yBYjtZRStF5CNrQD8vNVbRWuKp6RwK9nQo6/Gmv/rZNCjnJ8+ZDjHVFrcVnPAmw7BainwvMQTApVkwORv5BMKvWzE6GJhDEslc0PRoblN0WAGSueLRaA88GCUAAAhCAAAQgAAEIQAACEIAABCAAAQiwYdc3Lqktn/8nMqoAAAAASUVORK5CYII=); }\n    html[data-theme="dark"] #state_ModSettingsState .container .content .categoryContainer .category .setting .value.enum:hover, #state_ModSettingsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.enum:hover {\n      background-color: #434752; }\n  html[data-theme="dark"] #state_ModSettingsState .container .content .categoryContainer .category .setting .value.checkbox, #state_ModSettingsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.checkbox {\n    background-color: #74767b; }\n    html[data-theme="dark"] #state_ModSettingsState .container .content .categoryContainer .category .setting .value.checkbox.checked, #state_ModSettingsState[data-theme="dark"] .container .content .categoryContainer .category .setting .value.checkbox.checked {\n      background-color: #4a97df; }\n\n#ingame_HUD_SettingsMenu .buttons button.mods {\n  background-image: url(data:image/png;base64,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);\n  filter: invert(0); }\n',
            o
          ),
            (shapezAPI.states.ModsState = e),
            (shapezAPI.states.ModSettingsState = a),
            (shapezAPI.states.AboutModsState = t),
            e.setAPI(o),
            shapezAPI.exports.HUDSettingsMenu.buttons.splice(
              shapezAPI.exports.HUDSettingsMenu.buttons.findIndex(
                (t) => "settings" === t.id
              ) + 1,
              0,
              {
                id: "mods",
                action: (t) => () =>
                  t.root.gameState.saveThenGoToState("ModsState", {
                    backToStateId: t.root.gameState.key,
                    backToStatePayload: t.root.gameState.creationPayload,
                  }),
                options: { preventDefault: !1 },
              }
            );
        },
      });
    })();
})();

let baseLanguage = "en";
let en = {
  name: "English",
  navbar: {
    mods: "Mods",
    search: {
      search: "Search",
      allCategories: "All categories",
    },
    about: "About",
    contact: "Contact",
    documentation: "Documentation",
    signin: "Sign in",
    user: {
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
    },
  },
  footer: {
    joinOurDiscord: "Join our discord",
    help: "We'll help you if needed!",
    helpCategories: "Info, Efficient designs, compact factories",
    moddingServer: "Modding server",
  },
  notfound: {
    title: "Page not found",
    description: "The page you were looking for doesn't exist",
  },
  forbidden: {
    title: "Forbidden page",
    description: "You can not access the page you where looking for",
  },
  mods: {
    download: "Download",
    copyId: "Copy id",
    ok: "Ok",
    cancel: "Cancel",
    chooseInstance: "Choose instance",
    chooseOneInstance: "Choose one instance",
    addToInstance: "Add to instance",
    createInstance: "Create instance",
    isntanceName: "Name",
    instanceExistError: "Instance already exists",
    instanceNameError: "Instance name must be between 5 and 255 characters",
    modOTW: "Mod of the week",
    mobBy: "By",
    search: "Search",
    searchOptions: {
      verified: { title: "Verified" },
      type: {
        title: "Type",
        mod: "Mod",
        modpack: "Modpack",
      },
      categories: {
        title: "Categories",
        //TODO: categories
        categorie1: "Categorie1",
        categorie2: "Categorie2",
        categorie3: "Categorie3",
        categorie4: "Categorie4",
        categorie5: "Categorie5",
        categorie6: "Categorie6",
      },
    },
  },
  dashboard: {
    title: "Dashboard",
    upload: "Upload",
    uploaded: "Uploaded",
    instances: {
      title: "Instances",
      content: {
        play: "Play",
        updateInstance: {
          post: "Update instance",
          fields: {
            name: "Name",
            config: "Config",
            settings: "Settings",
            version: "Version",
          },
        },
        addInstance: {
          post: "Add instance",
          fields: {
            name: "Name",
            gameVersion: "Game version",
          },
        },
        deleteInstance: {
          post: "Delete instance",
          fields: {
            name: "Name",
          },
        },
        addMod: {
          post: "Add mod",
          fields: {
            id: "Mod id",
          },
        },
      },
    },
    settings: {
      title: "Settings",
      content: {
        language: {
          title: "Language",
          description:
            "Change the language. All translations are user contributions and may not be complete!",
        },
        publicTag: {
          title: "Public tag",
          description: "Change the visibility of your discord tag",
        },
        profile: {
          title: "Profile",
        },
      },
    },
    verify: {
      title: "Verify",
      content: {
        mod: {
          post: "(Un)verify mod",
          fields: {
            id: "Mod id",
          },
        },
        modpack: {
          post: "(Un)verify modpack",
          fields: {
            id: "Modpack id",
          },
        },
      },
    },
    modpacks: {
      title: "Modpacks",
      content: {
        versions: {
          title: "Versions",
          post: "Update version",
          fields: {
            version: "Version",
            delete: "Delete version",
            name: "Name",
            bundle: "Bundle",
          },
        },
        addVersion: {
          post: "Add version",
        },
        updateModpack: {
          post: "Update modpack",
        },
        deleteModpack: {
          post: "Delete modpack",
          fields: {
            delete: "Name",
          },
        },
        addModpack: {
          title: "Add new modpack",
          post: "Add modpack",
          fields: {
            name: "Name",
            description: "Description",
            modpackPage: "Modpack page",
            preview: "Preview",
            modpackId: "Modpack id",
            collaborators: "collaborators",
            mods: "Mods",
            version: "Version",
            gameVersion: "Game version",
            photos: "Photos",
            bundle: "Bundle",
          },
        },
      },
    },
    mods: {
      title: "Mods",
      content: {
        versions: {
          title: "Versions",
          post: "Update version",
          fields: {
            version: "Version",
            delete: "Delete version",
            name: "Name",
            bundle: "Bundle",
          },
        },
        addVersion: {
          post: "Add version",
        },
        updateMod: {
          post: "Update mod",
        },
        deleteMod: {
          post: "Delete mod",
          fields: {
            delete: "Name",
          },
        },
        addMod: {
          title: "Add new mod",
          post: "Add mod",
          fields: {
            name: "Name",
            description: "Description",
            modPage: "Mod page",
            preview: "Preview",
            modId: "Mod id",
            collaborators: "collaborators",
            version: "Version",
            gameVersion: "Game version",
            photos: "Photos",
            bundle: "Bundle",
          },
        },
      },
    },
  },
};
let nl = {
  name: "Nederlands",
  navbar: {
    mods: "Mods",
    search: {
      search: "Zoeken",
      allCategories: "Alle categorieën",
    },
    about: "Over",
    contact: "Contact",
    documentation: "Documentatie",
    signin: "Aanmelden",
    user: {
      profile: "Profiel",
      settings: "Instellingen",
      logout: "Afmelden",
    },
  },
  footer: {
    joinOurDiscord: "Join onze discord",
    help: "Wij helpen u indien nodig!",
    helpCategories: "Info, efficiënte ontwerpen, compacte fabrieken",
    moddingServer: "Modding server",
  },
  notfound: {
    title: "Pagina niet gevonden",
    description: "De pagina die u zocht, bestaat niet",
  },
  forbidden: {
    title: "Verboden pagina",
    description: "U heeft geen toegang tot deze pagina",
  },
  mods: {
    download: "Download",
    copyId: "Kopieer id",
    ok: "Oke",
    cancel: "Annuleer",
    chooseInstance: "Kies een instantie",
    chooseOneInstance: "Kies een instantie",
    addToInstance: "Toevoegen aan instantie",
    createInstance: "Maak een instantie",
    isntanceName: "Naam",
    instanceExistError: "Instantie bestaat al",
    instanceNameError:
      "De instantienaam moet tussen de 5 en 255 tekens lang zijn",
    modOTW: "Mod van de week",
    mobBy: "Door",
    search: "Zoeken",
    searchOptions: {
      verified: { title: "Geverifieerd" },
      type: {
        title: "Type",
        mod: "Mod",
        modpack: "Modpack",
      },
      categories: {
        title: "Categorieën",
        //TODO: categories
        categorie1: "Categorie1",
        categorie2: "Categorie2",
        categorie3: "Categorie3",
        categorie4: "Categorie4",
        categorie5: "Categorie5",
        categorie6: "Categorie6",
      },
    },
  },
  dashboard: {
    title: "Dashboard",
    upload: "Uploaden",
    uploaded: "Geüpload",
    instances: {
      title: "Instanties",
      content: {
        play: "Spelen",
        updateInstance: {
          post: "Instantie bijwerken",
          fields: {
            name: "Naam",
            config: "Configuratie",
            settings: "Instellingen",
            version: "Versie",
          },
        },
        addInstance: {
          post: "Instantie toevoegen",
          fields: {
            name: "Naam",
            gameVersion: "Game versie",
          },
        },
        deleteInstance: {
          post: "Instantie verwijderen",
          fields: {
            name: "Naam",
          },
        },
        addMod: {
          post: "Voeg mod toe",
          fields: {
            id: "Mod id",
          },
        },
      },
    },
    settings: {
      title: "Instellingen",
      content: {
        language: {
          title: "Taal",
          description:
            "Verander de taal. Alle vertalingen zijn gebruikersbijdragen en zijn mogelijk niet volledig!",
        },
        publicTag: {
          title: "Openbare tag",
          description: "Verander de zichtbaarheid van je discord tag",
        },
        profile: {
          title: "Profiel",
        },
      },
    },
    verify: {
      title: "Verifiëren",
      content: {
        mod: {
          post: "Verifieer mod or verificatie ongedaan maken",
          fields: {
            id: "Mod id",
          },
        },
        modpack: {
          post: "Verifieer modpack or verificatie ongedaan maken",
          fields: {
            id: "Modpack id",
          },
        },
      },
    },
    modpacks: {
      title: "Modpacks",
      content: {
        versions: {
          title: "Versies",
          post: "Update versie",
          fields: {
            version: "Versie",
            delete: "Verwijder versie",
            name: "Naam",
            bundle: "Bundle",
          },
        },
        addVersion: {
          post: "Voeg versie toe",
        },
        updateModpack: {
          post: "Update modpack",
        },
        deleteModpack: {
          post: "Verwijder modpack",
          fields: {
            delete: "Naam",
          },
        },
        addModpack: {
          title: "Voeg nieuwe modpack toe",
          post: "Voeg modack toe",
          fields: {
            name: "Naam",
            description: "Beschrijving",
            modpackPage: "Modpack pagina",
            preview: "Voorbeeld",
            modpackId: "Modpack id",
            mods: "Mods",
            collaborators: "Medewerkers",
            version: "Versie",
            gameVersion: "Spel versie",
            photos: "Fotos",
            bundle: "Bundle",
          },
        },
      },
    },
    mods: {
      title: "Mods",
      content: {
        versions: {
          title: "Versies",
          post: "Update versie",
          fields: {
            version: "Versie",
            delete: "Verwijder versie",
            name: "Naam",
            bundle: "Bundle",
          },
        },
        addVersion: {
          post: "Voeg versie toe",
        },
        updateMod: {
          post: "Update mod",
        },
        deleteMod: {
          post: "Verwijder mod",
          fields: {
            delete: "Naam",
          },
        },
        addMod: {
          title: "Voeg nieuwe mod toe",
          post: "Voeg mod toe",
          fields: {
            name: "Naam",
            description: "Beschrijving",
            modPage: "Mod pagina",
            preview: "Voorbeeld",
            modId: "Mod id",
            collaborators: "Medewerkers",
            version: "Versie",
            gameVersion: "Spel versie",
            photos: "Fotos",
            bundle: "Bundle",
          },
        },
      },
    },
  },
};

function matchDataRecursive(dest, src) {
  if (typeof dest !== "object" || typeof src !== "object") {
    return;
  }

  for (const key in dest) {
    if (src[key]) {
      // console.log("copy", key);
      const data = dest[key];
      if (typeof data === "object") {
        matchDataRecursive(dest[key], src[key]);
      } else if (typeof data === "string" || typeof data === "number") {
        // console.log("match string", key);
        dest[key] = src[key];
      } else {
        console.log("Unknown type:", typeof data, "in key", key);
      }
    } else {
      console.log("Src is missing: " + key);
    }
  }
}
module.exports = { baseLanguage, matchDataRecursive, languages: { en, nl } };

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
        settings: {
            title: "Settings",
            content: {
                language: {
                    title: "Language",
                    description: "Change the language. All translations are user contributions and may not be complete!",
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
        mods: {
            title: "Mods",
            content: {
                addMod: {
                    title: "Add new mod",
                    post: "Add mod",
                    fields: {
                        title: "Title",
                        description: "Description",
                        modPage: "Mod page",
                        preview: "Preview",
                        modId: "Mod id",
                        collaberators: "Collaberators",
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
        settings: {
            title: "Instellingen",
            content: {
                language: {
                    title: "Taal",
                    description: "Verander de taal. Alle vertalingen zijn gebruikersbijdragen en zijn mogelijk niet volledig!",
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
        mods: {
            title: "Mods",
            content: {
                addMod: {
                    title: "Voeg nieuwe mod toe",
                    post: "Voeg mod toe",
                    fields: {
                        name: "Naam",
                        description: "Beschrijving",
                        modPage: "Mod pagina",
                        preview: "Voorbeeld",
                        modId: "Mod id",
                        collaberators: "Medewerkers",
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
                logger.log("Unknown type:", typeof data, "in key", key);
            }
        }
    }
}
module.exports = { baseLanguage, matchDataRecursive, languages: { en, nl } };
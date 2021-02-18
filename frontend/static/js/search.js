let modSearch = document.getElementById("mod-search");
let modVerified = document.getElementById("mod-verified");
let modType = document.getElementById("mod-type-mod");
let modpackType = document.getElementById("mod-type-modpack");

modVerified.addEventListener("change", (e) => {
    calculateMods();
});
modType.addEventListener("change", (e) => {
    calculateMods();
});

modpackType.addEventListener("change", (e) => {
    calculateMods();
});

modSearch.addEventListener("input", (e) => {
    calculateMods();
});

let calculateMods = () => {
    let searched = modSearch.value.trim();
    let mods = [...document.getElementsByClassName("card")].filter((element) => element.getAttribute("data-mod-type"));
    if (searched.length > 0) {
        for (let i = 0; i < mods.length; i++) {
            const mod = mods[i];
            if (mod.children[0].innerHTML.indexOf(searched) > -1 || mod.children[2].innerHTML.indexOf(searched) > -1) {
                if (modVerified.checked) {
                    if (mod.hasAttribute("data-mod-verified")) {
                        if (mod.getAttribute("data-mod-type") === "mod") {
                            if (modType.checked) mod.style.display = "block";
                            else mod.style.display = "none";
                        } else {
                            if (modpackType.checked) mod.style.display = "block";
                            else mod.style.display = "none";
                        }
                    } else mod.style.display = "none";
                } else {
                    if (mod.getAttribute("data-mod-type") === "mod") {
                        if (modType.checked) mod.style.display = "block";
                        else mod.style.display = "none";
                    } else {
                        if (modpackType.checked) mod.style.display = "block";
                        else mod.style.display = "none";
                    }
                }
            } else mod.style.display = "none";
        }
    } else {
        for (let i = 0; i < mods.length; i++) {
            const mod = mods[i];
            if (modVerified.checked) {
                if (mod.hasAttribute("data-mod-verified")) {
                    if (mod.getAttribute("data-mod-type") === "mod") {
                        if (modType.checked) mod.style.display = "block";
                        else mod.style.display = "none";
                    } else {
                        if (modpackType.checked) mod.style.display = "block";
                        else mod.style.display = "none";
                    }
                } else {
                    mod.style.display = "none";
                }
            } else {
                if (mod.getAttribute("data-mod-type") === "mod") {
                    if (modType.checked) mod.style.display = "block";
                    else mod.style.display = "none";
                } else {
                    if (modpackType.checked) mod.style.display = "block";
                    else mod.style.display = "none";
                }
            }
        }
    }
};
calculateMods();
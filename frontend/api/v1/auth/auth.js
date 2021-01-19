const router = require("express").Router();
const passport = require("passport");
const languages = require("../languages");

router.get("/login", passport.authenticate("discord"));
router.get("/discord/redirect", passport.authenticate("discord"), (req, res) => {
    //Set language
    let baseLanguage = Object.assign({}, languages.languages[languages.baseLanguage]);
    languages.matchDataRecursive(baseLanguage, languages.languages[req.user.settings.language]);
    req.language = baseLanguage;
    res.redirect("/");
});
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
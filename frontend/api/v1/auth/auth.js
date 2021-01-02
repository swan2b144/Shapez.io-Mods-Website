const router = require("express").Router();
const passport = require("passport");

router.get("/login", passport.authenticate("discord"));
router.get("/discord/redirect", passport.authenticate("discord"), (req, res) => {
    //TODO: correct or false
    res.redirect("/");
});
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
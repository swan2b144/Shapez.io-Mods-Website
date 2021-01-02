const router = require("express").Router();
const passport = require("passport");

router.get("/discord", passport.authenticate("discord"));
router.get("/discord/redirect", passport.authenticate("discord"), (req, res) => {
    //TODO: correct or false
    res.send(200);
});
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
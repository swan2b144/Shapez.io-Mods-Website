const router = require("express").Router();

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

//Use the auth for discord
router.use("/auth", require("./v1/auth/auth"));
router.use("/database/users", require("./v1/database/users").router);
router.use("/database/mods", require("./v1/database/mods").router);
// router.use("/database/modpacks", require("./v1/database/modpacks").router);
// router.use("/database/posts", require("./v1/database/posts").router);

module.exports = router;
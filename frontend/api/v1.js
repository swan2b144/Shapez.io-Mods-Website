const router = require("express").Router();

//Use the auth for discord
router.use("/auth", require("./v1/auth/auth"));
router.use("/database/users", require("./v1/database/users").router);
router.use("/database/mods", require("./v1/database/mods").router);
router.use("/database/modpacks", require("./v1/database/modpacks").router);
// router.use("/database/posts", require("./v1/database/posts").router);

module.exports = router;
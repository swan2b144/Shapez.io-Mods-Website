const router = require("express").Router();

//Use the auth for discord
router.use("/auth", require("./v1/auth/auth"));

module.exports = router;
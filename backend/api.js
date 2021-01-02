const express = require("express");
const router = express.Router();

router.use("/users", require("./v1/users"));
router.use("/posts", require("./v1/posts"));
router.use("/comments", require("./v1/comments"));
router.use("/modpacks", require("./v1/modpacks"));
router.use("/mods", require("./v1/mods"));

module.exports = router;
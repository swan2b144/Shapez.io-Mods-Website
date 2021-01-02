const express = require("express");
const router = express.Router();

router.use("/users", require("./routes/users"));
router.use("/posts", require("./routes/posts"));
router.use("/comments", require("./routes/comments"));
router.use("/modpacks", require("./routes/modpacks"));
router.use("/mods", require("./routes/mods"));

module.exports = router;
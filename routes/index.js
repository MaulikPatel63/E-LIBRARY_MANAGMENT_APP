const router = require("express").Router();

//! Auth Router
router.use("/api/v1/auth", require("./Auth.js"));

//! Auth Router
router.use("/api/v1/book", require("./Book.js"));

module.exports = router;

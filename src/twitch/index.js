const router = require("express").Router();
const interaction = require("./interaction");

router.use("/interaction", interaction);

module.exports = router;
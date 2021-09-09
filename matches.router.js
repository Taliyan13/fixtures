const { Router } = require("express");
const { getMatches } = require("./matches.controller");

const router = Router();

router.get("/", getMatches);

module.exports = router;

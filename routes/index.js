const express = require("express")
const createReferral = require("../routes/createReferral")

const router = express.Router();

router.use("/", createReferral)

module.exports = router;
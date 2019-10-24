var express = require("express");
var router = express.Router();
var connection = require("../db");
const bodyparser = require("body-parser");

var user = require("./user/user_api");
router.use("/user", user);
module.exports = router;

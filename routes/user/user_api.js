var express = require("express");
var router = express.Router();
var connection = require("../../db");
const bodyparser = require("body-parser");
//#1   user signup
var signup = require("./signup");
router.use("/signup", signup);

//#2  user login
var login = require("./login");
router.use("/login", login);

//#3  update password
var updatepassword = require("./updatepassword");
router.use("/updatepassword", updatepassword);

//#4  forget password using email
var forgot = require("./forgot");
router.use("/forgot", forgot);

//#5  reset password with OTP
var resetpassword = require("./resetpassword");
router.use("/resetpassword", resetpassword);

module.exports = router;

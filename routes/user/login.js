const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const connection = require("../../db");
const dotenv = require("dotenv");
dotenv.config();
let config = require("../../config");
let middleware = require("../../middleware");
const router = express.Router();

// api for user login
router.post("/", (req, res) => {
  //For the given email fetch email from DB
  var email = req.body.email;
  var password = req.body.password;
  key = crypto.pbkdf2Sync(password, "salt", 10, 10, "sha512");
  // password = key.toString("hex");
  connection.query("SELECT * FROM user WHERE email = ?", [email], function(
    error,
    results,
    fields
  ) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        code: 400,
        failed: "error ocurred"
      });
    } else {
      // console.log('The solution is: ', results);
      if (results.length > 0) {
        if (results[0].password == key.toString("hex")) {
          let token = jwt.sign({ email: email }, config.secret, {
            expiresIn: "24h" // expires in 24 hours
          });
          // return the JWT token for the future API calls
          res.json({
            success: true,
            message: "Authentication successful!",
            token: token
          });
        } else {
          res.send({
            code: 204,
            msg: "Password does not match"
          });
        }
      } else {
        res.send({
          code: 204,
          msg: "Email does not exits"
        });
      }
    }
  });
});

module.exports = router;

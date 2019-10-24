const express = require("express");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const router = express.Router();
const connection = require("../../db");
const crypto = require("crypto");

//update password api
router.post("/", (req, res) => {
  var { email, password, newpassword } = req.body;

  let key = crypto.pbkdf2Sync(password, "salt", 10, 10, "sha512");
  password = key.toString("hex");
  let newkey = crypto.pbkdf2Sync(newpassword, "salt", 10, 10, "sha512");
  newpassword = newkey.toString("hex");
  var sql = `select * from user where email='${email}' `;
  connection.query(sql, (err, result) => {
    if (!err) {
      //checking databasepassword and inputpassword
      if (result[0].password == password) {
        connection.query(
          `UPDATE user SET password="${newpassword}" WHERE email="${email}"`,
          (error, result) => {
            if (!error) {
              res.json({
                msg: "Password Change Sucessfully"
              });
            } else {
              console.log(error);
              res.json({
                msg: "there is some error in code"
              });
            }
          }
        );
      } else {
        res.json({
          msg: "old password doesn't match"
        });
      }
    } else {
      console.log(err);
    }
  });
});

module.exports = router;

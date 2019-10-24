const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
var connection = require("../../db");

router.post("/", (req, res) => {
  const { email } = req.body;
  //following if statement check the user email
  if (!email) {
    res.json("email required");
  }
  let sql = 'SELECT * FROM user WHERE email="' + email + '"';
  connection.query(sql, (err, result) => {
    console.log(result);
    if (err) {
      console.log(err);
    }
    if (!result[0]) {
      return res.status(400).json({ msg: "Email does not exist" });
    }
    var optgen = () => {
      // Declare a digits variable
      // which stores all digits
      var digits = "0123456789";
      var OTP = "";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
    };
    var onetime = optgen();
    console.log(onetime);

    connection.query(
      `insert into user(OTP) values(OTP="${onetime}") ?`,
      (err, data) => {
        if (!err) {
          console.log(data);
        } else {
          console.log(err);
        }
      }
    );

    connection.query(
      `select count(email) as count from user where email="${email}" `,
      (err, data) => {
        if (!err) {
          if ((data[0].email = 1)) {
            connection.query(
              `update user set OTP="${onetime}" where email="${email}" `
            );
          }
        }
        console.log(err);
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "somethingdifferent375@gmail.com",
        pass: "9004745064"
      }
    });
    const mailOptions = {
      from: "email",
      to: email,
      subject: "ONE TIME PASSWORD To RESET PASSWORD",
      text: `Your ONE TIME PASSWORD IS : ${onetime}`
    };
    console.log("sending mail");
    transporter.sendMail(mailOptions, function(err, response) {
      if (err) {
        console.log("There was an error", err);
      } else {
        console.log("here is the response", response);
        res.status(200).json("otp  sent to email");
      }
    });
  });
});
module.exports = router;

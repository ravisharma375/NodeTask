const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const connection = require("../../db");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();

//post api for user login
router.post("/", (req, res) => {
  var OTP = req.body.OTP;
  var newpassword = req.body.newpassword;
  key = crypto.pbkdf2Sync(newpassword, "salt", 10, 10, "sha512");
  newpassword = key.toString("hex");

  connection.query("SELECT * FROM user WHERE OTP = ?", [OTP], function(
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
        if (results[0].OTP == OTP) {
          res.json({
            status: true,
            msg: "correct OTP"
          });
          connection.query(
            `update user set password="${newpassword}" where OTP="${OTP}"`,
            (error, data) => {
              if (error) {
                console.log(error);
              } else {
                console.log(data);
              }
            }
          );
        } else {
          res.send({
            code: 204,
            msg: "INCORRECT OTP"
          });
        }
      } else {
        res.send({
          code: 204,
          msg: "INCORRECT OTP"
        });
      }
    }
  });
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// var connection = require("../../db");
// const Speakeasy = require("speakeasy");

// router.post("/", (req, res) => {
//   // const { OTP } = req.body;
//   // connection.query(`select * from user where OTP="${OTP}"`, (err, data) => {
//   //   if (!err) {
//   //     if (data[0].OTP == OTP) {
//   //       res.json({
//   //         status: true,
//   //         msg: "correct OTP"
//   //       });
//   //     } else {
//   //       res.json({
//   //         status: false,
//   //         msg: "incorrect OTP"
//   //       });
//   //     }
//   //   } else {
//   //     res.json({
//   //       status: false,
//   //       msg: "incorrect otp"
//   //     });
//   //   }
//   // });
// });

// // router.post("/", (req, res) => {
// //   const { email } = req.body;
// //   //following if statement check the user email
// //   if (!email) {
// //     res.json("email required");
// //   }
// //   let sql = 'SELECT * FROM user WHERE email="' + email + '"';
// //   connection.query(sql, (err, result) => {
// //     console.log(result);
// //     if (err) {
// //       console.log(err);
// //     }
// //     if (!result[0]) {
// //       return res.status(400).json({ msg: "Email does not exist" });
// //     }
// //     var optgen = () => {
// //       // Declare a digits variable
// //       // which stores all digits
// //       var digits = "0123456789";
// //       var OTP = "";
// //       for (let i = 0; i < 6; i++) {
// //         OTP += digits[Math.floor(Math.random() * 10)];
// //       }
// //       return OTP;
// //     };
// //     var onetime = optgen();
// //     console.log(onetime);
// //     const verifydata = {
// //       email: email,
// //       OTP: onetime
// //     };
// //     connection.query(`insert into verify set ?`, verifydata, (err, data) => {
// //       if (!err) {
// //         console.log(data);
// //       } else {
// //         console.log(err);
// //       }
// //     });

// //     connection.query(
// //       `select count(email) as count from verify where email="${email}" `,
// //       (err, data) => {
// //         if (!err) {
// //           if ((data[0].email = 1)) {
// //             connection.query(
// //               `update verify set OTP="${onetime}" where email="${email}" `
// //             );
// //           }
// //         }
// //         console.log(err);
// //       }
// //     );

// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: "somethingdifferent375@gmail.com",
// //         pass: "9004745064"
// //       }
// //     });
// //     const mailOptions = {
// //       from: "email",
// //       to: email,
// //       subject: "ONE TIME PASSWORD To RESET PASSWORD",
// //       text: `Your ONE TIME PASSWORD IS : ${onetime}`
// //     };
// //     console.log("sending mail");
// //     transporter.sendMail(mailOptions, function(err, response) {
// //       if (err) {
// //         console.log("There was an error", err);
// //       } else {
// //         console.log("here is the response", response);
// //         res.status(200).json("otp  sent to email");
// //       }
// //     });
// //   });
// // });
// module.exports = router;

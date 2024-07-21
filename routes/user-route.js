const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { usersignup, userlogin } = require("../controllers/userController");
const { requestHandler, verifytoken } = require("../utils/common");

router.post(
  "/signup",
  [
    check("first_name").notEmpty().withMessage("First name is required"),
    check("last_name").notEmpty().withMessage("Last Name is required"),
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid mail ID"),
    check("new_password")
      .notEmpty()
      .withMessage("New Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be contain 8 characters"),
    check("confirm_password")
      .notEmpty()
      .withMessage("Confirm Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be contain 8 characters"),
  ],
  (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length) {
      requestHandler(errors, true, (err_message) => {
        return res.status(403).json(err_message);
      });
    } else {
      usersignup(req, res);
    }
  }
);

router.post(
  "/login",
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid mail ID"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length) {
      requestHandler(errors, true, (err_message) => {
        return res.status(403).json(err_message);
      });
    } else {
      userlogin(req, res);
    }
  }
);

module.exports = router;

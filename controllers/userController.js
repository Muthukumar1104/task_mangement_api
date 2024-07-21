const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const {
  hashpassword,
  comparepassword,
  generatetoken,
} = require("../utils/common");

class Authservice {
  async usersignup(req, res) {
    try {
      const { email, new_password } = req.body;
      const checkmail = await User.find({ email });
      var bcrypthash;
      if (checkmail?.length == 0) {
        if (req.body.new_password == req.body.confirm_password) {
          bcrypthash = await hashpassword(new_password);
        } else {
          return res
            .status(403)
            .json({ error: true, message: "Password does't not match" });
        }
        const insertfield = {
          ...req.body,
          new_password: bcrypthash,
          mdate: "",
        };
        const newUser = await new User(insertfield);
        const saveduser = await newUser.save();
        return res.status(200).json({ error: false, data: saveduser });
      } else {
        return res
          .status(403)
          .json({ error: true, message: "Email already exist" });
      }
    } catch (err) {
      return res.status(500).json({ error: false, message: err.message });
    }
  }

  async userlogin(req, res) {
    try {
      const { email, password } = req.body;
      const validuser = await User.findOne({ email });
      const checkpassword = await comparepassword(
        password,
        validuser.new_password
      );
      if (validuser && checkpassword) {
        const token = await generatetoken({
          user_id: validuser?._id,
          email: validuser?.email,
        });
        if (token) {
          const response = {
            userId: validuser?._id,
            first_name: validuser?.first_name,
            last_name: validuser?.last_name,
            email: validuser?.email,
            authtoken: token,
          };
          return res.status(200).json({ error: false, data: response });
        } else {
          return res
            .status(401)
            .json({ error: false, message: "Invalid token" });
        }
      } else {
        return res
          .status(401)
          .json({ error: true, message: "Invalid email/password" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: false, message: "Invalid email/password" });
    }
  }
}

const authservice = new Authservice();

module.exports = authservice;

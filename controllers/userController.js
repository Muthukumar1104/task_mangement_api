const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const {
  hashpassword,
  comparepassword,
  generatetoken,
} = require("../utils/common");

module.exports.usersignup = async (req, res) => {
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
    return res.status(403).json({ error: false, message: err.message });
  }
};

module.exports.userlogin = async (req, res) => {
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
          name: validuser?.name,
          email: validuser?.email,
          mobile: validuser?.mobile,
          role: validuser?.role,
          roletype:
            validuser?.role == 1
              ? "admin"
              : validuser?.role == 2
              ? "teacher"
              : "student",
          authtoken: token,
        };
        return res.status(200).json({ error: false, data: response });
      } else {
        return res.status(403).json({ error: false, message: "Invalid token" });
      }
    } else {
      return res
        .status(403)
        .json({ error: true, message: "Invalid email/password" });
    }
  } catch (err) {
    return res.status(403).json({ error: false, message: err.message });
  }
};

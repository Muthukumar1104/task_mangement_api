const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.requestHandler = (errors, isError, callback) => {
  if (isError) {
    const errorObject = errors.reduce((acc, error) => {
      acc[error.path] = error.msg;
      return acc;
    }, {});

    callback(errorObject);
  }
};

module.exports.hashpassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.salt));
    const hashpassword = await bcrypt.hash(password, salt);
    return hashpassword;
  } catch (err) {
    throw new Error("Error hashing password");
  }
};

module.exports.comparepassword = async (password, hash) => {
  try {
    const comparepassword = await bcrypt.compare(password, hash);
    return comparepassword;
  } catch (err) {
    throw new Error("Error password doesn't match");
  }
};

module.exports.generatetoken = async (data) => {
  try {
    const jwt_token = jwt.sign(data, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "168h",
    });
    return jwt_token;
  } catch (err) {
    throw new Error("Token generation failed");
  }
};

module.exports.verifytoken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: "Invalid token." });
  }
};

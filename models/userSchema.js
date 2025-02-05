const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  new_password: {
    type: String,
    require: true,
  },
  confirm_password: {
    type: String,
    require: true,
  },
  cdate: {
    type: Date,
    default: Date.now,
  },
  mdate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);

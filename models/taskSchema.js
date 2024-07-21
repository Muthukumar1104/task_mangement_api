const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["todo", "inprogress", "completed"],
    default: "todo",
  },
  isActive: {
    type: Number,
    enum: [0, 1, 2], // 0 - inactive, 1 - active, 2 - deleted
    default: 1,
  },
  cby: {
    type: String,
  },
  cdate: {
    type: Date,
    default: Date.now,
  },
  mby: {
    type: String,
  },
  mdate: {
    type: Date,
  },
  dby: {
    type: String,
  },
  ddate: {
    type: Date,
  },
});

module.exports = mongoose.model("task", taskSchema);

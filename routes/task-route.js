const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  addtask,
  taskslist,
  taskstatus,
  taskview,
  updatetask,
  taskdelete,
} = require("../controllers/task-controller");
const { requestHandler, verifytoken } = require("../utils/common");

//Add task
router.post(
  "/add",
  verifytoken,
  [
    check("title").notEmpty().withMessage("Task title is required"),
    check("description").notEmpty().withMessage("Description is required"),
  ],
  (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length) {
      requestHandler(errors, true, (err_message) => {
        return res.status(403).json(err_message);
      });
    } else {
      addtask(req, res);
    }
  }
);

//List of all tasks
router.get("/list", verifytoken, taskslist);

//View task based on task ID
router.get("/:id", verifytoken, taskview);

//update the task details
router.put(
  "/update",
  verifytoken,
  [
    check("_id").notEmpty().withMessage("Task ID is required"),
    check("title").notEmpty().withMessage("Task title is required"),
    check("description").notEmpty().withMessage("Description is required"),
  ],
  (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length) {
      requestHandler(errors, true, (err_message) => {
        return res.status(403).json(err_message);
      });
    } else {
      updatetask(req, res);
    }
  }
);

//Update the task status
router.patch("/:id/:status", verifytoken, taskstatus);

//Delete task details(soft delete)
router.delete("/:id", verifytoken, taskdelete);

module.exports = router;

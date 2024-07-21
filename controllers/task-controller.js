const Task = require("../models/taskSchema");

class Taskservice {
  async addtask(req, res) {
    try {
      const { user_id } = req.user;
      const newTask = new Task({ ...req.body, cby: user_id });
      const savedTask = await newTask.save();
      return res.status(200).json({
        error: false,
        data: savedTask,
        msg: "Task added successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        msg: error.message,
      });
    }
  }

  async taskslist(req, res) {
    try {
      const { search = "", sort = "recently" } = req.query;

      const searchQuery = search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
            isActive: { $ne: 2 },
          }
        : { isActive: { $ne: 2 } };

      const sortOptions = {
        recently: { createdAt: -1 },
        cdate: { createdAt: 1 },
        title: { title: 1 },
        description: { description: 1 },
      };

      const sortQuery = sortOptions[sort] || sortOptions.recently;

      const todoTasks = await Task.find({
        status: "todo",
        ...searchQuery,
      }).sort(sortQuery);

      const inProgressTasks = await Task.find({
        status: "inprogress",
        ...searchQuery,
      }).sort(sortQuery);

      const completedTasks = await Task.find({
        status: "completed",
        ...searchQuery,
      }).sort(sortQuery);

      return res.status(200).json({
        todo: todoTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async taskstatus(req, res) {
    try {
      const { user_id } = req.user;
      const { id, status } = req.params;
      const taskstatus_update = await Task.findOneAndUpdate(
        { _id: id },
        { status, mby: user_id, mdate: Date.now() }
      );
      if (taskstatus_update) {
        return res.status(200).json({
          error: false,
          msg: "Task status updated successfully!",
        });
      } else {
        return res.status(403).json({
          error: true,
          msg: "Task not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: false,
        msg: error.message,
      });
    }
  }

  async taskview(req, res) {
    try {
      const _id = req.params.id;
      const taskdetails = await Task.findOne({ _id });
      return res.status(200).json({
        error: false,
        data: taskdetails,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        msg: error.message,
      });
    }
  }

  async updatetask(req, res) {
    try {
      const { user_id } = req.user;
      const { _id } = req.body;
      const updatetaskdetails = {
        ...req.body,
        mby: user_id,
        mdate: Date.now(),
      };
      const updateTask = await Task.findByIdAndUpdate(_id, updatetaskdetails, {
        new: true,
        runValidators: true,
      });

      if (updateTask) {
        return res.status(200).json({
          error: false,
          data: updateTask,
          msg: "Task added successfully!",
        });
      } else {
        return res.status(403).json({
          error: true,
          msg: "Task not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        msg: error.message,
      });
    }
  }

  async taskdelete(req, res) {
    try {
      const { user_id } = req.user;
      const { id } = req.params;
      const taskdetails = await Task.findOneAndUpdate(
        { _id: id },
        { isActive: 2, dby: user_id, ddate: Date.now() }
      );
      return res.status(200).json({
        error: false,
        data: taskdetails,
        msg: "Task deleted successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        msg: error.message,
      });
    }
  }
}

const taskservice = new Taskservice();

module.exports = taskservice;

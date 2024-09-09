const express = require("express");
const tasksController = require("./../controllers/tasksController");

const router = express.Router();

router
  .route("/")
  .get(tasksController.getAllTasks)
  .post(tasksController.postTask)
  .put(tasksController.editTask)
  .patch(tasksController.changeTaskStatus)
  .delete(tasksController.deleteTask);

module.exports = router;

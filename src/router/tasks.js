const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const Tasks = require("../models/tasks");
const { notifyUser } = require("../middleware/notification");
const Notification = require("../models/notification");
const { io } = require("..");
const { createItem, updateItem, deleteItem } = require("../middleware/crudOperations");

router.post("/tasks", auth, notifyUser('New item created') ,async (req, res) => {
  const task = new Tasks({
    ...req.body,
    owner: req.user._id,
    // category:
  });

  // console.log("req.body", req.body.description);
  try {
    await createItem(req.body)
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
  // task.save().then(() => res.status(201).send(task)).catch(e => res.status(400).send(e))
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.status) {
    match.status = req.query.status === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    // const tasks = await Tasks.find({ owner: req.user._id });
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get(`/tasks/:id`, auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const singleTaks = await Tasks.findOne({ _id, owner: req.user._id });
    if (!singleTaks) return res.status(404).send();
    res.send(singleTaks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get(`/tasks/category/:id`, auth, async (req, res) => {
  const category = req.params.id;

  try {
    const taks = await Tasks.find({ category, owner: req.user._id });
    if (!taks) return res.status(404).send();
    res.send(taks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch(`/tasks/:id`, auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "status", "name", "dueDate", "category", "color"];
  const isValidOpe = updates.every((update) => allowUpdates.includes(update));
  if (!isValidOpe) res.status(400).send({ error: "Inavlid Update" });

  try {
    await updateItem(req.params.id, req.body) 
    const task = await Tasks.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.status(404).send();

    updates.forEach((filed) => (task[filed] = req.body[filed]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete(`/tasks/:id`, auth, async (req, res) => {
  try {
    await deleteItem(req.params.id)
    const task = await Tasks.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get(`/tasks/status`, async (req, res) => {
  const status = req.params.status;

  try {
    const singleTaks = await Tasks.find({ status });
    if (!singleTaks) return res.status(404).send();
    res.send(singleTaks);
  } catch (e) {
    res.status(500).send();
  }

  // Tasks.find({status}).then(singleTaks => {
  //   if(!singleTaks) return res.status(404).send()
  //   res.send(singleTaks)
  // }).catch(e => {
  //   res.status(500).send()
  // })
});

module.exports = router;

const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Categories = require("../models/categories");

router.post("/category", auth, async (req, res) => {
  const category = new Categories({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(e);
  }
});

router.get("/category", auth, async (req, res) => {
  const categories = await Categories.find({ owner: req.user._id });

  try {
    res.status(201).send(categories);
  } catch (error) {
    res.status(400).send(e);
  }
});

router.delete("/category/:id", auth, async (req, res) => {
  const category = await Categories.findOneAndDelete({
    owner: req.user._id,
    _id: req.params.id,
  });
  try {
    if (!category) return res.status(404).send();
    res.status(201).send();
  } catch (error) {
    res.status(400).send(e);
  }
});

module.exports = router;

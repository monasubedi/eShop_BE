const express = require("express");
const { Category } = require("../models/category");

const router = express.Router();

router.post("/", async (req, res) => {
  let { name, icon, color } = req.body;
  try {
    let category = new Category({ name, icon, color });
    category = await category.save();
    if (!category) {
      return res.status(400).send("The category cannot be created");
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(500).json({ success: false, error });
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Category.updateOne({ _id: req.params.id }, { ...req.body });
    return res
      .status(200)
      .send({ success: true, message: "Updated the category successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let category = await Category.deleteOne({ _id: id });
    if (category) {
      return res.status(200).json({
        success: true,
        message: "The category is deleted successfully",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Cannot find the category" });
  }
});

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find({});
    res.status(200).send(categoryList);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "The category with the given id was not found",
      });
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;

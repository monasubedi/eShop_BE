const express = require("express");
const { Product } = require("../models/product");
const { Category } = require("../models/category");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let category = await Category.findById({ _id: req.body.category });
    if (!category) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid category" });
    }
    const product = new Product({
      ...req.body,
    });
    const newProduct = await product.save();
    if (newProduct) {
      return res.status(201).json(newProduct);
    }
    return res
      .status(400)
      .send({ success: false, message: "Cannot create the product" });
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let category = await Category.findById({ _id: req.body.category });
    if (!category) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid category" });
    }
    await Product.updateOne({ _id: req.params.id }, { ...req.body });
    return res
      .status(200)
      .send({ success: true, message: "Updated the product successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Product.deleteOne({ _id: id });
    return res.status(200).json({
      success: true,
      message: "The product is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.get("/", async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  try {
    const productList = await Product.find(filter).populate("category");
    res.status(200).json(productList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id }).populate(
      "category"
    );
    if (product) {
      return res.status(200).json(product);
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the product" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.get("/get/count", async (req, res) => {
  try {
    let count = await Product.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  try {
    let products = await Product.find({ isFeatured: true }).limit(+count);
    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;

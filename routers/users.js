const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let passwordHash = bcrypt.hashSync(req.body.password, 10);
    let user = new User({
      ...req.body,
      passwordHash,
    });
    user = await user.save();
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Cannot create the user account" });
    }
    return res
      .status(201)
      .send({ success: true, message: "Successfully created this account" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.post("/register", async (req, res) => {
  try {
    let passwordHash = bcrypt.hashSync(req.body.password, 10);
    let user = new User({
      ...req.body,
      passwordHash,
    });
    user = await user.save();
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Cannot create the user account" });
    }
    return res
      .status(201)
      .send({ success: true, message: "Successfully created this account" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    let samePassword = bcrypt.compareSync(req.body.password, user.passwordHash);
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    if (user && samePassword) {
      const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({ user: user.email, token });
    } else {
      return res.status(400).json({ message: "Invalid Password" });
    }
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
});

router.get("/", async (req, res) => {
  try {
    const userList = await User.find().select("-passwordHash");
    if (!userList) {
      res.status(500).json({ success: false });
    }
    res.send(userList);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id }).select(
      "-passwordHash"
    );
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Cannot find the user with that ID" });
    }
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.delete("/:id", async(req,res) => {
    try {
        await User.deleteOne({_id: req.params.id});
        res.status(200).json({success:true, message: "Deleted the user"})
    } catch (error) {
        res.status(500).json({success: false, error});
    }
})

router.get("/get/count", async (req, res) => {
  try {
    const usersCount = await User.getDocuments();
    res.status(200).json({ count: usersCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;

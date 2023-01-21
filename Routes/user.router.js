const express = require("express");
const UserRouter = express.Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const { UserModel } = require("../Models/user.model");

UserRouter.get("/", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  try {
    if (token) {
      var decoded = jwt.verify(token, "secret");
      if (decoded) {
        const userId = decoded.userId;
        const user = await UserModel.findOne({ _id: userId });
        res.send({ user: user });
      } else {
        res.send({ err: "Please Login again" });
      }
    } else {
      res.send({ err: "Please Login again" });
    }
  } catch (err) {
    console.log("Error", err);
    res.send({ err: "Something went wrong" });
  }
});
UserRouter.post("/signup", async (req, res) => {
  const payload = req.body;
  try {
    bcrypt.hash(payload.password, 5, async function (err, hash) {
      payload.password = hash;
      const user = new UserModel(payload);
      await user.save();
      res.send({ msg: "Signup Successfull" });
    });
  } catch (err) {
    console.log("Error", err);
    res.send({ err: "Something went wrong" });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        var token = jwt.sign({ userId: user._id }, "secret");
        res.send({ token: token });
      } else {
        res.send({ err: "Something went wrong" });
      }
    });
  } catch (err) {
    console.log("Error", err);
    res.send({ err: "Something went wrong" });
  }
});

module.exports = { UserRouter };

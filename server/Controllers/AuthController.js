const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/UserModel");
const bcrpypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary");

dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
});

//Signup Route
const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userEmail,
      userMobile,
      userUniversity,
      userName,
    } = req.body;

    //check for existing user in the database
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      res.status(401).send("User already exists with this email");
    }

    //check if profile image file is provided
    if (!req.file) {
      return res.status(400).json({ error: "No profile image provided" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);

    const password = req.body.userPassword;
    const saltRounds = 10;
    const salt = await bcrpypt.genSalt(saltRounds);
    const enxryptedPassword = await bcrpypt.hash(password, salt);
    console.log("Request body : ", req.body);

    const newUser = new User({
      firstName,
      lastName,
      userEmail,
      userMobile,
      userUniversity,
      userName,
      userPassword: enxryptedPassword,
      profileImage: result.secure_url,
    });

    await newUser.save();

    return res.status(200).json({
      status: "Ok",
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

//Login Route
const login = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await User.findOne({
      userEmail,
    });
    if (user) {
      const passwordMatch = await bcrpypt.compare(
        userPassword,
        user.userPassword
      );
      if (passwordMatch) {
        return res.json(user);
      } else {
        return res.json({ status: "Error", getuser: false });
      }
    } else {
      return res.json({ status: "Error", getuser: false });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { signup, login };

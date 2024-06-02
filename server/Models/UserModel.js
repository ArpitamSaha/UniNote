const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  userUniversity: {
    type: String,
    required: true,
  },

  userEmail: {
    type: String,
    required: true,
  },
  userMobile: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);

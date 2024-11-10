const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  profile: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};

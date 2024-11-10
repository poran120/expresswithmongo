const mongoose = require("mongoose");
const { User } = require("../models/User");

// @desc: Get all users or users by name
const getAllUsers = async (req, res) => {
  const { name } = req.query;

  try {
    let query = {};
    if (name) {
      const nameRegex = new RegExp(name, "i");
      query = {
        $or: [
          { firstName: { $regex: nameRegex } },
          { lastName: { $regex: nameRegex } },
        ],
      };
    }
    const users = await User.find(query);
    if (users.length > 0) {
      return res.status(200).json({
        meta: {
          status: 200,
          total: users.length,
          message: "Users fetched successfully",
        },
        users,
      });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// @desc: Get single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// @desc: Create a new user
const createUser = async (req, res) => {
  const body = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Profile photo is required" });
  }
  if (!body.firstName || !body.lastName) {
    return res.status(400).json({
      message: "First name and last name are required",
    });
  }

  try {
    const newUser = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      gender: body.gender,
      jobTitle: body.jobTitle,
      profile: req.file.path,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

// @desc: Update a user (single or multiple fields)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID format",
    });
  }

  // if (!req.file && Object.keys(body).length === 0) {
  //   return res.status(400).json({
  //     message: "No fields to update",
  //   });
  // }

  try {
    if (req.file) {
      body.profile = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updatedFields = Object.keys(body).length;
    return res.status(200).json({
      message: `User updated successfully. ${updatedFields} field(s) updated.`,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

// @desc: Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User deleted successfully",
      user: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
};

const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
} = require("../controllers/userController");
const upload = require("../multerConfig");
const router = express.Router();

// @desc: Get all users or users by name
// @route: GET /api/users
router.get("/", getAllUsers);

// @desc: Get single user by ID
// @route: GET /api/users/:id
router.get("/:id", getUserById);

// @desc: Update a user (single or multiple fields)
// @route: PUT /api/users/:id
router.put("/:id", updateUser);

// @desc: Create a new user
// @route: POST /api/users
router.post("/", upload.single("profile"), createUser);

// @desc: Delete a user
// @route: DELETE /api/users/:id
router.delete("/:id", deleteUser);

module.exports = {
  router,
};

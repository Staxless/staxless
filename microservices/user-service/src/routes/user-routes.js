/**
 * @file user-routes.js
 * @description Express router for user-related operations including create, read, update, delete, and subscription management.
 * @module userRoutes
 */

import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

/**
 * Create a new user or return existing user.
 * @route POST /
 * @param {Object} req.body - User data
 * @param {string} req.body.firstname - User's first name
 * @param {string} req.body.lastname - User's last name
 * @param {string} req.body.email - User's email
 * @param {string} req.body.id - User's ID
 * @param {string} [req.body.avatar] - User's avatar URL
 * @returns {Object} Created or existing user data
 */
router.post("/", async (req, res) => {
  try {
    const { firstname, lastname, email, id, avatar } = req.body;
    if (!firstname || !lastname || !email || !id) {
      return res
        .status(400)
        .send("First name, last name, email, and ID are required");
    }

    const existingUser = await User.findOne({ $or: [{ _id: id }, { email }] });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const userData = {
      _id: id,
      firstname,
      lastname,
      email,
      avatar,
      created_at: new Date(),
      roles: ["user"],
      subscription: { type: "free", startDate: new Date() },
    };

    const result = await User.create(userData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get a user by ID or email.
 * @route GET /
 * @param {string} [req.query.id] - User's ID
 * @param {string} [req.query.email] - User's email
 * @returns {Object} User data
 */
router.get("/", async (req, res) => {
  try {
    const { id, email } = req.query;
    if (!id && !email) return res.status(400).send("ID or email is required");

    let query = {};
    if (id) query._id = id;
    if (email) query.email = email;

    const user = await User.findOne(query);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Update a user by ID.
 * @route PUT /
 * @param {Object} req.body - User data to update
 * @param {string} req.body.id - User's ID
 * @param {string} [req.body.firstname] - User's new first name
 * @param {string} [req.body.lastname] - User's new last name
 * @param {string} [req.body.avatar] - User's new avatar URL
 * @param {string[]} [req.body.roles] - User's new roles
 * @returns {Object} Updated user data
 */
router.put("/", async (req, res) => {
  try {
    const { id, firstname, lastname, avatar, roles } = req.body;
    if (!id) return res.status(400).send("ID is required");

    const updatedData = {
      firstname,
      lastname,
      avatar,
      roles,
    };

    const result = await User.findOne({ _id: id });
    if (!result) return res.status(404).send("User not found");

    Object.assign(result, updatedData);
    await User.updateLastActive(id);

    res.json({ message: "User updated successfully", user: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete a user by ID.
 * @route DELETE /
 * @param {Object} req.body - Request body
 * @param {string} req.body.id - User's ID to delete
 * @returns {Object} Deletion confirmation message
 */
router.delete("/", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).send("ID is required");

    const result = await User.findOne({ _id: id });
    if (!result) return res.status(404).send("User not found");

    await User.deleteOne({ _id: id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Update user subscription.
 * @route POST /update-subscription
 * @param {Object} req.body - Subscription data
 * @param {string} req.body.id - User's ID
 * @param {string} req.body.subscriptionType - New subscription type
 * @param {string} [req.body.endDate] - Subscription end date
 * @returns {Object} Updated user data
 */
router.post("/update-subscription", async (req, res) => {
  console.log(req.body);
  try {
    const { id, subscriptionType, endDate } = req.body;
    if (!id || !subscriptionType) {
      return res
        .status(400)
        .json({ error: "User ID and subscription type are required" });
    }

    const subscriptionData = {
      type: subscriptionType,
      startDate: new Date(),
      endDate: endDate ? new Date(endDate) : null,
    };

    const result = await User.updateSubscription(id, subscriptionData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(304).end(); // Not Modified
    }

    const updatedUser = await User.findOne({ _id: id });
    res.status(200).json({
      message: "Subscription updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

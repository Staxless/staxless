import express from "express";
import User from "../models/userModel.js"; // Adjust the path as necessary

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, id } = req.body;
    if (!name || !id) return res.status(400).send("Name and ID are required");

    // Check if a user with the same ID or name already exists
    const existingUser = await User.findOne({ $or: [{ _id: id }, { name }] });
    if (existingUser) {
      return res.status(200).json(existingUser); // Return the existing user
    }

    // Create a new user
    const userData = {
      name,
      id,
      createdAt: new Date(),
      lastActive: new Date(),
      roles: ["user"],
    };

    const result = await User.create(userData);
    res.status(201).json(result); // Return the created user document
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a user by ID or username
router.get("/", async (req, res) => {
  try {
    const { id, name } = req.query;
    if (!id && !name) return res.status(400).send("ID or name is required");

    let query = {};
    if (id) query._id = id;
    if (name) query.name = name;

    const user = await User.findOne(query);
    console.log(user);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// Update a user by ID or username
router.put("/", async (req, res) => {
  try {
    const { id, name, newName, roles } = req.body;
    if (!id && !name) return res.status(400).send("ID or name is required");

    let query = {};
    if (id) query._id = id;
    if (name) query.name = name;

    const updatedData = {
      name: newName,
      roles,
      lastActive: new Date(),
    };

    const result = await User.updateOne(query, { $set: updatedData });
    if (result.matchedCount === 0)
      return res.status(404).send("User not found");
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID or username
router.delete("/", async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id && !name) return res.status(400).send("ID or name is required");

    let query = {};
    if (id) query._id = id;
    if (name) query.name = name;

    const result = await User.deleteOne(query);
    if (result.deletedCount === 0)
      return res.status(404).send("User not found");
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

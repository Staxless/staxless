import express, { Router, Request, Response } from "express";
import { User } from "../models/userModel.ts";

const router: Router = express.Router();

interface CreateUserRequest {
  firstname: string;
  lastname: string;
  email: string;
  id: string;
  avatar?: string;
}

router.post("/", async (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
  try {
    const { firstname, lastname, email, id, avatar } = req.body;
    if (!firstname || !lastname || !email || !id) {
      return res.status(400).send("First name, last name, email, and ID are required");
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
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
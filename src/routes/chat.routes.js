import express from "express";
import { chatCompletion } from "../controllers/chat.js"; // adjust path if needed
import { Router } from 'express'

const router = express.Router();


router.post("/chats", chatCompletion);

// Route to handle chat completion
// router.post("/", chatCompletion);

export default router;

import express from "express";

import {
    createRating,
    updateRating,
} from "../controllers/ratingController.js";

import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();


// Create new rating
router.post("/", authenticate, createRating);


// Update existing rating
router.put("/:storeId", authenticate, updateRating);


export default router;
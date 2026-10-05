import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import getOwnerDashboard from "../controllers/ownerController.js";


const router = express.Router();

// Authentication
router.use(authenticate);

// Only OWNER
router.use(authorize("OWNER"));

// Owner dashboard
router.get("/dashboard", getOwnerDashboard);

export default router;
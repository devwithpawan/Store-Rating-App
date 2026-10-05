import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { getStores, submitRating, updateRating} from "../controllers/userController.js";


const router = express.Router();

// User authentication
router.use(authenticate);

// Only normal users
router.use(authorize("USER"));

// Stores
router.get("/stores", getStores);

// Rating
router.post(
    "/stores/:storeId/rating",
    submitRating
);

router.put(
    "/stores/:storeId/rating",
    updateRating
);

export default router;
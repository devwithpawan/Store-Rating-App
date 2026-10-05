import express, { Router } from "express"
import { changePassword, login, register } from "../controllers/authController.js"
import authenticate from "../middleware/authMiddleware.js"
import authMiddleware from "../middleware/authMiddleware.js"
import authorize from "../middleware/roleMiddleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.put("/change-password", authenticate, changePassword)
router.get("/deshboard", authenticate ,authorize("ADMIN"),)

export default router;
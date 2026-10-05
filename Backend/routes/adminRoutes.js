import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { createStore, createUser, getDashboardStats, getOwners, getStores, getUserDetails, getUsers } from "../controllers/adminController.js";

const router = express.Router()

router.use(authenticate);
router.use(authorize("ADMIN"));

//Dashboard Router
router.get("/dashboard", getDashboardStats)

//users
router.get("/users", getUsers)
router.post("/users", createUser)

//owner routes
router.get("/owners", getOwners)
//All users routes
router.get("/users/:id", getUserDetails)


//stores
router.get("/stores", getStores)
router.post("/stores", createStore)


export default router;

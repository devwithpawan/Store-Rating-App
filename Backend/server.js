import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import db from "./config/db.js";
import cookieParser from "cookie-parser";

//ALL Routers
import router from "./routes/authRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import ownerRoutes from "./routes/ownerRoutes.js"
import ratingRoutes from "./routes/ratingRoutes.js";


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const port = 5000 || process.env.PORT 

app.get('/', (req, res) => {
    res.send("Store rating API is running")
})

//user routes
app.use("/api/admin", adminRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", router)
app.use("/api/owner", ownerRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api", userRoutes)


app.listen(port, ()=> {
    console.log("port is listining at:", port)
})

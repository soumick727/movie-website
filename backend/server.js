import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors';
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import personRoutes from "./routes/person.route.js";
import publicRoutes from "./routes/public.route.js";
import searchRoutes from "./routes/search.route.js";
import recommendationRoutes from "./routes/recommendation.route.js"
import cookieParser from 'cookie-parser';
import path from "path";
import { verifyToken } from "./middlewares/auth.middleware.js";

dotenv.config({ path: "./backend/.env" });


const app = express();

//MIddleware
app.use(express.json()); // will allow us to parse req.body 
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({
    origin: "http://localhost:5173", // or the IP of your frontend if it's different
  credentials: true
}))
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}))

//serve static files from the image folder

app.use("/images",express.static(path.join(process.cwd(), 'images')));

// routes for authentication
app.use("/api/v1/auth",authRoutes);
// routes for movies
app.use("/api/v1/movie", verifyToken ,movieRoutes);
// routes for tv
app.use("/api/v1/tv", verifyToken, tvRoutes);
// routes for search
app.use("/api/v1/search", verifyToken, searchRoutes);
// route for person
app.use("/api/v1/person", verifyToken, personRoutes);
// route for recommendation
app.use("/api/v1/recommendation",verifyToken, recommendationRoutes);
// Public routes (no auth)
app.use("/api/v1/public", publicRoutes);






// Database Connection
  // Debugging log
  console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);

// checking the key of tmdb api key
console.log("TMDB_API_KEY from .env:", process.env.TMDB_API_KEY);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    })


// start server
const PORT  = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0',() => {
    console.log(`🚀 Server running on port ${PORT}`)  // Debugging log
})

import express from "express";
import path from "path";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movie.js";
import tvRoutes from "./routes/tv.js";
import searchRoutes from "./routes/search.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/protectRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => console.log(err.message));

app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
});

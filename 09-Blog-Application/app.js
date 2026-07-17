const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blogify";
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set when NODE_ENV=production");
}

// View Engine Configuration
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.set("trust proxy", 1);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// Static Files
app.use(express.static(path.resolve("./public")));

// Routes
app.get("/health", (req, res) => {
    return res.status(200).json({ status: "ok" });
});

app.get("/", async (req, res) => {
    try {
        const allBlogs = await Blog.find({}).sort({ createdAt: -1 }).populate("createdBy");
        res.render("home", {
            user: req.user,
            blogs: allBlogs,
        });
    } catch (err) {
        console.error("Error loading home page:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB Connected");

        app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
    } catch (err) {
        console.error("Failed to start application:", err);
        process.exit(1);
    }
}

startServer();

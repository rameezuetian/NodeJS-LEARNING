const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");

const app = express();
const PORT = 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogify')
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// View Engine Configuration
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// Static Files
app.use(express.static(path.resolve("./public")));

// Routes
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

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const router = Router();

// Ensure upload directory exists
const uploadDir = path.resolve('./public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Render Create Blog Page
router.get("/add-new", (req, res) => {
    if (!req.user) {
        return res.redirect("/user/signin");
    }
    return res.render("addBlog", {
        user: req.user
    });
});

// View Blog details
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
        return res.render("blog", {
            user: req.user,
            blog,
            comments,
        });
    } catch (err) {
        console.error("Error fetching blog details:", err);
        return res.redirect("/");
    }
});

// Post Comment
router.post('/comment/:blogId', async (req, res) => {
    if (!req.user) {
        return res.redirect("/user/signin");
    }
    try {
        await Comment.create({
            content: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id
        });
        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (err) {
        console.error("Error posting comment:", err);
        return res.redirect(`/blog/${req.params.blogId}`);
    }
});

// Create Blog Handler
router.post("/", upload.single("coverImage"), async (req, res) => {
    if (!req.user) {
        return res.redirect("/user/signin");
    }
    const { title, body } = req.body;
    try {
        const coverImageURL = req.file ? `/uploads/${req.file.filename}` : '/images/default-cover.svg';
        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL
        });
        return res.redirect(`/blog/${blog._id}`);
    } catch (err) {
        console.error("Error creating blog:", err);
        return res.render("addBlog", {
            user: req.user,
            error: "Failed to create blog post. Please try again."
        });
    }
});

module.exports = router;
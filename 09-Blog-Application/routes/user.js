const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin", { user: req.user });
});

router.get("/signup", (req, res) => {
    return res.render("signup", { user: req.user });
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordandGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        console.error("Signin error:", error);
        return res.render("signin", {
            error: "Incorrect Email or Password",
            user: req.user
        });
    }
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const user = await User.create({
            fullName,
            email,
            password,
        });
        // Auto-login after sign up
        const token = await User.matchPasswordandGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        console.error("Signup error:", error);
        return res.render("signup", {
            error: "Email already exists or signup failed",
            user: req.user
        });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

module.exports = router;
const { Router } = require("express");
const User = require("../models/user");

const router = Router();
const isProduction = process.env.NODE_ENV === "production";

function getAuthCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

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
        return res.cookie("token", token, getAuthCookieOptions()).redirect("/");
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
        return res.cookie("token", token, getAuthCookieOptions()).redirect("/");
    } catch (error) {
        console.error("Signup error:", error);
        return res.render("signup", {
            error: "Email already exists or signup failed",
            user: req.user
        });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
    }).redirect("/");
});

module.exports = router;

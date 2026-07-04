const User = require("../models/user")
const { setUser } = require("../service/auth")

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return res.status(400).render("Signup", { error: "All fields are required" });
    }

    await User.create({ name, email, password });
    return res.redirect("/user/login");
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(401).render("Login", { error: "Invalid username or password" });
    }

    const token = setUser(user._id, user);
    res.cookie("uid", token);
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};
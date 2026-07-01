const mongoose = require("mongoose")
const User = require("../models/user")
const { renderUsersList } = require("../views/userView")

async function renderUsersView(req, res) {
    try {
        const users = await User.find({})
        const html = renderUsersList(users)
        res.send(html)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.find({})
        return res.json(users)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function getUserById(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid user id" })
    }

    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ error: "User not found" })
        return res.json(user)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function createUser(req, res) {
    const data = req.body
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Missing user data" })
    }

    try {
        const newUser = await User.create(data)
        return res.status(201).json(newUser)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

async function updateUser(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid user id" })
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

        if (!updatedUser) return res.status(404).json({ error: "User not found" })
        return res.json(updatedUser)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

async function deleteUser(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid user id" })
    }

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) return res.status(404).json({ error: "User not found" })
        return res.json({ status: "deleted", user: deletedUser })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    renderUsersView,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}

const express = require("express")
const {
    renderUsersView,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/userController")

const router = express.Router()

router.get("/users", renderUsersView)
router.get("/api/users", getUsers)
router.post("/api/users", createUser)
router.route("/api/users/:id")
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router

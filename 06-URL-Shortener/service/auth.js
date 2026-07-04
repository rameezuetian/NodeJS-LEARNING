const jwt = require("jsonwebtoken");

const secret = "12345";

function setUser(id, user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        secret,
        { expiresIn: "1h" }
    );
}

function getUser(token) {
    if (!token) return null;

    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};
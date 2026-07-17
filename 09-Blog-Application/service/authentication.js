const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === "production";
const secret = process.env.JWT_SECRET || "$superMan@123";

if (isProduction && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set when NODE_ENV=production");
}

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = jwt.sign(payload, secret, {
        expiresIn: "7d",
    });
    return token;
}

function validateToken(token) {
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};

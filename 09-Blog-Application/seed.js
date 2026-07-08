const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/blogify")
  .then(() => console.log("Connected to MongoDB for seeding..."))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

async function seed() {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: "admin@blogify.com" });
    if (existingUser) {
      console.log("Seed user already exists!");
      process.exit(0);
    }

    // Create default user
    await User.create({
      fullName: "Admin User",
      email: "admin@blogify.com",
      password: "password123",
      role: "ADMIN"
    });

    console.log("Seeding complete! You can now log in using:");
    console.log("Email: admin@blogify.com");
    console.log("Password: password123");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();

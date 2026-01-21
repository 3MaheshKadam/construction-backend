
const dbConnect = require("../lib/dbConnect"); // Adjust path if needed
const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();

async function checkUserRole() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: "maheshkadam9298@gmail.com" });
    if (user) {
        console.log(`User Role: ${user.role}`);
    } else {
        console.log("User not found");
    }
    await mongoose.disconnect();
}

checkUserRole();

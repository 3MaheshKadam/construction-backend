
console.log("Current Directory:", process.cwd());
try {
    const dotenv = require("dotenv");
    console.log("dotenv loaded");
    dotenv.config();
    console.log("BASE_URL:", process.env.BASE_URL);
} catch (e) {
    console.error("dotenv failed:", e.message);
}

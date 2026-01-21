const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';



const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "client" },
    isEmailVerified: { type: Boolean, default: false },
    status: { type: String, default: "active" }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        const password = '12345678';
        const hashedPassword = await bcrypt.hash(password, 10);

        const users = [
            {
                name: 'Mahesh Kadam',
                email: 'maheshkadam9298@gmail.com',
                password: hashedPassword,
                role: 'client',
                isEmailVerified: true,
                status: 'active'
            },
            {
                name: 'Filament Admin',
                email: 'filament325@gmail.com',
                password: hashedPassword,
                role: 'admin',
                isEmailVerified: true,
                status: 'active'
            }
        ];

        for (const userData of users) {
            const existing = await User.findOne({ email: userData.email });
            if (existing) {
                console.log(`User ${userData.email} already exists. Skipping.`);
            } else {
                await User.create(userData);
                console.log(`User ${userData.email} created.`);
            }
        }

        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();

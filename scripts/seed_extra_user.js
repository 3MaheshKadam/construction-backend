const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

// Minimal Schemas
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: { type: String, unique: true },
    name: String,
    password: String,
    role: String,
    isEmailVerified: Boolean,
    status: String
}));
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({
    name: String,
    engineers: [mongoose.Schema.Types.ObjectId]
}));
const Role = mongoose.models.Role || mongoose.model('Role', new mongoose.Schema({
    name: String,
    permissions: Object
}));

async function seedExtra() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        // 0. Seed Engineer Role
        const roleName = 'engineer';
        let role = await Role.findOne({ name: roleName });
        if (!role) {
            role = await Role.create({
                name: roleName,
                permissions: {
                    projects: { read: true, write: true },
                    tasks: { read: true, write: true },
                    milestones: { read: true, write: true },
                    transactions: { read: true, write: false }
                }
            });
            console.log(`Role '${roleName}' created.`);
        }


        const email = 'bpranali420@gmail.com';
        const password = '12345678';
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create/Update User
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: 'Pranali B',
                email: email,
                password: hashedPassword,
                role: 'engineer',
                isEmailVerified: true,
                status: 'active'
            });
            console.log(`User ${email} created.`);
        } else {
            console.log(`User ${email} already exists.`);
        }

        // 2. Assign to Project
        const project = await Project.findOne({ name: "Mahesh Kadam Residential Project" });
        if (project) {
            if (!project.engineers.includes(user._id)) {
                project.engineers.push(user._id);
                await project.save();
                console.log(`User ${email} assigned as engineer to Project.`);
            } else {
                console.log(`User ${email} already assigned to Project.`);
            }
        } else {
            console.log("Project not found.");
        }

        console.log("Extra user seeding completed successfully.");
    } catch (error) {
        console.error("Extra user seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedExtra();

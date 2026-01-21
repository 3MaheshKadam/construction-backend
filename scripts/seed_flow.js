const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

const UserSchema = new mongoose.Schema({ email: String });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'ongoing' },
    budget: Number,
    startDate: Date,
    endDate: Date,
    location: String
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const TransactionSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    description: String,
    date: Date
}, { timestamps: true });

const Transaction = mongoose.models.NewTransaction || mongoose.model('NewTransaction', TransactionSchema);

async function seedFlow() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        // 1. Find the Client
        const clientEmail = 'maheshkadam9298@gmail.com';
        const client = await User.findOne({ email: clientEmail });

        if (!client) {
            console.error("Client not found. Please run seed_users.js first.");
            return;
        }

        // 2. Create a Project
        const projectName = "Mahesh Kadam Residential Project";
        let project = await Project.findOne({ name: projectName });

        if (!project) {
            project = await Project.create({
                name: projectName,
                description: "Initial residential project in Mumbai",
                manager: client._id,
                status: 'ongoing',
                budget: 5000000, // 50 Lakhs
                startDate: new Date(),
                endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
                location: "Mumbai, Maharashtra"
            });
            console.log(`Project '${projectName}' created.`);
        } else {
            console.log(`Project '${projectName}' already exists.`);
        }

        // 3. Create initial transactions
        const existingTx = await Transaction.findOne({ projectId: project._id });
        if (!existingTx) {
            await Transaction.create([
                {
                    projectId: project._id,
                    createdBy: client._id,
                    type: 'income',
                    amount: 1000000,
                    description: 'Initial project funding',
                    date: new Date()
                },
                {
                    projectId: project._id,
                    createdBy: client._id,
                    type: 'expense',
                    amount: 50000,
                    description: 'Site survey and planning',
                    date: new Date()
                }
            ]);
            console.log("Initial transactions created.");
        } else {
            console.log("Transactions already exist for this project.");
        }

        console.log("Seeding flow completed successfully.");
    } catch (error) {
        console.error("Seeding flow failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedFlow();

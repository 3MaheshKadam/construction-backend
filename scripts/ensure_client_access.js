const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: String,
    assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { strict: false })); // strict false to allow other fields

const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({
    name: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { strict: false }));

async function ensureClientAccess() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });

        const clientEmail = 'maheshkadam9298@gmail.com';
        const projectName = "Mahesh Kadam Residential Project";

        const client = await User.findOne({ email: clientEmail });
        const project = await Project.findOne({ name: projectName });

        if (!client) {
            console.error(`Client ${clientEmail} NOT found. Please seed users first.`);
            return;
        }
        if (!project) {
            console.error(`Project ${projectName} NOT found. Please seed project first.`);
            return;
        }

        let changesMade = false;

        // 1. Ensure Client is Manager
        if (!project.manager || project.manager.toString() !== client._id.toString()) {
            project.manager = client._id;
            await project.save();
            console.log(`UPDATED: Set ${clientEmail} as Manager of ${projectName}.`);
            changesMade = true;
        } else {
            console.log(`OK: Client is already Manager.`);
        }

        // 2. Ensure Project is in Client's assignedProjects
        // Check if array exists first
        if (!client.assignedProjects) client.assignedProjects = [];

        const isAssigned = client.assignedProjects.some(id => id.toString() === project._id.toString());
        if (!isAssigned) {
            client.assignedProjects.push(project._id);
            await client.save();
            console.log(`UPDATED: Added ${projectName} to client's assignedProjects.`);
            changesMade = true;
        } else {
            console.log(`OK: Project is already in assignedProjects.`);
        }

        if (!changesMade) {
            console.log("SUCCESS: Client is already fully linked to the project.");
        } else {
            console.log("SUCCESS: Client linkage issues fixed.");
        }

    } catch (e) {
        console.error("Error ensuring access:", e);
    } finally {
        await mongoose.disconnect();
    }
}

ensureClientAccess();

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: String,
    assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}));
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({
    name: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));

async function checkClientAccess() {
    try {
        console.log("Connecting...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });

        const clientEmail = 'maheshkadam9298@gmail.com';
        const projectName = "Mahesh Kadam Residential Project";

        const client = await User.findOne({ email: clientEmail });
        const project = await Project.findOne({ name: projectName });

        if (!client) {
            console.log(`Client ${clientEmail} NOT found.`);
            return;
        }
        if (!project) {
            console.log(`Project ${projectName} NOT found.`);
            return;
        }

        console.log(`Client ID: ${client._id}`);
        console.log(`Project ID: ${project._id}`);

        // Check Project -> Manager link
        const isManager = project.manager && project.manager.toString() === client._id.toString();
        console.log(`1. Is Client the Project Manager? ${isManager ? "YES" : "NO"}`);

        // Check User -> AssignedProjects link
        const isAssigned = client.assignedProjects && client.assignedProjects.some(id => id.toString() === project._id.toString());
        console.log(`2. Is Project in Client's assignedProjects? ${isAssigned ? "YES" : "NO"} (${client.assignedProjects?.length || 0} projects assigned)`);

        if (isManager && !isAssigned) {
            console.log("FIX REQUIRED: Client is Manager but missing from assignedProjects.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

checkClientAccess();

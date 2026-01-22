
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";

const ProjectSchema = new mongoose.Schema({}, { strict: false });
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

async function list() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");
        const projects = await Project.find({});
        console.log(`TOTAL PROJECTS: ${projects.length}`);

        projects.forEach(p => {
            console.log(`- NAME: ${p.name}`);
            console.log(`  CLIENT EMAIL: ${p.clientEmail}`);
            console.log(`  ID: ${p._id}`);
            console.log(`  CLIENT NAME: ${p.clientName}`);
            console.log("-------------------");
        });

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

list();

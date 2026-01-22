
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";

const ProjectSchema = new mongoose.Schema({}, { strict: false });
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

async function check() {
    await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
    const projects = await Project.find({});
    console.log("CHECKING PROJECTS:");
    projects.forEach(p => {
        console.log(`[${p.name}] -> clientEmail: [${p.clientEmail}]`);
    });
    await mongoose.disconnect();
}
check();

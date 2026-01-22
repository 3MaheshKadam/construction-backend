
const mongoose = require("mongoose");
const fs = require("fs");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";
const ids = JSON.parse(fs.readFileSync("scripts/ids.json"));

mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const PID = new mongoose.Types.ObjectId(ids.PROJECT_ID);

    const project = await mongoose.connection.collection('projects').findOne({ _id: PID });
    console.log("--- PROJECT SYNC CHECK ---");
    console.log(`Plans Array Length: ${project.plans ? project.plans.length : 0}`);
    console.log(`Project Documents Length: ${project.projectDocuments ? project.projectDocuments.length : 0}`);

    if (project.projectDocuments && project.projectDocuments.length > 0) {
        console.log("Last Document Entry:", JSON.stringify(project.projectDocuments[project.projectDocuments.length - 1], null, 2));
    }

    const plan = await mongoose.connection.collection('plans').findOne({ projectId: PID });
    console.log("\n--- PLAN VIRTUAL CHECK (Simulation) ---");
    // Manual check since findOne returns the raw document
    console.log("Plan File URL field:", plan.file ? plan.file.url : "MISSING");

    process.exit(0);
});

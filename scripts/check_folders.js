
const mongoose = require("mongoose");
const fs = require("fs");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";
const ids = JSON.parse(fs.readFileSync("scripts/ids.json"));

mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const PID = new mongoose.Types.ObjectId(ids.PROJECT_ID);
    console.log(`Checking folders for Project: ${PID}`);

    const folders = await mongoose.connection.collection('planfolders').find({ projectId: PID }).toArray();
    console.log(`Found ${folders.length} folders.`);

    folders.forEach(f => {
        console.log(`Folder: ${f.name}`);
        console.log(`Documents Count: ${f.planDocuments ? f.planDocuments.length : 0}`);
        if (f.planDocuments) {
            f.planDocuments.forEach(d => {
                console.log(`  Document: ${d.name}`);
                console.log(`  Versions: ${JSON.stringify(d.versions)}`);
            });
        }
    });

    process.exit(0);
});


const mongoose = require("mongoose");
const fs = require("fs");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";
const ids = JSON.parse(fs.readFileSync("scripts/ids.json"));

async function verify() {
    await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
    const PID = new mongoose.Types.ObjectId(ids.PROJECT_ID);
    const db = mongoose.connection;

    const collections = [
        'boqs', 'surveys', 'plans', 'milestones',
        'materialrequests', 'materialpurchases', 'materialreceiveds', 'materialuseds',
        'reports', 'announcements', 'snags', 'risks', 'transactions', 'workprogresses'
    ];

    console.log(`--- VERIFICATION FOR PROJECT: ${PID} ---`);
    for (const coll of collections) {
        const count = await db.collection(coll).countDocuments({ projectId: PID });
        console.log(`${coll.padEnd(20)}: ${count}`);
    }

    process.exit(0);
}

verify();

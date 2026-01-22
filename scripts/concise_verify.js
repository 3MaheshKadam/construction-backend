
const mongoose = require("mongoose");
const fs = require("fs");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";
const ids = JSON.parse(fs.readFileSync("scripts/ids.json"));
mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const PID = new mongoose.Types.ObjectId(ids.PROJECT_ID);
    const colls = ['boqs', 'surveys', 'plans', 'milestones', 'materialrequests', 'materialpurchases', 'materialreceiveds', 'materialuseds', 'reports', 'announcements', 'snags', 'risks', 'transactions', 'workprogresses'];
    const results = [];
    for (const c of colls) {
        const n = await mongoose.connection.collection(c).countDocuments({ projectId: PID });
        results.push(`${c}: ${n}`);
    }
    console.log(results.join(" | "));
    process.exit(0);
});

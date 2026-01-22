
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const projects = await mongoose.connection.collection('projects').find({}).toArray();
    projects.forEach(p => {
        if (p.plans && p.plans.length > 0) {
            console.log(`\nProject: ${p.name}`);
            console.log(`Plans Array: ${JSON.stringify(p.plans, null, 2)}`);
        }
    });
    process.exit(0);
});

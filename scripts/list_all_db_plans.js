
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const plans = await mongoose.connection.collection('plans').find({}).toArray();
    console.log(`TOTAL PLANS IN DB: ${plans.length}`);
    plans.forEach(p => {
        console.log(`\nPlan: ${p.name || p.title}`);
        console.log(`ProjectId: ${p.projectId}`);
        console.log(`File Structure: ${JSON.stringify(p.file)}`);
        console.log(`Keys: ${Object.keys(p).join(', ')}`);
    });
    process.exit(0);
});

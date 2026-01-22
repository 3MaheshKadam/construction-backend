
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";
mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const p = await mongoose.connection.collection('projects').findOne({ name: /Mahesh Kadam/i });
    if (p) {
        console.log(`FULL NAME: "${p.name}"`);
        console.log(`CLIENT EMAIL: "${p.clientEmail}"`);
    } else {
        console.log("Mahesh Kadam project NOT FOUND");
    }
    process.exit(0);
});

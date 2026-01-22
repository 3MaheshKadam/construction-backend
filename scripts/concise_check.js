
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";
mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const ps = await mongoose.connection.collection('projects').find({}).toArray();
    ps.forEach(p => console.log(`${p.name} | EMAIL: ${p.clientEmail}`));
    process.exit(0);
});

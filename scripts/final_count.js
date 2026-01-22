
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";
const EMAIL = "maheshkadam9298@gmail.com";
mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const list = await mongoose.connection.collection('projects').find({ clientEmail: EMAIL }).toArray();
    console.log(`COUNT: ${list.length}`);
    list.forEach(p => console.log(`- ${p.name}`));
    process.exit(0);
});


const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";
const CLIENT_EMAIL = "maheshkadam9298@gmail.com";

mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    // 1. Find the client user object for the ID
    const user = await mongoose.connection.collection('users').findOne({ email: CLIENT_EMAIL });
    if (!user) {
        console.log("Client user not found!");
        process.exit(1);
    }

    // 2. Update the project
    const result = await mongoose.connection.collection('projects').updateOne(
        { name: /Mahesh Kadam/i },
        {
            $set: {
                clientEmail: CLIENT_EMAIL,
                manager: user._id // Making sure he is also the manager if that's how the other project works
            }
        }
    );

    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

    // 3. Verify
    const p = await mongoose.connection.collection('projects').findOne({ name: /Mahesh Kadam/i });
    console.log(`Updated Project: ${p.name}`);
    console.log(`Email now: ${p.clientEmail}`);

    process.exit(0);
});


const mongoose = require("mongoose");
const fs = require("fs");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const org = await mongoose.connection.collection('organizations').findOne({});
    const vendors = await mongoose.connection.collection('vendors').find({}).toArray();
    const users = await mongoose.connection.collection('users').find({ role: { $in: ['admin', 'manager', 'engineer', 'client'] } }).toArray();
    const pt = await mongoose.connection.collection('projecttypes').findOne({ projectTypeName: /Residential/i });
    const project = await mongoose.connection.collection('projects').findOne({ name: /Vitthala/i });

    const data = {
        ORG_ID: org?._id,
        VENDOR_IDS: vendors.map(v => v._id),
        USERS: users.reduce((acc, u) => { acc[u.email] = u._id; return acc; }, {}),
        PROJECT_TYPE_ID: pt?._id,
        PROJECT_ID: project?._id
    };

    fs.writeFileSync("scripts/ids.json", JSON.stringify(data, null, 2));
    console.log("Saved to scripts/ids.json");
    process.exit(0);
});

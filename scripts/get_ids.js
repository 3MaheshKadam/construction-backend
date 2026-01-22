
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' }).then(async () => {
    const org = await mongoose.connection.collection('organizations').findOne({});
    const vendors = await mongoose.connection.collection('vendors').find({}).toArray();
    const users = await mongoose.connection.collection('users').find({ role: { $in: ['admin', 'manager', 'engineer', 'client'] } }).toArray();
    const pt = await mongoose.connection.collection('projecttypes').findOne({ projectTypeName: /Residential/i });

    console.log("--- IDS ---");
    console.log(`ORG_ID: ${org?._id}`);
    console.log(`VENDOR_IDS: ${vendors.map(v => v._id).join(',')}`);
    console.log(`USER_IDS: ${users.map(u => `${u.email}:${u._id}`).join(' | ')}`);
    console.log(`PROJECT_TYPE_ID: ${pt?._id}`);

    process.exit(0);
});

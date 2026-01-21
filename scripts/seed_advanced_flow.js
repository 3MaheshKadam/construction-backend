const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

// Minimal Schemas for Seeding
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String, name: String }));
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({ name: String, manager: mongoose.Schema.Types.ObjectId }));
const Organization = mongoose.models.Organization || mongoose.model('Organization', new mongoose.Schema({
    name: String,
    gstNumber: String,
    panNumber: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    settings: { currency: String, timezone: String }
}));
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', new mongoose.Schema({
    name: String,
    email: String,
    vendorcode: String,
    gstinno: String,
    address: String
}));
const Material = mongoose.models.Material || mongoose.model('Material', new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    materialName: String,
    unit: String,
    gst: Number,
    hsnCode: String,
    quantity: Number,
    addedBy: mongoose.Schema.Types.ObjectId
}));
const Milestone = mongoose.models.Milestone || mongoose.model('Milestone', new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    createdby: mongoose.Schema.Types.ObjectId,
    status: String,
    subtasks: [{ title: String, isCompleted: Boolean }]
}));
const Transaction = mongoose.models.NewTransaction || mongoose.model('NewTransaction', new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    createdBy: mongoose.Schema.Types.ObjectId,
    vendorId: mongoose.Schema.Types.ObjectId,
    type: String,
    amount: Number,
    description: String,
    paymentMode: String,
    date: Date
}));

async function seedAdvancedFlow() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        // 1. Get references
        const admin = await User.findOne({ email: 'filament325@gmail.com' });
        const client = await User.findOne({ email: 'maheshkadam9298@gmail.com' });
        const project = await Project.findOne({ name: "Mahesh Kadam Residential Project" });

        if (!admin || !client || !project) {
            console.error("Baseline data missing. Run previous seeds first.");
            return;
        }

        // 2. Seed Organization
        let org = await Organization.findOne({ name: "Kadam Constructions" });
        if (!org) {
            org = await Organization.create({
                name: "Kadam Constructions",
                gstNumber: "27AAACK1234A1Z1",
                panNumber: "AAACK1234A",
                createdBy: client._id,
                settings: { currency: "INR", timezone: "Asia/Kolkata" }
            });
            console.log("Organization 'Kadam Constructions' created.");
        }

        // 3. Seed Vendors
        const vendors = [
            { name: "Suman Steel Traders", email: "suman@steel.in", vendorcode: "VEND001", gstinno: "27SSST1234B1Z2", address: "Kalbadevi, Mumbai" },
            { name: "Bharat Cement Agency", email: "contact@bharatcement.in", vendorcode: "VEND002", gstinno: "27BCAG1234C1Z3", address: "Vashi, Navi Mumbai" }
        ];
        const seededVendors = [];
        for (const v of vendors) {
            let vendor = await Vendor.findOne({ email: v.email });
            if (!vendor) {
                vendor = await Vendor.create(v);
                console.log(`Vendor '${v.name}' created.`);
            }
            seededVendors.push(vendor);
        }

        // 4. Seed Materials
        const materials = [
            { projectId: project._id, materialName: "TMT Steel Bars", unit: "kg", gst: 18, hsnCode: "7214", quantity: 5000, addedBy: client._id },
            { projectId: project._id, materialName: "OPC Cement", unit: "bags", gst: 28, hsnCode: "2523", quantity: 1000, addedBy: client._id }
        ];
        for (const m of materials) {
            let mat = await Material.findOne({ materialName: m.materialName, projectId: project._id });
            if (!mat) {
                await Material.create(m);
                console.log(`Material '${m.materialName}' added.`);
            }
        }

        // 5. Seed Milestones
        const milestones = [
            {
                projectId: project._id,
                title: "Foundation Work",
                description: "Excavation and Raft Foundation",
                createdby: client._id,
                status: "in_progress",
                subtasks: [
                    { title: "Excavation", isCompleted: true },
                    { title: "PCC Work", isCompleted: true },
                    { title: "Steel Binding", isCompleted: false }
                ]
            }
        ];
        for (const ms of milestones) {
            let mil = await Milestone.findOne({ title: ms.title, projectId: project._id });
            if (!mil) {
                await Milestone.create(ms);
                console.log(`Milestone '${ms.title}' created.`);
            }
        }

        // 6. Seed Specific Transactions
        const transactions = [
            {
                projectId: project._id,
                createdBy: client._id,
                vendorId: seededVendors[0]._id,
                type: 'purchase',
                amount: 250000,
                description: 'Purchase of 5 tons TMT Steel',
                paymentMode: 'bank_transfer',
                date: new Date()
            },
            {
                projectId: project._id,
                createdBy: client._id,
                vendorId: seededVendors[1]._id,
                type: 'purchase',
                amount: 450000,
                description: 'Purchase of 1000 bags Cement',
                paymentMode: 'upi',
                date: new Date()
            }
        ];
        for (const tx of transactions) {
            const exists = await Transaction.findOne({ description: tx.description, projectId: project._id });
            if (!exists) {
                await Transaction.create(tx);
                console.log(`Transaction for '${tx.description}' created.`);
            }
        }

        console.log("Advanced seeding flow completed successfully.");
    } catch (error) {
        console.error("Advanced seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdvancedFlow();

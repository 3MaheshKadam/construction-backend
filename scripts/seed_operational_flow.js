const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

// Minimal Schemas
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String }));
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({ name: String }));
const Material = mongoose.models.Material || mongoose.model('Material', new mongoose.Schema({ materialName: String, projectId: mongoose.Schema.Types.ObjectId }));
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', new mongoose.Schema({ email: String }));
const MaterialRequest = mongoose.models.MaterialRequest || mongoose.model('MaterialRequest', new mongoose.Schema({}, { strict: false }));
const MaterialPurchase = mongoose.models.MaterialPurchase || mongoose.model('MaterialPurchase', new mongoose.Schema({}, { strict: false }));
const MaterialReceived = mongoose.models.MaterialReceived || mongoose.model('MaterialReceived', new mongoose.Schema({}, { strict: false }));
const MaterialUsed = mongoose.models.MaterialUsed || mongoose.model('MaterialUsed', new mongoose.Schema({}, { strict: false }));
const Snag = mongoose.models.Snag || mongoose.model('Snag', new mongoose.Schema({}, { strict: false }));
const Report = mongoose.models.Report || mongoose.model('Report', new mongoose.Schema({}, { strict: false }));

async function seedOperationalFlow() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        const engineer = await User.findOne({ email: 'bpranali420@gmail.com' });
        const client = await User.findOne({ email: 'maheshkadam9298@gmail.com' });
        const project = await Project.findOne({ name: "Mahesh Kadam Residential Project" });
        const steelMaterial = await Material.findOne({ materialName: "TMT Steel Bars", projectId: project._id });
        const cementMaterial = await Material.findOne({ materialName: "OPC Cement", projectId: project._id });
        const steelVendor = await Vendor.findOne({ email: "suman@steel.in" });

        if (!engineer || !client || !project || !steelMaterial || !cementMaterial || !steelVendor) {
            console.error("References missing.");
            return;
        }

        // 1. Material Request
        let req = await MaterialRequest.findOne({ itemDescription: "Urgent Steel Request for Column Binding", projectId: project._id });
        if (!req) {
            req = await MaterialRequest.create({
                projectId: project._id,
                materialId: steelMaterial._id,
                date: "2026-01-20",
                status: "Approved",
                itemDescription: "Urgent Steel Request for Column Binding",
                quantity: 1000,
                addedBy: engineer._id
            });
            console.log("Material Request created.");
        }

        // 2. Material Purchase
        let purchase = await MaterialPurchase.findOne({ materialId: steelMaterial._id, projectId: project._id, quantity: 1000 });
        if (!purchase) {
            purchase = await MaterialPurchase.create({
                projectId: project._id,
                vendorId: steelVendor._id,
                materialId: steelMaterial._id,
                date: "2026-01-21",
                rate: "67",
                totalAmount: "67000",
                status: "Purchased",
                quantity: 1000,
                createdBy: client._id
            });
            console.log("Material Purchase created.");
        }

        // 3. Material Received
        let received = await MaterialReceived.findOne({ challanNo: "CH-ST-009", projectId: project._id });
        if (!received) {
            await MaterialReceived.create({
                projectId: project._id,
                vendorId: steelVendor._id,
                materialId: steelMaterial._id,
                date: "2026-01-21",
                status: "Received",
                quantity: 1000,
                note: "Steel delivered in good condition",
                vehicleNo: "MH-01-BK-5678",
                challanNo: "CH-ST-009",
                addedBy: engineer._id
            });
            console.log("Material Received entry created.");
        }

        // 4. Material Used
        let used = await MaterialUsed.findOne({ note: "Used for Ground Floor Column C1-C5", projectId: project._id });
        if (!used) {
            await MaterialUsed.create({
                projectId: project._id,
                materialId: steelMaterial._id,
                date: "2026-01-21",
                status: "Used",
                quantity: 450,
                note: "Used for Ground Floor Column C1-C5",
                addedBy: engineer._id
            });
            console.log("Material Used entry created.");
        }

        // 5. Snag Reporting
        let snag = await Snag.findOne({ title: "Surface cracks on PCC", projectId: project._id });
        if (!snag) {
            await Snag.create({
                projectId: project._id,
                reportedBy: engineer._id,
                title: "Surface cracks on PCC",
                description: "Subtle cracks observed on the surface of PCC layer at East corner.",
                severity: "medium",
                status: "open"
            });
            console.log("Snag Reported.");
        }

        // 6. Progress Report
        let report = await Report.findOne({ title: "Weekly Site Progress Report - Jan Week 3", projectId: project._id });
        if (!report) {
            await Report.create({
                projectId: project._id,
                createdBy: engineer._id,
                reportType: "progress",
                title: "Weekly Site Progress Report - Jan Week 3",
                content: "Foundation excavation complete. PCC work started for 60% of site area. Material procurement on track.",
                sharedWith: [client._id],
                sharedVia: "email"
            });
            console.log("Progress Report created.");
        }

        console.log("Operational seeding completed successfully.");
    } catch (error) {
        console.error("Operational seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedOperationalFlow();

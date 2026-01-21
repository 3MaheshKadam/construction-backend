const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

// Minimal Schemas
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String }));
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({ name: String, manager: mongoose.Schema.Types.ObjectId }));
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', new mongoose.Schema({ email: String, name: String }));
const Transaction = mongoose.models.NewTransaction || mongoose.model('NewTransaction', new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    createdBy: mongoose.Schema.Types.ObjectId,
    vendorId: mongoose.Schema.Types.ObjectId,
    type: String,
    amount: Number,
    description: String,
    category: String,
    paymentMode: String,
    date: Date
}));

async function seedVariety() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        const client = await User.findOne({ email: 'maheshkadam9298@gmail.com' });
        const project = await Project.findOne({ name: "Mahesh Kadam Residential Project" });
        const vendor1 = await Vendor.findOne({ email: "suman@steel.in" });
        const vendor2 = await Vendor.findOne({ email: "contact@bharatcement.in" });

        if (!client || !project || !vendor1 || !vendor2) {
            console.error("References missing.");
            return;
        }

        const data = [
            // More Purchase Transactions
            {
                projectId: project._id,
                createdBy: client._id,
                vendorId: vendor2._id,
                type: 'purchase',
                amount: 150000,
                category: 'Cement',
                description: 'Additional 300 bags of Ultratech Cement',
                paymentMode: 'bank_transfer',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                projectId: project._id,
                createdBy: client._id,
                vendorId: vendor1._id,
                type: 'purchase',
                amount: 80000,
                category: 'Steel',
                description: 'Binding wire and structural pipes',
                paymentMode: 'upi',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            // Direct Expenses
            {
                projectId: project._id,
                createdBy: client._id,
                type: 'expense',
                amount: 12000,
                category: 'Labour',
                description: 'Weekly wages for foundation team',
                paymentMode: 'cash',
                date: new Date()
            },
            {
                projectId: project._id,
                createdBy: client._id,
                type: 'expense',
                amount: 5000,
                category: 'Site Utilities',
                description: 'Water tank refill for site',
                paymentMode: 'cash',
                date: new Date()
            },
            // Payment Received from Client (Project Budget Top-up)
            {
                projectId: project._id,
                createdBy: client._id,
                type: 'payment_in',
                amount: 500000,
                description: 'Second installment from Mahesh Kadam',
                paymentMode: 'bank_transfer',
                date: new Date()
            }
        ];

        for (const item of data) {
            const exists = await Transaction.findOne({ description: item.description, projectId: project._id });
            if (!exists) {
                await Transaction.create(item);
                console.log(`Seeded: ${item.description}`);
            }
        }

        console.log("Variety seeding completed successfully.");
    } catch (error) {
        console.error("Variety seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedVariety();

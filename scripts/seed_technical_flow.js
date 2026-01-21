const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

// Minimal Schemas
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String }));
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({ name: String, manager: mongoose.Schema.Types.ObjectId }));
const BOQ = mongoose.models.BOQ || mongoose.model('BOQ', new mongoose.Schema({}, { strict: false }));
const Survey = mongoose.models.Survey || mongoose.model('Survey', new mongoose.Schema({}, { strict: false }));
const Plan = mongoose.models.Plan || mongoose.model('Plan', new mongoose.Schema({}, { strict: false }));
const Transaction = mongoose.models.NewTransaction || mongoose.model('NewTransaction', new mongoose.Schema({}, { strict: false }));

async function seedTechnicalFlow() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        const client = await User.findOne({ email: 'maheshkadam9298@gmail.com' });
        const project = await Project.findOne({ name: "Mahesh Kadam Residential Project" });

        if (!client || !project) {
            console.error("References missing.");
            return;
        }

        // 1. Seed BOQ
        const boqName = "Phase 1 - Structured Civil BOQ";
        let boq = await BOQ.findOne({ boqName, projectId: project._id });
        if (!boq) {
            boq = await BOQ.create({
                boqName,
                projectId: project._id,
                builtUpArea: 2500, // sq ft
                structuralType: "RCC Frame",
                foundationType: "Isolated Footing",
                status: "approved",
                createdBy: client._id,
                boqVersion: [{
                    versionNumber: 1,
                    status: "approved",
                    clientApproval: "approved",
                    contractorApproval: "approved",
                    laborCost: 1500000,
                    materials: [
                        { name: "TMT Steel", qty: 4500, unit: "kg", rate: 65, amount: 292500 },
                        { name: "OPC Cement", qty: 800, unit: "bags", rate: 420, amount: 336000 },
                        { name: "Crushed Stone Aggregates", qty: 40, unit: "brass", rate: 4500, amount: 180000 },
                        { name: "River Sand (Narmada)", qty: 25, unit: "brass", rate: 8500, amount: 212500 }
                    ],
                    totalMaterialCost: 1021000,
                    totalCost: 2521000
                }]
            });
            console.log(`BOQ '${boqName}' created.`);
        }

        // 2. Seed Site Survey
        let survey = await Survey.findOne({ projectId: project._id });
        if (!survey) {
            survey = await Survey.create({
                projectId: project._id,
                surveyDate: "2026-01-15",
                requestedBy: client._id,
                status: "approved",
                description: "Initial topographical and soil survey for Mumbai residential site",
                location: {
                    siteName: "Kadam Niwas Site",
                    addressLine1: "Plot 42, Sector 15",
                    city: "Mumbai",
                    state: "Maharashtra",
                    pincode: "400001"
                },
                plotDetails: {
                    plotShape: "Rectangular",
                    plotLength: "50",
                    plotWidth: "40",
                    plotArea: "2000",
                    areaUnit: "sq.ft"
                },
                soil: {
                    soilType: "Red Murrum",
                    soilRemark: "Good bearing capacity detected",
                    waterTableDepthApprox: "35 ft"
                },
                utilities: {
                    water: { available: true, source: "Municipality", remarks: "Connected to pipeline" },
                    electricity: { available: true, phase: "3 Phase", meterInstalled: true }
                },
                photos: [
                    "https://res.cloudinary.com/demo/image/upload/sample_site_1.jpg",
                    "https://res.cloudinary.com/demo/image/upload/sample_site_2.jpg"
                ]
            });
            console.log("Site Survey created.");
        }

        // 3. Seed Plans
        const planTitles = ["Ground Floor Architectural Plan", "Structural Column Layout"];
        for (const title of planTitles) {
            let plan = await Plan.findOne({ title, projectId: project._id });
            if (!plan) {
                await Plan.create({
                    projectId: project._id,
                    boqId: boq._id,
                    title: title,
                    planType: title.includes("Architectural") ? "architectural" : "structural",
                    floor: "Ground Floor",
                    area: "Main Building",
                    file: {
                        url: "https://example.com/plans/" + title.replace(/ /g, "_") + ".pdf",
                        fileType: "pdf",
                        originalName: title + ".pdf"
                    },
                    version: 1,
                    isLatest: true,
                    uploadedBy: client._id
                });
                console.log(`Plan '${title}' created.`);
            }
        }

        // 4. Add Material Transactions
        const txs = [
            {
                projectId: project._id,
                createdBy: client._id,
                type: 'purchase',
                amount: 75000,
                description: 'Advance payment for Crushed Stone Aggregates',
                category: 'Material Purchase',
                paymentMode: 'bank_transfer',
                date: new Date()
            }
        ];
        for (const tx of txs) {
            const exists = await Transaction.findOne({ description: tx.description, projectId: project._id });
            if (!exists) {
                await Transaction.create(tx);
                console.log(`Transaction seeded: ${tx.description}`);
            }
        }

        console.log("Technical seeding flow completed successfully.");
    } catch (error) {
        console.error("Technical seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedTechnicalFlow();

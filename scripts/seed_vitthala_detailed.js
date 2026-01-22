
const mongoose = require("mongoose");
const fs = require("fs");
const MONGODB_URI = "mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0";

const ids = JSON.parse(fs.readFileSync("scripts/ids.json"));

async function seed() {
    await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
    const db = mongoose.connection;

    const PID = new mongoose.Types.ObjectId(ids.PROJECT_ID);
    const ADMIN_ID = new mongoose.Types.ObjectId(ids.USERS["filament325@gmail.com"]);
    const CLIENT_ID = new mongoose.Types.ObjectId(ids.USERS["maheshkadam9298@gmail.com"]);
    const ENG_ID = new mongoose.Types.ObjectId(ids.USERS["bpranali420@gmail.com"]);
    const VENDOR_ID = new mongoose.Types.ObjectId(ids.VENDOR_IDS[0]);
    const PT_ID = new mongoose.Types.ObjectId(ids.PROJECT_TYPE_ID);

    console.log(`Seeding for Project: ${PID}`);

    // 1. BOQ
    const boqId = new mongoose.Types.ObjectId();
    await db.collection('boqs').insertOne({
        _id: boqId,
        projectId: PID,
        boqName: "Vitthala Main BOQ - Phase 1",
        builtUpArea: 1800,
        structuralType: "RCC Frame",
        foundationType: "Pile Foundation",
        laborCost: 120000,
        materials: [
            { name: "Cement", qty: 400, rate: 450, unit: "bags" },
            { name: "Steel", qty: 800, rate: 70, unit: "kg" },
            { name: "Bricks", qty: 10000, rate: 9, unit: "nos" }
        ],
        boqVersion: [{ title: "Initial Version", createdBy: ADMIN_ID, createdAt: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // 2. Survey
    await db.collection('surveys').insertOne({
        projectId: PID,
        projectTypeId: PT_ID,
        surveyDate: new Date().toISOString().split('T')[0],
        requestedBy: ADMIN_ID,
        status: "approved",
        description: "Initial topographic and soil survey for Vitthala project.",
        location: { siteName: "Vitthala Site", city: "Pune", state: "Maharashtra" },
        plotDetails: { plotArea: "2500", areaUnit: "sq.ft" },
        soil: { soilType: "Black Cotton", soilRemark: "Medium bearing capacity" },
        createdAt: new Date()
    });

    // 3. Plans
    await db.collection('plans').insertMany([
        {
            projectId: PID,
            title: "Ground Floor Architectural Plan",
            planType: "architectural",
            floor: "Ground",
            area: "Main Unit",
            file: { url: "https://example.com/plans/arch_ground.pdf", fileType: "pdf" },
            version: 1,
            isLatest: true,
            uploadedBy: ADMIN_ID,
            createdAt: new Date()
        },
        {
            projectId: PID,
            title: "Structural Column Layout",
            planType: "structural",
            floor: "Foundation",
            area: "Main Unit",
            file: { url: "https://example.com/plans/struct_foundation.pdf", fileType: "pdf" },
            version: 1,
            isLatest: true,
            uploadedBy: ADMIN_ID,
            createdAt: new Date()
        }
    ]);

    // 4. Milestones & Tasks
    const mId = new mongoose.Types.ObjectId();
    await db.collection('milestones').insertOne({
        _id: mId,
        projectId: PID,
        title: "Foundation & Plinth",
        createdby: ADMIN_ID,
        description: "Sub-structure work including excavation and RCC foundation.",
        subtasks: [
            { title: "Excavation", isCompleted: true, startDate: new Date() },
            { title: "PCC Work", isCompleted: true, startDate: new Date() },
            { title: "Footing Reinforcement", isCompleted: false, startDate: new Date() }
        ],
        progress: 66,
        status: "in_progress",
        createdAt: new Date()
    });

    // 5. Material Lifecycle
    const reqId = new mongoose.Types.ObjectId();
    await db.collection('materialrequests').insertOne({
        _id: reqId,
        projectId: PID,
        material_name: "OPC Cement",
        quantity: 100,
        units: "bags",
        status: "approved",
        requestedBy: ENG_ID,
        createdAt: new Date()
    });

    const purId = new mongoose.Types.ObjectId();
    await db.collection('materialpurchases').insertOne({
        _id: purId,
        projectId: PID,
        requestId: reqId,
        vendorId: VENDOR_ID,
        material_name: "OPC Cement",
        quantity: 100,
        unit_price: 440,
        total_amount: 44000,
        status: "ordered",
        purchasedBy: CLIENT_ID,
        createdAt: new Date()
    });

    await db.collection('materialreceiveds').insertOne({
        projectId: PID,
        purchaseId: purId,
        material_name: "OPC Cement",
        quantity_received: 100,
        receivedBy: ENG_ID,
        deliveryChallan: "VC-CEM-001",
        createdAt: new Date()
    });

    await db.collection('materialuseds').insertOne({
        projectId: PID,
        material_name: "OPC Cement",
        quantity_used: 20,
        usedBy: ENG_ID,
        remarks: "Used for footing PCC",
        createdAt: new Date()
    });

    // 6. Reports & Safety
    await db.collection('reports').insertOne({
        projectId: PID,
        type: "Daily Progress Report",
        title: "DPR - Foundation Day 5",
        content: "Excavation completed for 10 out of 12 footings. PCC starting tomorrow.",
        reportedBy: ENG_ID,
        date: new Date(),
        createdAt: new Date()
    });

    await db.collection('announcements').insertOne({
        projectId: PID,
        title: "Site Safety Protocol",
        content: "All workers must wear ISI mark helmets and safety vests from today.",
        createdBy: ADMIN_ID,
        targetRoles: ["engineer", "contractor", "worker"],
        createdAt: new Date()
    });

    // 7. Quality & Risk
    await db.collection('snags').insertOne({
        projectId: PID,
        title: "Improper excavation depth in C4",
        description: "Excavation is 2 inches shallow. Needs manual correction.",
        severity: "medium",
        status: "open",
        reportedBy: ENG_ID,
        createdAt: new Date()
    });

    await db.collection('risks').insertOne({
        projectId: PID,
        title: "Labor Shortage due to Festival",
        category: "Timeline",
        severity: "Medium",
        likelihood: 4,
        impact: 3,
        score: 12,
        status: "Open",
        createdBy: ADMIN_ID,
        createdAt: new Date()
    });

    // 8. Financials
    await db.collection('transactions').insertMany([
        {
            projectId: PID,
            createdBy: CLIENT_ID,
            type: "payment_in",
            amount: 500000,
            paymentMode: "bank_transfer",
            referenceNumber: "TXN123456",
            remarks: "Initial token payment for Vitthala project",
            status: "approved",
            createdAt: new Date()
        },
        {
            projectId: PID,
            createdBy: ADMIN_ID,
            type: "expense",
            amount: 15000,
            paymentMode: "cash",
            vendorName: "Local Earthmovers",
            remarks: "Excavator rental - Day 1",
            status: "approved",
            createdAt: new Date()
        }
    ]);

    // 9. Work Progress for Chart
    await db.collection('workprogresses').insertMany([
        {
            projectId: PID,
            progressDate: new Date(Date.now() - 86400000 * 2),
            workDescription: "Site clearing and marking",
            progressPercent: 5,
            reportedBy: ENG_ID,
            createdAt: new Date()
        },
        {
            projectId: PID,
            progressDate: new Date(Date.now() - 86400000),
            workDescription: "Excavation start",
            progressPercent: 12,
            reportedBy: ENG_ID,
            createdAt: new Date()
        }
    ]);

    console.log("✅ Seeding complete for Vitthala che krupa.");
    process.exit(0);
}

seed().catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});

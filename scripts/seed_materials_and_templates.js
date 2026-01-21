const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

// Schemas
const Material = mongoose.models.Material || mongoose.model('Material', new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    materialName: String,
    unit: String,
    gst: Number,
    hsnCode: String,
    category: String,
    description: String,
    quantity: Number,
    addedBy: mongoose.Schema.Types.ObjectId
}));
const ProjectType = mongoose.models.ProjectType || mongoose.model('ProjectType', new mongoose.Schema({
    projectTypeName: String,
    category: String,
    description: String,
    budgetMinRange: String,
    budgetMaxRange: String,
    estimated_days: Number,
    material: Array,
    createdBy: mongoose.Schema.Types.ObjectId
}));
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({ name: String }));
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String }));

async function seedMaterialsAndTemplates() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        const project = await Project.findOne({ name: "Mahesh Kadam Residential Project" });
        const admin = await User.findOne({ email: 'filament325@gmail.com' });
        const client = await User.findOne({ email: 'maheshkadam9298@gmail.com' });

        if (!project || !admin) {
            console.error("References missing.");
            return;
        }

        // 1. Add Diverse Indian Materials to Existing Project
        const newMaterials = [
            { materialName: "Red Clay Bricks (Standard)", unit: "nos", gst: 5, hsnCode: "6901", category: "Masonry", description: "Standard quality red bricks for wall construction", quantity: 20000 },
            { materialName: "River Sand (Plaster Grade)", unit: "brass", gst: 5, hsnCode: "2505", category: "Aggregates", description: "Fine sand for internal plastering", quantity: 10 },
            { materialName: "Astral CPVC Pipes 1\"", unit: "ft", gst: 18, hsnCode: "3917", category: "Plumbing", description: "Hot/Cold water lines", quantity: 500 },
            { materialName: "Polycab Wires 2.5sqmm", unit: "bundle", gst: 18, hsnCode: "8544", category: "Electrical", description: "FR wiring for internal circuits", quantity: 20 },
            { materialName: "Asian Paints Royale (White)", unit: "ltr", gst: 18, hsnCode: "3209", category: "Finishing", description: "Premium interior emulsion", quantity: 50 }
        ];

        for (const m of newMaterials) {
            const exists = await Material.findOne({ materialName: m.materialName, projectId: project._id });
            if (!exists) {
                await Material.create({ ...m, projectId: project._id, addedBy: client._id });
                console.log(`Material '${m.materialName}' added to project.`);
            }
        }

        // 2. Seed Project Templates (ProjectTypes)
        const templates = [
            {
                projectTypeName: "Residential Villa (G+1)",
                category: "Residential",
                description: "Standard template for a Ground + 1 floor extensive villa construction.",
                budgetMinRange: "30,00,000",
                budgetMaxRange: "60,00,000",
                estimated_days: 365,
                material: [
                    { material_name: "Cement", units: "bags", quantity: 1500 },
                    { material_name: "Steel", units: "kg", quantity: 8000 },
                    { material_name: "Bricks", units: "nos", quantity: 40000 }
                ],
                createdBy: admin._id
            },
            {
                projectTypeName: "Commercial Showroom Interior",
                category: "Commercial",
                description: "Interior fit-out template for retail showrooms.",
                budgetMinRange: "10,00,000",
                budgetMaxRange: "25,00,000",
                estimated_days: 90,
                material: [
                    { material_name: "Plywood 18mm", units: "sheets", quantity: 200 },
                    { material_name: "Gypsum Board", units: "nos", quantity: 500 },
                    { material_name: "LED Panels", units: "nos", quantity: 50 }
                ],
                createdBy: admin._id
            }
        ];

        for (const t of templates) {
            const exists = await ProjectType.findOne({ projectTypeName: t.projectTypeName });
            if (!exists) {
                await ProjectType.create(t);
                console.log(`Template '${t.projectTypeName}' created.`);
            }
        }

        console.log("Materials and Templates seeding completed.");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedMaterialsAndTemplates();

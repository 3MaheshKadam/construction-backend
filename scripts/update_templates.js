const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

const ProjectType = mongoose.models.ProjectType || mongoose.model('ProjectType', new mongoose.Schema({
    projectTypeName: String,
    material: Array
}, { strict: false }));

async function updateTemplates() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        // Indian Construction Material List
        const commonMaterials = [
            { material_name: "Red Clay Bricks (Standard)", units: "nos", quantity: 15000 },
            { material_name: "OPC Cement (Ultratech/ACC)", units: "bags", quantity: 800 },
            { material_name: "TMT Steel Bars (Fe500)", units: "kg", quantity: 4500 },
            { material_name: "River Sand (Plaster Grade)", units: "brass", quantity: 15 },
            { material_name: "Crushed Stone Aggregates (20mm)", units: "brass", quantity: 20 },
            { material_name: "Astral CPVC Pipes 1\"", units: "ft", quantity: 300 },
            { material_name: "Polycab Wires 2.5sqmm", units: "bundle", quantity: 15 },
            { material_name: "Asian Paints Royale (White)", units: "ltr", quantity: 60 },
            { material_name: "Teak Wood Frames", units: "cft", quantity: 25 },
            { material_name: "Vitrified Tiles (600x600)", units: "sq.ft", quantity: 1200 }
        ];

        const premiumMaterials = [
            ...commonMaterials,
            { material_name: "Italian Marble", units: "sq.ft", quantity: 800 },
            { material_name: "Schneider Electric Switches", units: "nos", quantity: 150 },
            { material_name: "Jaguar Sanitary Fittings", units: "set", quantity: 5 }
        ];

        const commercialMaterials = [
            { material_name: "Gypsum Board (Saint-Gobain)", units: "nos", quantity: 400 },
            { material_name: "Aluminum Section (Domal)", units: "kg", quantity: 300 },
            { material_name: "Toughened Glass 12mm", units: "sq.ft", quantity: 500 },
            { material_name: "Synthetic Enamel Paint", units: "ltr", quantity: 100 },
            { material_name: "Cat6 LAN Cables", units: "bundle", quantity: 10 }
        ];

        // 1. Update Residential Villa
        let resVilla = await ProjectType.findOne({ projectTypeName: "Residential Villa (G+1)" });
        if (resVilla) {
            resVilla.material = commonMaterials;
            await resVilla.save();
            console.log("Updated 'Residential Villa (G+1)' with generic civil & MEP materials.");
        }

        // 2. Update Commercial Showroom
        let commShowroom = await ProjectType.findOne({ projectTypeName: "Commercial Showroom Interior" });
        if (commShowroom) {
            commShowroom.material = commercialMaterials;
            await commShowroom.save();
            console.log("Updated 'Commercial Showroom Interior' with interior-specific materials.");
        }

        // 3. Create/Update a 'Premium Bungalow' Template
        let premBungalow = await ProjectType.findOne({ projectTypeName: "Premium Bungalow Template" });
        if (!premBungalow) {
            await ProjectType.create({
                projectTypeName: "Premium Bungalow Template",
                category: "Residential",
                description: "High-end residential blueprint with premium specifications.",
                budgetMinRange: "80,00,000",
                budgetMaxRange: "1,50,00,000",
                estimated_days: 450,
                material: premiumMaterials
            });
            console.log("Created 'Premium Bungalow Template' with high-end specs.");
        } else {
            premBungalow.material = premiumMaterials;
            await premBungalow.save();
            console.log("Updated 'Premium Bungalow Template'.");
        }

        console.log("Template updates completed successfully.");

    } catch (error) {
        console.error("Update failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

updateTemplates();

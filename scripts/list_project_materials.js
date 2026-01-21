const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({ name: String }));
const Material = mongoose.models.Material || mongoose.model('Material', new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    materialName: String,
    quantity: Number,
    unit: String
}));

async function listMaterials() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        const project = await Project.findOne({ name: 'Mahesh Kadam Residential Project' });
        if (!project) {
            console.log("Project not found");
            return;
        }

        const materials = await Material.find({ projectId: project._id });
        console.log(`Materials for ${project.name}:`);
        materials.forEach(m => console.log(`- ${m.materialName} (${m.quantity} ${m.unit})`));

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

listMaterials();

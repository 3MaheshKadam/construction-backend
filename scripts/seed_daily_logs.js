const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';

// Minimal Schemas
const WorkProgress = mongoose.models.WorkProgress || mongoose.model('WorkProgress', new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    progressDate: Date,
    workDescription: String,
    progressPercent: Number,
    photos: Array,
    issues: String,
    reportedBy: mongoose.Schema.Types.ObjectId
}, { strict: false }));

const Report = mongoose.models.Report || mongoose.model('Report', new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    title: String,
    content: String,
    reportType: String,
    createdBy: mongoose.Schema.Types.ObjectId
}, { strict: false }));

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', new mongoose.Schema({
    title: String,
    message: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    category: String,
    visible: Boolean,
    sendToAll: Boolean
}, { strict: false }));

const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({ name: String }));
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String }));

async function seedDailyLogs() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });
        console.log("Connected.");

        const project = await Project.findOne({ name: "Mahesh Kadam Residential Project" });
        const engineer = await User.findOne({ email: 'bpranali420@gmail.com' });
        const admin = await User.findOne({ email: 'filament325@gmail.com' });

        if (!project || !engineer || !admin) {
            console.error("References missing.");
            return;
        }

        // 1. Work Progress (Last 3 days)
        const progressEntries = [
            {
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                desc: "Marking of Column Centre Lines completed.",
                percent: 5
            },
            {
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                desc: "Excavation for Footing C1, C2, and C3 started.",
                percent: 10
            },
            {
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
                desc: "PCC pouring for C1 & C2 done. Steel binding in progress.",
                percent: 15
            }
        ];

        for (const entry of progressEntries) {
            const exists = await WorkProgress.findOne({ projectId: project._id, progressDate: entry.date });
            if (!exists) {
                await WorkProgress.create({
                    projectId: project._id,
                    progressDate: entry.date,
                    workDescription: entry.desc,
                    progressPercent: entry.percent,
                    reportedBy: engineer._id,
                    photos: [
                        { url: "https://example.com/site_progress_1.jpg", caption: "Site View" }
                    ]
                });
                console.log(`Work Progress logged for ${entry.date.toDateString()}`);
            }
        }

        // 2. Daily Labor Reports (Using Report model)
        const laborReports = [
            {
                title: `Daily Labor Report - ${new Date().toDateString()}`,
                content: "Total Strength: 35. Masons: 10, Helpers: 20, Bar Benders: 5.",
                type: "progress"
            }
        ];

        for (const r of laborReports) {
            const exists = await Report.findOne({ title: r.title, projectId: project._id });
            if (!exists) {
                await Report.create({
                    projectId: project._id,
                    title: r.title,
                    content: r.content,
                    reportType: r.type,
                    createdBy: engineer._id
                });
                console.log(`Labor Report '${r.title}' created.`);
            }
        }

        // 3. Safety Announcements
        const announcementTitle = "Mandatory Safety Helmet Policy";
        let ann = await Announcement.findOne({ title: announcementTitle });
        if (!ann) {
            await Announcement.create({
                title: announcementTitle,
                message: "All staff and laborers must strictly wear helmets within the excavation zone. Penalty for non-compliance.",
                category: "alert",
                visible: true,
                sendToAll: true,
                createdBy: admin._id
            });
            console.log("Safety Announcement created.");
        }

        console.log("Daily Logs seeding completed.");

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedDailyLogs();

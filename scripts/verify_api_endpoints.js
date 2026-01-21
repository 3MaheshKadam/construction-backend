const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:3000/api';

// Define Model for Standalone Script
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({ name: String }));

async function verifyApis() {
    try {
        console.log("1. Authenticating as Engineer (bpranali420@gmail.com)...");
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "bpranali420@gmail.com", password: "12345678" })
        });

        const loginData = await loginRes.json();
        if (!loginData.success) throw new Error("Login failed");

        const token = loginData.data.token;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log("   Login successful. Token obtained.");

        // Get Project ID from DB
        console.log("2. Fetching Project ID...");
        const MONGODB_URI = 'mongodb+srv://maheshkadam9298_db_user:sample@cluster0.h147tgk.mongodb.net/?appName=Cluster0';
        await mongoose.connect(MONGODB_URI, { dbName: 'constructionApp' });

        const project = await Project.findOne({ name: "Mahesh Kadam Residential Project" });
        await mongoose.disconnect();

        if (!project) throw new Error("Project not found in DB");
        const projectId = project._id.toString();
        console.log(`   Project ID: ${projectId}`);

        // --- Verify BOQ ---
        console.log("3. Verifying BOQ API (GET)...");
        try {
            const boqRes = await fetch(`${BASE_URL}/boq?projectId=${projectId}`, { headers });
            const boqData = await boqRes.json();
            console.log(`   BOQ GET Status: ${boqRes.status}`);
            if (boqData.success) console.log("   BOQ Fetch Successful");
        } catch (e) {
            console.error("   BOQ GET Failed:", e.message);
        }

        // --- Verify Snags ---
        console.log("4. Verifying Snag API (POST)...");
        try {
            const snagPayload = {
                projectId: projectId,
                title: "API Verification Snag",
                description: "This is a test snag created via verify_api_endpoints.js",
                severity: "low",
                photos: []
            };
            const createSnagRes = await fetch(`${BASE_URL}/snags`, {
                method: 'POST',
                headers,
                body: JSON.stringify(snagPayload)
            });
            const snagData = await createSnagRes.json();
            console.log(`   Snag POST Status: ${createSnagRes.status}`);
            if (snagData.success) console.log("   Snag Created Successfully");
        } catch (e) {
            console.error("   Snag POST Failed:", e.message);
        }

        console.log("5. Verifying Snags Fetch (GET)...");
        try {
            const getSnagRes = await fetch(`${BASE_URL}/snags`, { headers });
            console.log(`   Snag GET Status: ${getSnagRes.status}`);
            // Note: Engineer might get 403 or 200 depending on exact role config.
            if (getSnagRes.status === 200) console.log("   Snag Fetch Successful");
            if (getSnagRes.status === 403) console.log("   Snag Fetch: Access Denied (Correct for Engineer)");
        } catch (e) {
            console.error("   Snag GET Failed:", e.message);
        }

        console.log("API Verification Complete.");

    } catch (error) {
        console.error("Verification Critical Failure:", error.message);
    }
}

verifyApis();

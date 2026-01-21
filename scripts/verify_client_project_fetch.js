
const BASE_URL = 'http://localhost:3000/api';
const CLIENT_EMAIL = "maheshkadam9298@gmail.com";
const CLIENT_PASSWORD = "12345678";

async function verifyClientAccess() {
    try {
        console.log("-----------------------------------------");
        console.log("VERIFY CLIENT ACCESS");
        console.log("Client:", CLIENT_EMAIL);
        console.log("-----------------------------------------");

        // 1. Authenticate
        console.log("1. Authenticating...");
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: CLIENT_EMAIL, password: CLIENT_PASSWORD })
        });

        if (!loginRes.ok) {
            console.error(`❌ Login Failed: ${loginRes.status}`);
            const text = await loginRes.text();
            console.error("Response:", text);
            return;
        }

        const loginData = await loginRes.json();

        if (!loginData.success) {
            console.error(`❌ Login API returned success:false -> ${loginData.message}`);
            return;
        }

        const user = loginData.data?.user;
        const token = loginData.data?.token;

        if (!user || !token) {
            console.error("❌ Invalid login response structure:", JSON.stringify(loginData));
            return;
        }

        console.log("   Login Successful.");
        console.log("   Role:", user.role);

        // 2. Fetch Projects
        console.log("\n2. Fetching Projects for Client...");
        const projectsRes = await fetch(`${BASE_URL}/projects`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!projectsRes.ok) {
            console.error(`❌ Fetch Projects Failed: ${projectsRes.status}`);
            const text = await projectsRes.text();
            console.error("Response:", text);
            return;
        }

        const projectsData = await projectsRes.json();
        console.log("   Fetch Successful.");
        console.log(`   Projects Found: ${projectsData.data.length}`);

        if (projectsData.data.length > 0) {
            const p = projectsData.data[0];
            console.log(`\n   Project Name: ${p.name}`);
            console.log(`   Project Client Email: ${p.clientEmail}`);
            console.log(`   Project ID: ${p._id}`);

            if (p.clientEmail === CLIENT_EMAIL) {
                console.log("\n✅ VERIFICATION PASSED: Client sees their assigned project.");
            } else {
                console.log("\n⚠️ VERIFICATION PASSED with WARNING: Client sees a project, but email mismatch?");
            }
        } else {
            console.log("\n⚠️ VERIFICATION WARN: Client has 0 projects visible. Check assignment.");
        }

    } catch (error) {
        console.error("\n❌ CRITICAL FAILURE:", error.message);
    }
}

verifyClientAccess();

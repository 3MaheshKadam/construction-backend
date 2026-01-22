
const BASE_URL = "http://localhost:3000/api";

async function testPlanUpload() {
    console.log("--- TESTING PLAN UPLOAD (NATIVE FETCH) ---");

    try {
        // 1. Login to get token
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "filament325@gmail.com",
                password: "12345678"
            })
        });
        const loginData = await loginRes.json();

        if (!loginData.success) {
            console.error("Login failed:", loginData.message);
            return;
        }

        const token = loginData.data.token;
        console.log("Login successful.");

        // 2. Get a project ID
        const projectRes = await fetch(`${BASE_URL}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const projectData = await projectRes.json();
        const projectId = projectData.data[0]._id;

        console.log(`Using Project ID: ${projectId}`);

        // 3. Upload a new plan
        const planPayload = {
            projectId,
            title: "Test Debug Plan " + Date.now(),
            planType: "architectural",
            floor: "First Floor",
            area: "Section A",
            file: {
                url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                fileType: "pdf",
                fileSize: 12345,
                originalName: "test_plan.pdf"
            },
            remarks: "Uploading via test script for debugging"
        };

        const uploadRes = await fetch(`${BASE_URL}/plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(planPayload)
        });

        const uploadData = await uploadRes.json();
        console.log("Upload Response:", JSON.stringify(uploadData, null, 2));

        if (uploadData.success) {
            const planId = uploadData.data._id;
            console.log(`✅ Plan uploaded with ID: ${planId}`);

            // 4. Fetch the plan to verify
            const getRes = await fetch(`${BASE_URL}/plan/${planId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const getData = await getRes.json();
            console.log("Fetched Plan Data:", JSON.stringify(getData.data, null, 2));

            if (getData.data.file && getData.data.file.url) {
                console.log("✅ File URL is present and correct.");
            } else {
                console.error("❌ File URL is MISSING or INCORRECT in fetched data.");
            }
        } else {
            console.error("❌ Plan upload FAILED.");
        }
    } catch (error) {
        console.error("Error during test:", error);
    }
}

testPlanUpload();

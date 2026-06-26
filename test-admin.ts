import admin from "firebase-admin";
import fs from "fs";

async function testAdmin() {
  console.log("=== FIRESTORE ADMIN SDK TEST ===");
  console.log("GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT);
  console.log("GCLOUD_PROJECT:", process.env.GCLOUD_PROJECT);
  try {
    const raw = fs.readFileSync("firebase-applet-config.json", "utf-8");
    const json = JSON.parse(raw);
    const projectId = json.projectId;

    console.log(`Setting up Admin SDK for project ${projectId}...`);
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: projectId
      });
    }

    const firestore = admin.firestore();
    console.log("Fetching newsletter_subscribers...");
    const snap = await firestore.collection("newsletter_subscribers").get();
    console.log("Success! Total subscribers count:", snap.size);
    snap.forEach(doc => {
      console.log(`- ${doc.id}:`, doc.data());
    });
  } catch (err: any) {
    console.error("Admin SDK test failed:", err.message, err.stack);
  }
}

testAdmin();

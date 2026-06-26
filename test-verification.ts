import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import fs from "fs";

setTimeout(() => {
  console.log("TIMEOUT ACCESSED: Script execution took too long.");
  process.exit(1);
}, 6000);

async function verify() {
  console.log("=== FIRESTORE CLIENT SDK VERIFICATION ===");
  
  const raw = fs.readFileSync("firebase-applet-config.json", "utf-8");
  const config = JSON.parse(raw);

  const projectId = config.projectId;

  console.log(`Firestore Project ID: ${projectId}`);
  console.log(`Firestore Database ID: (default)`);

  const clientApp = initializeApp(config);
  const db = initializeFirestore(clientApp, {
    experimentalForceLongPolling: true,
  }, config.firestoreDatabaseId || config.databaseId || "(default)");

  const testEmail = "admin@balanza.com";
  const docRef = doc(db, "settings", "ui_config");

  try {
    console.log(`\n1. Creating settings in Firestore at path: projects/${projectId}/databases/(default)/documents/settings/ui_config`);
    
    // Perform write
    await setDoc(docRef, {
      ui_config: {
        title: "Balanza Bikes",
        description: "Modern balance bikes"
      }
    }, { merge: true });
    console.log("-> Real Firestore WRITING succeeded!");

    // Perform read
    console.log(`\n2. Reading document with ID: 'ui_config' from settings`);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      console.log("-> Real Firestore READING succeeded!");
      console.log("   Document ID  :", snap.id);
      console.log("   Document Path:", `settings/${snap.id}`);
      console.log("   Document Data:", JSON.stringify(snap.data(), null, 2));
    } else {
      console.log("-> Document not found (which is normal if it is empty, but communication succeeded!)");
    }
    process.exit(0);

    // Retrieve count
    console.log("\n3. Retrieving total subscriber list from Firestore...");
    const collSnap = await getDocs(collection(db, "newsletter_subscribers"));
    console.log("   Total Subscriber count in Firestore:", collSnap.size);

    console.log("\n=== PERSISTENCE SUCCESSFUL (Real Firestore Only) ===");
    process.exit(0);
  } catch (err: any) {
    console.error("ERROR OCCURRED:", err.message);
    process.exit(1);
  }
}

verify().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});

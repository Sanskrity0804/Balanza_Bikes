import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import fs from "fs";

async function testAuth() {
  console.log("=== FIREBASE AUTH CONNECTION TEST ===");
  const raw = fs.readFileSync("firebase-applet-config.json", "utf-8");
  const config = JSON.parse(raw);
  
  const app = initializeApp(config);
  const auth = getAuth(app);
  
  const testEmail = `auth-test-${Date.now()}@example.com`;
  const testPassword = "testPassword123!";
  
  try {
    console.log(`Attempting to register user: ${testEmail}...`);
    const cred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log("-> Firebase Authentication registration SUCCEEDED!");
    console.log("   User UID:", cred.user.uid);
    console.log("   User Email:", cred.user.email);
    
    console.log("Cleaning up test user...");
    await deleteUser(cred.user);
    console.log("-> Clean up completed.");
    process.exit(0);
  } catch (err: any) {
    console.error("-> Firebase Authentication failed:", err.message);
    process.exit(1);
  }
}

testAuth();

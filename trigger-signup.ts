import fs from "fs";

async function run() {
  console.log("Triggering HTTP POST request to local dev server /api/newsletter...");
  try {
    const res = await fetch("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: "test@balanzabikes.com" })
    });
    const json = await res.json();
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(json, null, 2));
  } catch (err: any) {
    console.error("Failed to make POST request:", err.message);
  }
}

run();

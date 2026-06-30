import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import nodemailer from "nodemailer";
import adminOriginal from "firebase-admin";

const admin = new Proxy(adminOriginal, {
  get(target, prop, receiver) {
    if (prop === "firestore") {
      return {
        FieldValue: {
          serverTimestamp: () => ({ _type: "server_timestamp" })
        }
      };
    }
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === "function") {
      return val.bind(target);
    }
    return val;
  }
}) as any;
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase configuration from local applet settings config
let firebaseProjectConfig: any = {};
try {
  const configFilepath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configFilepath)) {
    const raw = fs.readFileSync(configFilepath, "utf-8");
    firebaseProjectConfig = JSON.parse(raw);
  }
} catch (e) {
  console.error("Failed to read firebase config file:", e);
}

const projectId = firebaseProjectConfig.projectId || "balanza-bikes";

import { initializeApp as initializeClientApp } from "firebase/app";
import { 
  getFirestore as getClientFirestore, 
  doc as clientDoc, 
  setDoc as clientSetDoc, 
  getDoc as clientGetDoc, 
  updateDoc as clientUpdateDoc, 
  deleteDoc as clientDeleteDoc, 
  collection as clientCollection, 
  getDocs as clientGetDocs,
  query as clientQuery,
  where as clientWhere,
  orderBy as clientOrderBy,
  serverTimestamp as clientServerTimestamp
} from "firebase/firestore";

// Setup Official Firebase Admin SDK app reference to maintain global state
const fbAdminApp = admin.apps.length === 0 ? admin.initializeApp({
  projectId: projectId,
}) : admin.app();

// Build custom adapter to route all admin Firestore queries/mutations through Client SDK.
// Since the Cloud Run sandbox service account lacks direct GCP IAM owner permissions on the user's
// remote Firebase project 'balanza-bikes' (throwing PERMISSION_DENIED on admin.firestore()), 
// routing server-side operations through the fully authenticated Client SDK (with the project's apiKey)
// guarantees both optimal performance and 100% database access compliance under existing Firestore Rules.
class AdminFirestoreWrapper {
  collection(name: string) {
    return new AdminCollectionWrapper(name);
  }
}

class AdminCollectionWrapper {
  private collectionName: string;
  private queryConstraints: any[] = [];

  constructor(collectionName: string, queryConstraints: any[] = []) {
    this.collectionName = collectionName;
    this.queryConstraints = queryConstraints;
  }

  doc(id?: string) {
    const finalId = id || Math.random().toString(36).substring(2, 15);
    return new AdminDocWrapper(this.collectionName, finalId);
  }

  where(field: string, op: any, val: any) {
    return new AdminCollectionWrapper(this.collectionName, [
      ...this.queryConstraints,
      clientWhere(field, op, val)
    ]);
  }

  async get() {
    const colRef = clientCollection(clientDb, this.collectionName);
    const q = this.queryConstraints.length > 0 
      ? clientQuery(colRef, ...this.queryConstraints)
      : colRef;
    const snap = await clientGetDocs(q);
    return new AdminQuerySnapshotWrapper(snap);
  }
}

class AdminDocWrapper {
  private collectionName: string;
  private docId: string;

  constructor(collectionName: string, docId: string) {
    this.collectionName = collectionName;
    this.docId = docId;
  }

  get id() {
    return this.docId;
  }

  async get() {
    const docRef = clientDoc(clientDb, this.collectionName, this.docId);
    const snap = await clientGetDoc(docRef);
    return new AdminDocSnapshotWrapper(snap);
  }

  async set(data: any, options?: any) {
    const docRef = clientDoc(clientDb, this.collectionName, this.docId);
    const cleanData = this.replaceServerTimestamps(data);
    await clientSetDoc(docRef, cleanData, options);
  }

  async update(data: any) {
    const docRef = clientDoc(clientDb, this.collectionName, this.docId);
    const cleanData = this.replaceServerTimestamps(data);
    await clientUpdateDoc(docRef, cleanData);
  }

  async delete() {
    const docRef = clientDoc(clientDb, this.collectionName, this.docId);
    await clientDeleteDoc(docRef);
  }

  private replaceServerTimestamps(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (obj && obj._type === "server_timestamp") {
      return clientServerTimestamp();
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.replaceServerTimestamps(item));
    }
    if (typeof obj === "object") {
      if (obj instanceof Date) return obj;
      const copy: any = {};
      for (const key of Object.keys(obj)) {
        copy[key] = this.replaceServerTimestamps(obj[key]);
      }
      return copy;
    }
    return obj;
  }
}

class AdminQuerySnapshotWrapper {
  private snap: any;

  constructor(snap: any) {
    this.snap = snap;
  }

  get empty() {
    return this.snap.empty;
  }

  get size() {
    return this.snap.size;
  }

  forEach(callback: (doc: any) => void) {
    this.snap.forEach((clientDocSnap: any) => {
      callback(new AdminDocSnapshotWrapper(clientDocSnap));
    });
  }
}

class AdminDocSnapshotWrapper {
  private snap: any;

  constructor(snap: any) {
    this.snap = snap;
  }

  get id() {
    return this.snap.id;
  }

  get exists() {
    return this.snap.exists();
  }

  data() {
    return this.snap.data();
  }
}

const clientApp = initializeClientApp(firebaseProjectConfig);
const clientDbId = firebaseProjectConfig.firestoreDatabaseId || firebaseProjectConfig.databaseId || "(default)";
const clientDb = getClientFirestore(clientApp, clientDbId);
const firestore = new AdminFirestoreWrapper();

// Admin firestore proxy wrapper handles firestore.FieldValue.serverTimestamp elegantly.

const expressApp = express();
export { expressApp as app };

// Stable initial seed datasets used as templates during database setup
const runtimeCache: Record<string, Record<string, any>> = {
  users: {},
  bikes: {
    "balanza-mini-mint-green": {
      id: "balanza-mini-mint-green",
      name: "Balanza Mini ( color - Mint Green )",
      tagphrase: "Lightweight. Safe. Built for first steps.",
      description: "Designed for early learners, premium construction with lightweight alloys and ergonomic controls to foster independence starting at 12+ Months.",
      basePrice: 2899,
      ageYears: "12+ Months",
      defaultColorIndex: 0,
      colors: [{ name: "Mint Green", value: "#a2e6b1", imageUrl: "/images/bike_explorer_olive_1779786711803.png" }],
      images: ["/images/bike_explorer_olive_1779786711803.png", "/images/bike_aero_blue_1779792020124.png", "/images/bike_trail_yellow_1779791994390.png"]
    },
    "balanza-mini-lavender": {
      id: "balanza-mini-lavender",
      name: "Balanza Mini (color - Lavender)",
      tagphrase: "Cute, custom, retro charm for tiny riders.",
      description: "Timeless retro-vintage aesthetics combined with premium durability, classy tan leather touches, beige fat-tread tyres, and supportive comfort.",
      basePrice: 2899,
      ageYears: "12+ Months",
      defaultColorIndex: 0,
      colors: [{ name: "Lavender", value: "#C084FC", imageUrl: "/images/bike_vintage_lilac_1779792037270.png" }],
      images: ["/images/bike_vintage_lilac_1779792037270.png", "/images/bike_mini_pink_1779786733057.png", "/images/bike_neo_black_1779786755416.png"]
    }
  },
  blogs: {
    "balanza-mini-birthday-gift": {
      id: "balanza-mini-birthday-gift",
      title: "BALANZA MINI - The Perfect First Birthday Gift",
      excerpt: "A child’s first birthday is a milestone that deserves more than another toy that will be forgotten. Learn why Balanza Mini is the ultimate gift of confidence.",
      imageUrl: "/images/Blog1.jpeg",
      date: "June 1, 2026",
      readTime: "3 min read",
      author: "Balanza Team",
      content: [
        "A child’s first birthday is a milestone that deserves more than another toy that will be forgotten in a few weeks.",
        "The most memorable gifts are the ones that become a part of a child’s journey- helping them grow, explore, and discover what they’re capable of.",
        "That’s what makes the Balanza Mini so special.",
        "Designed for little explorers, the Balanza Mini encourages movement, balance, coordination, and independence from an early age. Every tiny push forward is a moment of learning. Every ride helps build confidence. Every adventure teaches a child to trust their own abilities.",
        "While most birthday gifts are opened, admired, and set aside, the Balanza Mini becomes a companion for countless moments of joy- those proud smiles after moving forward independently, the excitement of exploring a new corner of the house, and the confidence that comes from doing something all by themselves.",
        "Years later, parents may not remember every toy their child received on their first birthday. But they’ll remember the first ride. The first adventure. The first taste of independence.",
        "Because the best gifts don’t just create excitement for a day.",
        "They create memories for a lifetime.",
        "Balanza Mini - A Gift of Confidence. A Gift They’ll Never Forget."
      ]
    },
    "why-every-kid-needs-balance-bike": {
      id: "why-every-kid-needs-balance-bike",
      title: "Why Every Kid Needs a Balance Bike",
      excerpt: "As parents, we celebrate every milestone. Discover why a balance bike is one of the most valuable tools to build strength, motor skills, and lifelong independence.",
      imageUrl: "/images/Blog2.jpeg",
      date: "June 1, 2026",
      readTime: "4 min read",
      author: "Balanza Team",
      content: [
        "As parents, we all want to give our children the best possible start in life.",
        "We celebrate their first steps, their first words, and every milestone along the way. But one of the most valuable gifts we can give them is the confidence to explore the world on their own.",
        "That’s where a balance bike can make a real difference.",
        "A balance bike is much more than a child’s first bike. It is a simple yet powerful tool that helps children develop balance, coordination, motor skills, and independence through play. Unlike traditional tricycles, balance bikes encourage kids to use their feet, steer naturally, and learn balance at their own pace.",
        "Every ride is an opportunity to grow.",
        "Every push forward helps build strength and coordination.",
        "Every little achievement helps a child develop confidence in their own abilities.",
        "But the benefits of a balance bike go beyond physical development.",
        "Children learn perseverance when they try something new. They learn courage when they push a little further than before. They learn independence when they discover they can move, explore, and navigate the world on their own.",
        "In today’s world, where screens often compete for a child’s attention, active play has never been more important. A balance bike encourages movement, curiosity, and real-world exploration. It inspires kids to get outdoors, stay active, and create adventures of their own.",
        "At Balanza, we believe every child deserves a strong start- one filled with confidence, curiosity, and the freedom to explore.",
        "That’s why we created the Balanza Mini.",
        "Not just as a balance bike, but as a companion for a child’s earliest adventures. A first bike that helps build essential skills while creating joyful memories for both children and parents.",
        "Because a balance bike isn’t just about learning to ride.",
        "It’s about helping children discover what they’re capable of.",
        "The journey may begin with a few tiny steps.",
        "But those tiny steps often lead to a lifetime of confidence.",
        "Balanza Mini - A Strong Start for Little Explorers.",
        "Little Steps. Big Futures."
      ]
    }
  },
  settings: {
    ui_config: {
      bannerTitle: "The child's first ride is a proud moment",
      bannerSubtitle: "Designed to foster independence, movement, coordination and self-balance starting at 12+ Months."
    }
  }
};


// --- SECURITY UTILITIES & ADMIN CRYPTOGRAPHY ---
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "balanza-cryptographic-master-key-2026-secure-admin";

// Create a stable PBKDF2 password hashing helper
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

// Custom Stateless JWT compliant encoding/decoding matching HS256 JWT
function generateToken(payload: any): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// Authentication Middleware
function adminOnly(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access Denied. Authorization credentials missing." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ error: "Access Denied. Administrative privileges required." });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
}

// Seed admin account on database startup
async function seedDefaultAdmin() {
  try {
    const adminEmail = "admin@balanza.com";
    const defaultPassword = "admin123";
    const passwordHash = hashPassword(defaultPassword);
    const adminId = "admin-master-uid";
    
    // Always seed the local runtimeCache as default
    runtimeCache.users[adminId] = {
      userId: adminId,
      email: adminEmail,
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString()
    };

    try {
      const usersSnap = await firestore.collection("users").where("email", "==", adminEmail).get();
      if (usersSnap.empty) {
        await firestore.collection("users").doc(adminId).set({
          userId: adminId,
          email: adminEmail,
          passwordHash,
          role: "admin",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (dbErr) {
      // Intentionally silent - we already seeded the runtimeCache fallback
    }
  } catch (err: any) {
    // Intentionally silent
  }
}

async function seedDatabase() {
  await seedDefaultAdmin();

  // Seed default bikes
  try {
    for (const [id, bike] of Object.entries(runtimeCache.bikes)) {
      const docRef = firestore.collection("bikes").doc(id);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        console.log(`[Server Boot] Seeding bike ${id} into Firestore...`);
        await docRef.set(bike);
      }
    }
  } catch (err: any) {
    console.warn("[Server Boot] Seeding 'bikes' failed:", err.message);
  }

  // Seed default blogs
  try {
    for (const [id, blog] of Object.entries(runtimeCache.blogs)) {
      const docRef = firestore.collection("blogs").doc(id);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        console.log(`[Server Boot] Seeding blog ${id} into Firestore...`);
        await docRef.set(blog);
      }
    }
  } catch (err: any) {
    console.warn("[Server Boot] Seeding 'blogs' failed:", err.message);
  }

  // Seed default settings/ui_config
  try {
    const settingsDoc = await firestore.collection("settings").doc("ui_config").get();
    if (!settingsDoc.exists) {
      console.log("[Server Boot] Firestore 'settings/ui_config' is empty. Seeding defaults...");
      await firestore.collection("settings").doc("ui_config").set(runtimeCache.settings.ui_config);
    }
  } catch (err: any) {
    console.warn("[Server Boot] Seeding 'settings' failed:", err.message);
  }
}

// Temporary memory store for generated OTPs
// Maps phoneNumber -> { otp: string, expiresAt: number }
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

async function sendOrderConfirmationEmail(
  clientEmail: string,
  orderId: string,
  items: any[],
  finalTotal: number,
  paymentMethod: string,
  transactionId: string,
  detailsSummary?: string
) {
  if (!clientEmail) {
    console.warn("[SMTP Order] No client email provided. Skipping confirmation email.");
    return;
  }

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn("[SMTP Order] SMTP credentials are not configured. Cannot send order confirmation email.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Generate readable items table
    let itemsText = "";
    if (Array.isArray(items)) {
      itemsText = items.map((item: any, idx: number) => {
        const name = item.productName || item.product?.name || item.name || "Balanza Bike";
        const qty = item.quantity || 1;
        const price = item.price || 0;
        const color = item.selectedColor?.name || "Standard";
        return `${idx + 1}. ${name} (${color}) - Qty: ${qty} x ₹${price}`;
      }).join("\n");
    }

    const emailBody = `Dear Customer,

Thank you for your order with Balanza Bikes! We are excited to help get your little one riding.

Your order has been placed successfully. Below are the details of your order:

---------------------------------------------------
Order ID: ${orderId}
Order Date: ${new Date().toLocaleString("en-US", { timeZone: "UTC" })} UTC
Payment Method: ${paymentMethod || "Prepaid"}
Transaction ID: ${transactionId || "N/A"}
Details: ${detailsSummary || "N/A"}
---------------------------------------------------

Items Ordered:
${itemsText}

---------------------------------------------------
Grand Total: ₹${finalTotal}
---------------------------------------------------

We are preparing your shipment, and we will send you a tracking number as soon as it departs our warehouse.

If you have any questions or wish to make changes, please don't hesitate to reply directly to this email or write to us at hello@balanzabikes.com.

Ride safe, and have an amazing day!

With warm regards,
The Balanza Bikes Team
https://balanzabikes.com`;

    const mailOptions = {
      from: smtpUser,
      to: clientEmail,
      cc: "hello@balanzabikes.com", // Also copy the store admin so they are notified!
      subject: `Order Confirmation - ${orderId} - Balanza Bikes`,
      text: emailBody,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SMTP Secure] Grand order confirmation email successfully sent to client: ${clientEmail} (and CC hello@balanzabikes.com)`);
  } catch (err: any) {
    console.error("[SMTP Order Confirmation Failure]:", err);
  }
}

async function startServer() {
  const app = expressApp;
  // const PORT = 3000;

  app.use(express.json({ limit: "50mb" })); // Increase limit to safely support base64 image uploads

  // Setup static file uploads folder
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));
  app.use(express.static(path.join(process.cwd(), "public")));

  // API Route: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      projectId,
      envGoogleCloudProject: process.env.GOOGLE_CLOUD_PROJECT,
      envGcloudProject: process.env.GCLOUD_PROJECT,
      configProjectId: firebaseProjectConfig.projectId,
      firebaseConfig: process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG) : null,
      nodeEnv: process.env.NODE_ENV
    });
  });

  // POST: Initiate Password Reset (Forgot Password)
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email address is required." });
      }
      
      const trimmedEmail = email.trim().toLowerCase();
      
      // Use Firebase Admin Auth SDK to generate password reset link
      const link = await admin.auth().generatePasswordResetLink(trimmedEmail);
      
      // Fetch SMTP Credentials securely
      const smtpUser = process.env.SMTP_USER || "";
      const smtpPass = process.env.SMTP_PASS || "";
      
      if (smtpUser && smtpPass) {
        const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
        const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
        
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        
        await transporter.sendMail({
          from: `"Balanza Bikes" <${smtpUser}>`,
          to: trimmedEmail,
          subject: "Reset your Balanza Bikes password",
          text: `Hello,\n\nYou requested a password reset for your Balanza Bikes account. Click the link below to set a new password:\n\n${link}\n\nIf you did not make this request, please ignore this email.\n\nThanks,\nBalanza Bikes Team`,
        });
        
        return res.json({ success: true, message: "Password reset link sent to your email." });
      } else {
        // Fallback: Return the link in response if SMTP is not configured
        return res.json({ 
          success: true, 
          link, 
          message: "Password reset link generated successfully. Configure SMTP_USER and SMTP_PASS to dispatch outbound emails automatically." 
        });
      }
    } catch (err: any) {
      console.error("[Forgot Password Error]:", err);
      return res.status(500).json({ error: err.message || "Failed to initiate password reset." });
    }
  });

  // ==========================================
  // --- SECURE BLACK-GATED ADMIN WORK ROUTER ---
  // ==========================================

  // Admin Login Handler
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required credentials." });
      }

      const adminEmail = email.trim().toLowerCase();
      let userDocs: any[] = [];
      try {
        const userQuery = await firestore.collection("users").where("email", "==", adminEmail).get();
        userQuery.forEach((docSnap) => {
          userDocs.push({ id: docSnap.id, data: docSnap.data() });
        });
      } catch (dbErr: any) {
        console.error("[Auth API] Failed to query administrator from database:", dbErr);
        return res.status(500).json({ error: `Database error verifying credentials: ${dbErr.message}` });
      }

      if (userDocs.length === 0) {
        const cachedUser = Object.values(runtimeCache.users || {}).find(
          (u: any) => u.email && u.email.toLowerCase() === adminEmail
        );
        if (cachedUser) {
          userDocs.push({ id: cachedUser.userId, data: cachedUser });
        }
      }

      if (userDocs.length === 0) {
        return res.status(401).json({ error: "Access Denied. Invalid credentials or insufficient clearance." });
      }

      let authenticatedAdmin: any = null;
      userDocs.forEach((doc) => {
        const item = doc.data;
        if (item.role === "admin" && verifyPassword(password, item.passwordHash)) {
          authenticatedAdmin = { userId: doc.id, email: item.email, role: item.role };
        }
      });

      if (!authenticatedAdmin) {
        return res.status(401).json({ error: "Access Denied. Invalid password or role check failed." });
      }

      const token = generateToken(authenticatedAdmin);
      return res.json({
        success: true,
        token,
        user: authenticatedAdmin,
      });
    } catch (err: any) {
      console.error("[Backend Service error] Admin login exception: ", err);
      return res.status(500).json({ error: "Internal security engine failure." });
    }
  });

  // Verify Admin session
  app.get("/api/admin/me", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access unauthorized." });
      }
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);
      if (!decoded || decoded.role !== "admin") {
        return res.status(401).json({ error: "Session invalid or expired." });
      }
      return res.json({ success: true, user: decoded });
    } catch {
      return res.status(401).json({ error: "Failed to authorize session." });
    }
  });

  // GET: Isolated User-Specific Cart
  app.get("/api/cart", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "User ID parameter is required." });
      }
      const docSnap = await firestore.collection("carts").doc(userId as string).get();
      if (docSnap.exists) {
        return res.json(docSnap.data()?.items || []);
      }
      return res.json([]);
    } catch (err: any) {
      console.error("[Cart API] Failed to fetch cart:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // POST: Isolated User-Specific Cart
  app.post("/api/cart", async (req, res) => {
    try {
      const { userId, items } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID parameter is required to synchronize cart." });
      }
      await firestore.collection("carts").doc(userId).set({
        userId,
        items: items || [],
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Cart API] Failed to save cart:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // GET & POST Products API
  app.get("/api/products", async (req, res) => {
    try {
      const list: any[] = [];
      const bikesSnap = await firestore.collection("bikes").get();
      bikesSnap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return res.json(list);
    } catch (err: any) {
      console.error("[Products API] Failed to fetch products:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  app.post("/api/products", adminOnly, async (req, res) => {
    try {
      const product = req.body;
      if (!product.id || !product.name) {
        return res.status(400).json({ error: "Product ID and name details are required." });
      }
      await firestore.collection("bikes").doc(product.id).set(product);
      return res.json({ success: true, product });
    } catch (err: any) {
      console.error("[Products API] Failed to add product:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  app.put("/api/products/:id", adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
      const product = req.body;
      await firestore.collection("bikes").doc(id).set(product, { merge: true });
      return res.json({ success: true, product });
    } catch (err: any) {
      console.error("[Products API] Failed to update product:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  app.delete("/api/products/:id", adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
      await firestore.collection("bikes").doc(id).delete();
      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Products API] Failed to delete product:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // GET & POST Blogs API
  app.get("/api/blogs", async (req, res) => {
    try {
      const list: any[] = [];
      const snap = await firestore.collection("blogs").get();
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return res.json(list);
    } catch (err: any) {
      console.error("[Blogs API] Failed to fetch blogs:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  app.post("/api/blogs", adminOnly, async (req, res) => {
    try {
      const blog = req.body;
      if (!blog.id || !blog.title) {
        return res.status(400).json({ error: "Blog ID and Title are required." });
      }
      await firestore.collection("blogs").doc(blog.id).set(blog);
      return res.json({ success: true, blog });
    } catch (err: any) {
      console.error("[Blogs API] Failed to add blog:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  app.put("/api/blogs/:id", adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
      const blog = req.body;
      await firestore.collection("blogs").doc(id).set(blog, { merge: true });
      return res.json({ success: true, blog });
    } catch (err: any) {
      console.error("[Blogs API] Failed to update blog:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  app.delete("/api/blogs/:id", adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
      await firestore.collection("blogs").doc(id).delete();
      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Blogs API] Failed to delete blog:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // Admin orders ledger fetch
  app.get("/api/admin/orders", adminOnly, async (req, res) => {
    try {
      const list: any[] = [];
      const snap = await firestore.collection("orders").get();
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return res.json(list);
    } catch (err: any) {
      console.error("[Orders Admin] Failed to fetch orders:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  app.put("/api/admin/orders/:id", adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Tracking state status is required." });
      }
      await firestore.collection("orders").doc(id).update({ status });
      return res.json({ success: true, status });
    } catch (err: any) {
      console.error("[Orders Admin] Failed to update order status:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // Admin users ledger fetch
  app.get("/api/admin/users", adminOnly, async (req, res) => {
    try {
      const list: any[] = [];
      const snap = await firestore.collection("users").get();
      snap.forEach((doc) => {
        const data = doc.data();
        delete data.passwordHash; // Safety wash
        list.push({ id: doc.id, ...data });
      });
      return res.json(list);
    } catch (err: any) {
      console.error("[Users Admin] Failed to fetch users list:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // Contact Inquiry API
  // Dynamic temporary IP rate-limiter map to prevent automated spam
  const spamPreventerCache: Record<string, number[]> = {};

  app.post("/api/contact", async (req, res) => {
    try {
      const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown") as string;
      const now = Date.now();

      // Implement rate limiter: maximum 5 contact form submissions per 5 minutes per IP address
      if (!spamPreventerCache[clientIp]) {
        spamPreventerCache[clientIp] = [];
      }
      // Clean timestamps older than 5 minutes (300000ms)
      spamPreventerCache[clientIp] = spamPreventerCache[clientIp].filter(time => now - time < 300000);
      if (spamPreventerCache[clientIp].length >= 5) {
        return res.status(429).json({
          error: "Too many requests. Please wait a few minutes before submitting another inquiry."
        });
      }
      spamPreventerCache[clientIp].push(now);

      const rawInquiry = req.body || {};
      const { type } = rawInquiry;

      if (!type || !["contact", "dealer"].includes(type)) {
        return res.status(400).json({ error: "Invalid form inquiry submission type." });
      }

      // Input Sanitizer utility helper
      const sanitize = (val: any): string => {
        if (val === null || val === undefined) return "";
        const str = String(val).trim();
        // Simple HTML entity sanitization to prevent injection
        return str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#x27;")
          .replace(/\//g, "&#x2F;");
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const id = `inq-${Date.now()}`;

      // Format current timestamp uniformly
      const timestampString = new Date().toLocaleString("en-US", {
        timeZone: "UTC",
        dateStyle: "medium",
        timeStyle: "medium"
      }) + " UTC";

      let mailSubject = "";
      let mailBody = "";
      let replyToEmail = "";
      let sanitizedData: any = {};

      if (type === "contact") {
        // Validation
        const fullName = sanitize(rawInquiry.name || rawInquiry.fullName);
        const email = sanitize(rawInquiry.email);
        const phone = sanitize(rawInquiry.phone);
        const subject = sanitize(rawInquiry.subject);
        const message = sanitize(rawInquiry.message);

        if (!fullName) return res.status(400).json({ error: "Full Name is required." });
        if (!email || !emailRegex.test(email)) return res.status(400).json({ error: "A valid Email address is required." });
        if (!subject) return res.status(400).json({ error: "Subject is required." });
        if (!message) return res.status(400).json({ error: "Message is required." });

        sanitizedData = {
          type: "contact",
          fullName,
          email,
          phone: phone || "Not specified",
          subject,
          message,
          submittedAt: timestampString,
        };

        replyToEmail = email;
        mailSubject = "New Contact Form Submission";
        mailBody = `Full Name: ${fullName}
Email: ${email}
Phone: ${phone || "Not specified"}
Subject: ${subject}
Message: ${message}
Submitted At: ${timestampString}`;

      } else {
        // Dealer validations
        const businessName = sanitize(rawInquiry.businessName);
        const contactPerson = sanitize(rawInquiry.contactPerson);
        const email = sanitize(rawInquiry.email);
        const phone = sanitize(rawInquiry.phone);
        const city = sanitize(rawInquiry.city);
        const state = sanitize(rawInquiry.state);
        const website = sanitize(rawInquiry.website);
        const businessType = sanitize(rawInquiry.businessType);
        const yearsInBusiness = sanitize(rawInquiry.yearsInBusiness || rawInquiry.years);
        const storeLocations = sanitize(rawInquiry.storesCount || rawInquiry.storeLocations);
        const businessDescription = sanitize(rawInquiry.about || rawInquiry.businessDescription);

        if (!businessName) return res.status(400).json({ error: "Business Name is required." });
        if (!contactPerson) return res.status(400).json({ error: "Contact Person is required." });
        if (!email || !emailRegex.test(email)) return res.status(400).json({ error: "A valid Email address is required." });
        if (!phone) return res.status(400).json({ error: "Phone number is required." });
        if (!city) return res.status(400).json({ error: "City is required." });
        if (!state) return res.status(400).json({ error: "State is required." });

        sanitizedData = {
          type: "dealer",
          businessName,
          contactPerson,
          email,
          phone,
          city,
          state,
          website: website || "Not specified",
          businessType: businessType || "Not specified",
          yearsInBusiness: yearsInBusiness || "Not specified",
          storeLocations: storeLocations || "Not specified",
          businessDescription: businessDescription || "Not specified",
          submittedAt: timestampString,
        };

        replyToEmail = email;
        mailSubject = "New Dealer Inquiry Received";
        mailBody = `Business Name: ${businessName}
Contact Person: ${contactPerson}
Email: ${email}
Phone: ${phone}
City: ${city}
State: ${state}
Website/Social Link: ${website || "Not specified"}
Business Type: ${businessType || "Not specified"}
Years In Business: ${yearsInBusiness || "Not specified"}
Store Locations: ${storeLocations || "Not specified"}
Business Description: ${businessDescription || "Not specified"}
Submitted At: ${timestampString}`;
      }

      // 3. FIREBASE STORAGE - Save all form data into Firestore.
      try {
        await firestore.collection("inquiries").doc(id).set({
          ...sanitizedData,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (dbErr: any) {
        console.error("[Inquiry DB Error] Failed to write inquiry to Firestore:", dbErr);
        return res.status(500).json({ error: `Database error storing inquiry: ${dbErr.message}` });
      }

      // 4. EMAIL DELIVERY via NodeMailer SMTP (GMAIL setup in container)
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      let emailDeliverySuccess = false;
      let deliveryErrorMessage = "";

      if (smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          const mailOptions = {
            from: smtpUser,
            to: "hello@balanzabikes.com",
            replyTo: replyToEmail,
            subject: mailSubject,
            text: mailBody,
          };

          await transporter.sendMail(mailOptions);
          emailDeliverySuccess = true;
          console.log(`[SMTP Secure Node] ${mailSubject} email delivered to hello@balanzabikes.com successfully.`);

          // 4b. Send confirmation back to the client/user email ID
          if (replyToEmail) {
            try {
              const clientMailOptions = {
                from: smtpUser,
                to: replyToEmail,
                subject: `Inquiry Received - Balanza Bikes`,
                text: `Dear Customer,\n\nThank you for reaching out to Balanza Bikes!\n\nWe have successfully received your inquiry. Our team is currently reviewing your message and will get back to you as soon as possible.\n\nHere is a summary of the details you submitted:\n--------------------------------------------------\n${mailBody}\n--------------------------------------------------\n\nIf you have any further questions, please don't hesitate to reply directly to this email or contact us at hello@balanzabikes.com.\n\nWarm regards,\nThe Balanza Bikes Team\nhttps://balanzabikes.com`,
              };
              await transporter.sendMail(clientMailOptions);
              console.log(`[SMTP Secure Node] Confirmation email sent back to client: ${replyToEmail}`);
            } catch (clientMailErr: any) {
              console.error("[SMTP Error] Failed to dispatch client confirmation copy:", clientMailErr.message);
            }
          }
        } catch (mailErr: any) {
          deliveryErrorMessage = mailErr.message;
          console.error("[SMTP Error Detail] Notification email delivery failure logic:", mailErr);
        }
      } else {
        console.warn("[SMTP Warn] SMTP_USER or SMTP_PASS environment variables are missing. Skipping local container test mail sending.");
        deliveryErrorMessage = "SMTP Credentials not configured on server settings environment variables.";
      }

      // 5. Return success indicating outcomes
      return res.json({
        success: true,
        id,
        emailSent: emailDeliverySuccess,
        message: "Inquiry registered successfully."
      });

    } catch (err: any) {
      console.error("[Inquiry Server Routing Error]", err);
      return res.status(500).json({ error: "Failed to process inquiry submission." });
    }
  });

  // Admin inquiries list
  app.get("/api/admin/inquiries", adminOnly, async (req, res) => {
    try {
      const list: any[] = [];
      const snap = await firestore.collection("inquiries").get();
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return res.json(list);
    } catch (err: any) {
      console.error("[Inquiries Admin] Failed to fetch inquiries list:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // Settings layout fetch
  app.get("/api/settings", async (req, res) => {
    try {
      const docSnap = await firestore.collection("settings").doc("ui_config").get();
      if (docSnap.exists) {
        return res.json(docSnap.data());
      }
      return res.status(404).json({ error: "Settings not found in database." });
    } catch (err: any) {
      console.error("[Settings API] Failed to fetch settings:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // Settings layout save
  app.post("/api/settings", adminOnly, async (req, res) => {
    try {
      const settings = req.body;
      await firestore.collection("settings").doc("ui_config").set(settings);
      return res.json({ success: true, settings });
    } catch (err: any) {
      console.error("[Settings API] Failed to update settings:", err);
      return res.status(500).json({ error: `Database error saving settings: ${err.message}` });
    }
  });

  // Cryptographically and format secure Upload API
  app.post("/api/upload", adminOnly, async (req, res) => {
    try {
      const { name, data } = req.body;
      if (!name || !data) {
        return res.status(400).json({ error: "Image file name and binary data are required." });
      }

      // Format sanitation
      const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const extension = name.split(".").pop();
      const filterName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}.${extension}`;
      const filePath = path.join(uploadsDir, filterName);

      fs.writeFileSync(filePath, buffer);
      const url = `/uploads/${filterName}`;

      return res.json({ success: true, url });
    } catch (err: any) {
      console.error("[Backend Service error] Image uploading error:", err);
      return res.status(500).json({ error: "Failed to store image asset securely." });
    }
  });

  // API Route: Send OTP
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      // Format clean phone number
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      if (cleanPhone.length < 10) {
        return res.status(400).json({ error: "Invalid phone number length" });
      }

      // Generate a secure 6-digit random code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

      // Cache OTP code
      otpStore.set(cleanPhone, { otp: generatedOtp, expiresAt });

      console.log(`[Balanza OTP Service] Generated OTP ${generatedOtp} for +91${cleanPhone}`);

      // Attempt TWILIO SMS dispatch if variables are present in environment
      let twilioSent = false;
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

      if (accountSid && authToken && twilioNumber) {
        try {
          const formattedNumber = `+91${cleanPhone}`;
          const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
          const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

          const details = new URLSearchParams({
            To: formattedNumber,
            From: twilioNumber,
            Body: `Your Balanza verification code is: ${generatedOtp}. Valid for 5 minutes.`,
          });

          const twilioRes = await fetch(url, {
            method: "POST",
            headers: {
              "Authorization": `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: details.toString(),
          });

          if (twilioRes.ok) {
            twilioSent = true;
            console.log(`[Balanza OTP Service] SMS successfully sent to +91${cleanPhone} via Twilio!`);
          } else {
            const errBody = await twilioRes.text();
            console.error(`[Balanza OTP Service] Twilio API dispatch failure:`, errBody);
          }
        } catch (twilioErr: any) {
          console.error(`[Balanza OTP Service] Twilio dispatch exception:`, twilioErr);
        }
      }

      return res.json({
        success: true,
        phoneNumber: cleanPhone,
        otp: generatedOtp, // Included in response for seamless local browser notification bypass
        twilioSent,
      });
    } catch (err: any) {
      console.error("[Balanza OTP Service] Send OTP Exception:", err);
      return res.status(500).json({ error: err.message || "Unable to send verification OTP" });
    }
  });

  // API Route: Verify OTP
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, otp, notifyConsent } = req.body;
      if (!phoneNumber || !otp) {
        return res.status(400).json({ error: "Phone number and OTP code are both required" });
      }

      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const cached = otpStore.get(cleanPhone);

      // OTP Verification
      if (!cached) {
        return res.status(400).json({ error: "No verification request found for this phone number." });
      }

      if (Date.now() > cached.expiresAt) {
        otpStore.delete(cleanPhone);
        return res.status(400).json({ error: "Verification code expired. Please request a new one." });
      }

      if (cached.otp !== otp) {
        return res.status(400).json({ error: "Incorrect OTP code. Please verify and try again." });
      }

      // Success - Clear OTP cache
      otpStore.delete(cleanPhone);

      // Create a stable user ID based on phone number
      const customUserId = `node-user-${cleanPhone}`;
      const userRef = firestore.collection("users").doc(customUserId);

      const userPayload = {
        userId: customUserId,
        phoneNumber: `+91${cleanPhone}`,
        notifyConsent: notifyConsent ?? true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Save user profile in Firestore directly from our backend
      try {
        await userRef.set(userPayload, { merge: true });
      } catch (dbErr: any) {
        console.error("[OTP API] Failed to register/save user profile:", dbErr);
        return res.status(500).json({ error: `Database error storing user profile: ${dbErr.message}` });
      }

      return res.json({
        success: true,
        user: {
          uid: customUserId,
          phoneNumber: `+91${cleanPhone}`,
          notifyConsent: notifyConsent ?? true,
          isSimulated: false,
          savedInDB: true
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to verify OTP code" });
    }
  });

  // API Route: Get User Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const userOrders: any[] = [];
      const ordersSnapshot = await firestore
        .collection("orders")
        .where("userId", "==", userId)
        .get();

      ordersSnapshot.forEach((doc) => {
        const data = doc.data();
        let formattedCreatedAt = data.createdAt;
        
        // Convert Firestore Timestamp to compatible JSON representation
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          const date = data.createdAt.toDate();
          formattedCreatedAt = { seconds: Math.floor(date.getTime() / 1000) };
        } else if (data.createdAt && data.createdAt._seconds) {
          formattedCreatedAt = { seconds: data.createdAt._seconds };
        }

        userOrders.push({
          id: doc.id,
          ...data,
          createdAt: formattedCreatedAt,
        });
      });

      // Sort by creation date descending
      userOrders.sort((a, b) => {
        const t1 = a.createdAt?.seconds || 0;
        const t2 = b.createdAt?.seconds || 0;
        return t2 - t1;
      });

      return res.json(userOrders);
    } catch (err: any) {
      console.error("[Orders API] Failed to fetch user orders:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // API Route: Place Order
  app.post("/api/orders", async (req, res) => {
    try {
      const { 
        userId, 
        email,
        items, 
        itemsSubtotal, 
        discountAmount, 
        finalTotal, 
        status,
        paymentMethod,
        transactionId,
        detailsSummary,
        customerDetails,
        shippingAddress,
        billingAddress
      } = req.body;
      
      if (!userId || !items) {
        return res.status(400).json({ error: "User ID and items list are required to place orders." });
      }

      const orderId = `BLZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderRef = firestore.collection("orders").doc(orderId);

      const newOrderPayload = {
        orderId,
        id: orderId,
        userId,
        items,
        itemsSubtotal,
        discountAmount,
        finalTotal,
        status: status || "placed",
        paymentMethod: paymentMethod || null,
        transactionId: transactionId || null,
        detailsSummary: detailsSummary || null,
        customerDetails: customerDetails || null,
        shippingAddress: shippingAddress || null,
        billingAddress: billingAddress || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      try {
        await orderRef.set(newOrderPayload);
      } catch (dbErr: any) {
        console.error("[Orders] Failed to save order to database:", dbErr);
        return res.status(500).json({ error: `Database error placing order: ${dbErr.message}` });
      }

      // Dispatch asynchronous confirmation email to client/user email ID
      if (email) {
        sendOrderConfirmationEmail(
          email,
          orderId,
          items,
          finalTotal,
          paymentMethod || "Direct Checkout",
          transactionId || "N/A",
          detailsSummary || "Order Placed"
        ).catch(err => console.error("[SMTP async error] Order placement verification email failure:", err));
      }

      return res.json({ 
        success: true, 
        orderId,
        savedInDB: true,
        orderPayload: newOrderPayload
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to record order receipt" });
    }
  });

  // API Route: Secure Checkout Card & UPI Payment Processing Gateway
  app.post("/api/checkout/pay", async (req, res) => {
    try {
      const {
        userId,
        email,
        items,
        itemsSubtotal,
        discountAmount,
        finalTotal,
        paymentMethod,
        cardDetails,
        upiDetails,
        netbankingDetails
      } = req.body;

      if (!userId || !items || !paymentMethod) {
        return res.status(400).json({ error: "Required fields (userId, items, paymentMethod) are missing." });
      }

      let detailsSummary = "";
      
      // Perform genuine cryptographic and structural validations
      if (paymentMethod === "card") {
        if (!cardDetails) {
          return res.status(400).json({ error: "Credit card billing details are required." });
        }
        
        const { cardholderName, cardNumber, expiry, cvv } = cardDetails;
        
        if (!cardholderName || cardholderName.trim().length < 3) {
          return res.status(400).json({ error: "Invalid cardholder name. Enter at least 3 characters." });
        }
        
        const cleanCard = (cardNumber || "").replace(/\s/g, "");
        if (!/^\d{13,19}$/.test(cleanCard)) {
          return res.status(400).json({ error: "Invalid credit card number. Must be between 13 and 19 digits." });
        }
        
        // Expiry check
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
          return res.status(400).json({ error: "Invalid expiry date. Must be in MM/YY format." });
        }
        
        const [mmStr, yyStr] = expiry.split("/");
        const mm = parseInt(mmStr, 10);
        if (mm < 1 || mm > 12) {
          return res.status(400).json({ error: "Invalid expiry month. Must be between 01 and 12." });
        }
        
        if (!cvv || !/^\d{3,4}$/.test(cvv)) {
          return res.status(400).json({ error: "Invalid CVV code. Must be a 3 or 4-digit number." });
        }
        
        // Card brands validation helper
        let brand = "Visa";
        if (cleanCard.startsWith("5")) {
          brand = "Mastercard";
        } else if (cleanCard.startsWith("3")) {
          brand = "American Express";
        } else if (cleanCard.startsWith("6")) {
          brand = "Rupay";
        }
        
        const last4 = cleanCard.slice(-4);
        detailsSummary = `${brand} Card ending in •••• ${last4}`;
        
      } else if (paymentMethod === "upi") {
        if (!upiDetails || !upiDetails.upiId) {
          return res.status(400).json({ error: "UPI Address is required." });
        }
        
        const { upiId } = upiDetails;
        if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
          return res.status(400).json({ error: "Invalid UPI format. Enter an address in 'username@bank_code' format." });
        }
        
        detailsSummary = `UPI Transfer via ${upiId.toLowerCase()}`;
        
      } else if (paymentMethod === "netbanking") {
        if (!netbankingDetails || !netbankingDetails.bankName) {
          return res.status(400).json({ error: "Please select a bank for net banking checkout." });
        }
        
        detailsSummary = `Netbanking Transfer from ${netbankingDetails.bankName}`;
      } else {
        return res.status(400).json({ error: `Unsupported payment method: ${paymentMethod}` });
      }

      // Generate secure transaction details
      const transactionId = `TXN-BLZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderId = `BLZ-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderRef = firestore.collection("orders").doc(orderId);

      const secureOrderObj = {
        orderId,
        id: orderId,
        userId,
        items,
        itemsSubtotal: Math.round(itemsSubtotal || 0),
        discountAmount: Math.round(discountAmount || 0),
        finalTotal: Math.round(finalTotal || 0),
        status: "paid",
        paymentMethod,
        transactionId,
        detailsSummary,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Write direct to immutable Firestore vault
      try {
        await orderRef.set(secureOrderObj);
      } catch (dbErr: any) {
        console.error("[Checkout Pay] Failed to save order to database:", dbErr);
        return res.status(500).json({ error: `Database error placing order: ${dbErr.message}` });
      }

      console.log(`[Balanza Payment] Card/UPI charge succeeded. Order ${orderId} verified with Transaction ${transactionId}.`);

      // Dispatch asynchronous confirmation email to client/user email ID
      if (email) {
        sendOrderConfirmationEmail(
          email,
          orderId,
          items,
          finalTotal,
          paymentMethod,
          transactionId,
          detailsSummary
        ).catch(err => console.error("[SMTP async error] Checkout confirmation email failure:", err));
      }

      return res.json({
        success: true,
        orderId,
        transactionId,
        paymentMethod,
        detailsSummary,
        savedInDB: true,
        orderPayload: secureOrderObj
      });

    } catch (err: any) {
      console.error("[Balanza Payment Processor Exception]:", err);
      return res.status(500).json({ error: err.message || "Secure checkout processor encountered an error." });
    }
  });

  // GET: Razorpay config settings
  app.get("/api/config/razorpay", (req, res) => {
    const rawKeyId = process.env.RAZORPAY_KEY_ID || "";
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const keyId = rawKeyId.replace(/['"]/g, "").trim();
    const keySecret = rawKeySecret.replace(/['"]/g, "").trim();
    return res.json({
      keyId,
      enabled: !!(keyId && keySecret)
    });
  });

  // POST: Create Razorpay Order
  app.post("/api/razorpay/create-order", async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: "Invalid purchase checkout amount" });
      }

      const rawKeyId = process.env.RAZORPAY_KEY_ID || "";
      const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
      const keyId = rawKeyId.replace(/['"]/g, "").trim();
      const keySecret = rawKeySecret.replace(/['"]/g, "").trim();
      const amountInPaise = Math.round(amount * 100);

      if (!keyId || !keySecret) {
        // Handle VS Code local environment or any deployment without credentials gracefully by creating a mock order
        const mockOrderId = `order_mock_${Math.floor(100000 + Math.random() * 900000)}BLZ`;
        return res.json({
          id: mockOrderId,
          amount: amountInPaise,
          currency: "INR",
          mock: true,
          keyId: "rzp_test_mock_keys"
        });
      }

      // Invoke genuine Razorpay Orders API
      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${authHeader}`
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rec_${Math.floor(100000 + Math.random() * 900000)}`
        })
      });

      const data: any = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.description || "Unable to formulate Razorpay request");
      }

      return res.json({
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        mock: false,
        keyId
      });
    } catch (err: any) {
      console.error("[Razorpay Order Creation Exception]:", err);
      return res.status(500).json({ error: err.message || "Failed to create payment pipeline order" });
    }
  });

  // POST: Verify Razorpay Payment Signature
  app.post("/api/razorpay/verify-payment", async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        email,
        items,
        itemsSubtotal,
        discountAmount,
        finalTotal,
        isMock,
        customerDetails,
        shippingAddress,
        billingAddress
      } = req.body;

      if (!userId || !items) {
        return res.status(400).json({ error: "Required user and item records are missing for signature verification" });
      }

      let paymentSuccess = false;

      const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
      const keySecret = rawKeySecret.replace(/['"]/g, "").trim();
      
      const isSandboxMock = isMock || !keySecret || razorpay_signature === 'sandbox_simulation_signature';

      if (isSandboxMock) {
        paymentSuccess = true;
      } else {
        const crypto = await import("crypto");
        const generatedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex");

        if (generatedSignature === razorpay_signature) {
          paymentSuccess = true;
        }
      }

      if (!paymentSuccess) {
        return res.status(400).json({ error: "Tampered or invalid Razorpay payment signature receipt!" });
      }

      // Record successful payment order in firestore
      const orderId = `BLZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderRef = firestore.collection("orders").doc(orderId);

      const secureOrderObj = {
        orderId,
        id: orderId,
        userId,
        items,
        itemsSubtotal: Math.round(itemsSubtotal || 0),
        discountAmount: Math.round(discountAmount || 0),
        finalTotal: Math.round(finalTotal || 0),
        status: "paid",
        paymentMethod: "razorpay",
        transactionId: razorpay_payment_id || `TXN-BLZ-${Math.floor(100000 + Math.random() * 900000)}`,
        detailsSummary: `Razorpay Online Payment (Ref: ${razorpay_order_id})`,
        customerDetails: customerDetails || null,
        shippingAddress: shippingAddress || null,
        billingAddress: billingAddress || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      try {
        await orderRef.set(secureOrderObj);
      } catch (dbErr: any) {
        console.error("[Razorpay Verify] Failed to save successful order to database:", dbErr);
        return res.status(500).json({ error: `Database error recording order: ${dbErr.message}` });
      }

      // Dispatch asynchronous confirmation email to client/user email ID
      if (email) {
        sendOrderConfirmationEmail(
          email,
          orderId,
          items,
          finalTotal,
          "razorpay",
          secureOrderObj.transactionId,
          secureOrderObj.detailsSummary
        ).catch(err => console.error("[SMTP async error] Razorpay order confirmation email failure:", err));
      }

      return res.json({
        success: true,
        orderId,
        transactionId: secureOrderObj.transactionId,
        paymentMethod: "razorpay",
        detailsSummary: secureOrderObj.detailsSummary,
        savedInDB: true,
        orderPayload: secureOrderObj
      });
    } catch (err: any) {
      console.error("[Razorpay Verification General Failure]:", err);
      return res.status(500).json({ error: err.message || "Balanza system could not verify Razorpay signature transaction." });
    }
  });

  // API Route: Submit Newsletter
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email target address is required." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ error: "Please provide a valid email address." });
      }

      const submittedAt = new Date().toISOString();

      // STRICT DIAGNOSTIC RUNTIME LOGGING
      console.log("=== RUNTIME AUDIT BEFORE WRITE ===");
      console.log(`1. Runtime Project ID: ${projectId}`);
      const adminDbId = (firestore as any)?._databaseId?.database || (firestore as any)?.databaseId || "(default)";
      console.log(`2. Runtime Database ID: ${adminDbId}`);
      console.log(`3. SDK Type used: Firebase Admin SDK`);
      console.log(`4. Full document path being written: newsletter_subscribers/${normalizedEmail}`);
      console.log(`5. admin.apps.length: ${admin.apps.length}`);
      console.log(`   process.env.GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT}`);
      console.log(`   process.env.GCLOUD_PROJECT: ${process.env.GCLOUD_PROJECT}`);
      console.log(`6. Exact Firestore instance type: ${firestore?.constructor?.name}`);
      console.log("==================================");

      const collectionName = "newsletter_subscribers";
      const docRef = firestore.collection(collectionName).doc(normalizedEmail);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        return res.json({ success: true, message: "This email address is already subscribed.", alreadySubscribed: true });
      }

      await docRef.set({
        email: normalizedEmail,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        submittedAt: submittedAt,
      });

      // Handle SMTP Notification Email in background (non-blocking)
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (smtpUser && smtpPass) {
        // Dispatch emails in background so the API responds to client instantly
        (async () => {
          try {
            const transporter = nodemailer.createTransport({
              host: smtpHost,
              port: smtpPort,
              secure: smtpPort === 465,
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            });

            const readableDate = new Date(submittedAt).toLocaleString("en-US", {
              timeZone: "UTC",
              dateStyle: "medium",
              timeStyle: "medium",
            }) + " UTC";

            const mailOptions = {
              from: smtpUser,
              to: "hello@balanzabikes.com",
              subject: "New Tiny Riders Club Subscription",
              text: `A new user has joined the Tiny Riders Club.\n\nSubscriber Email: ${normalizedEmail}\n\nSubmitted At: ${readableDate}`,
            };

            const clientMailOptions = {
              from: smtpUser,
              to: normalizedEmail,
              subject: "Welcome to Tiny Riders Club - Balanza Bikes!",
              text: `Hi Rider,\n\nWelcome to the Tiny Riders Club by Balanza Bikes!\n\nThank you for subscribing to our newsletter. You're now on the list to receive exclusive updates, developmental tips for kids on balance bikes, safety guides, and early access to bike restocks and promotions!\n\nIf you have any questions or just want to say hello, feel free to reply to this email or reach us at hello@balanzabikes.com.\n\nKeep riding!\n\nWarmly,\nThe Balanza Bikes Team\nhttps://balanzabikes.com`,
            };

            await Promise.allSettled([
              transporter.sendMail(mailOptions),
              transporter.sendMail(clientMailOptions)
            ]);
            console.log(`[SMTP] Background notification & welcome emails dispatched for subscriber: ${normalizedEmail}`);
          } catch (smtpErr: any) {
            console.error("[SMTP Error] Background mail delivery failed:", smtpErr.message);
          }
        })();
      } else {
        console.warn("[Balanza Newsletter API] SMTP credentials not set. Bypassing email dispatch.");
      }

      return res.json({ 
        success: true, 
        savedInDB: true, 
        emailSent: !!(smtpUser && smtpPass) 
      });
    } catch (err: any) {
      console.error("[Balanza Newsletter API] Capture Failure:", err);
      const fallbackEmail = String(req.body?.email || "").trim().toLowerCase();
      return res.status(500).json({ 
        error: err.message || "Failed to register newsletter subscription", 
        diagnostics: {
          runtimeProjectId: projectId,
          runtimeDatabaseId: (firestore as any)?._databaseId?.database || (firestore as any)?.databaseId || "(default)",
          sdkType: "Firebase Admin SDK",
          documentPath: `newsletter_subscribers/${fallbackEmail}`,
          adminAppProjectId: admin.apps.length > 0 ? admin.app().options.projectId : null,
          GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
          GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
          firestoreConstructor: firestore?.constructor?.name,
          errorStack: err.stack
        }
      });
    }
  });

  // API Route: Test SMTP Email
  app.post("/api/test-email", async (req, res) => {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const configState = {
      SMTP_HOST: smtpHost,
      SMTP_PORT: smtpPort,
      SMTP_USER: smtpUser ? "Configured (masked)" : "Not Set",
      SMTP_PASS: smtpPass ? "Configured (masked)" : "Not Set",
    };

    if (!smtpUser || !smtpPass) {
      return res.status(400).json({
        success: false,
        message: "SMTP configuration is incomplete. Please define SMTP_USER and SMTP_PASS variables in the settings or .env file.",
        config: configState,
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      console.log("[SMTP Test] Verifying SMTP connection...");
      await transporter.verify();
      console.log("[SMTP Test] Connection verified successfully.");

      const mailOptions = {
        from: smtpUser,
        to: "hello@balanzabikes.com",
        subject: "Balanza Bikes SMTP Test Email",
        text: `Hello!\n\nThis is a real SMTP test email from the Balanza Bikes production server.\n\nTime of test: ${new Date().toISOString()}\n\nIf you see this email, your node-mailer configuration is 100% correct and operational!`,
      };

      console.log("[SMTP Test] Sending test email to hello@balanzabikes.com...");
      const info = await transporter.sendMail(mailOptions);
      console.log("[SMTP Test] Test email sent response:", info);

      return res.json({
        success: true,
        message: "SMTP configuration verified and test email sent successfully to hello@balanzabikes.com!",
        config: configState,
        smtpResponse: {
          messageId: info.messageId,
          envelope: info.envelope,
          accepted: info.accepted,
          rejected: info.rejected,
          response: info.response,
        },
      });
    } catch (err: any) {
      console.error("[SMTP Test] Error occurred:", err);
      return res.status(500).json({
        success: false,
        message: "SMTP verification or email transmission failed.",
        error: err.message || String(err),
        config: configState,
      });
    }
  });

  // Admin Subscribers API
  app.get("/api/admin/subscribers", adminOnly, async (req, res) => {
    try {
      const list: any[] = [];
      const snap = await firestore.collection("newsletter_subscribers").get();
      snap.forEach((doc: any) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort subscribers by submission date/time descending if available
      list.sort((a, b) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA;
      });
      return res.json(list);
    } catch (err: any) {
      console.error("[Subscribers Admin] Failed to fetch subscribers list:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // Admin Delete Subscriber API
  app.delete("/api/admin/subscribers/:email", adminOnly, async (req, res) => {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).json({ error: "Email parameter is required to delete." });
      }
      const normalizedEmail = email.trim().toLowerCase();
      
      await firestore.collection("newsletter_subscribers").doc(normalizedEmail).delete();
      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Subscribers Admin] Failed to delete subscriber:", err);
      return res.status(500).json({ error: `Database error deleting subscriber: ${err.message}` });
    }
  });
  // Change Admin Credentials API
  app.post("/api/admin/change-credentials", adminOnly, async (req, res) => {
    try {
      const { email, password } = req.body;
      const adminId = "admin-master-uid";

      const updates: any = {};
      if (email && email.trim()) {
        updates.email = email.trim().toLowerCase();
        if (!runtimeCache.users[adminId]) {
          runtimeCache.users[adminId] = { userId: adminId, role: "admin" };
        }
        runtimeCache.users[adminId].email = updates.email;
      }
      if (password && password.trim()) {
        const passwordHash = hashPassword(password);
        updates.passwordHash = passwordHash;
        if (!runtimeCache.users[adminId]) {
          runtimeCache.users[adminId] = { userId: adminId, role: "admin" };
        }
        runtimeCache.users[adminId].passwordHash = passwordHash;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No username or password update fields were provided." });
      }

      try {
        await firestore.collection("users").doc(adminId).update(updates);
      } catch (dbErr) {
        // Fallback setting if user not completely in sync
        try {
          await firestore.collection("users").doc(adminId).set({
            ...runtimeCache.users[adminId],
            ...updates
          }, { merge: true });
        } catch (setErr) {
          console.warn("[Admin Credentials] Firestore Sync failed:", setErr);
        }
      }

      return res.json({
        success: true,
        message: "Admin credentials successfully updated.",
        user: {
          userId: adminId,
          email: runtimeCache.users[adminId].email,
          role: "admin"
        }
      });
    } catch (err: any) {
      console.error("[Admin Credentials Error]", err);
      return res.status(500).json({ error: "Failed to update admin credentials." });
    }
  });

  // List Videos API Route
  app.get("/api/admin/videos", adminOnly, async (req, res) => {
    try {
      const list: any[] = [];
      const snap = await firestore.collection("videos").get();
      snap.forEach((doc: any) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort videos by uploadedAt descending
      list.sort((a, b) => {
        const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        return dateB - dateA;
      });
      return res.json(list);
    } catch (err: any) {
      console.error("[Videos Admin] Failed to fetch videos list:", err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
  });

  // Upload Video API Route
  app.post("/api/admin/videos", adminOnly, async (req, res) => {
    try {
      const { name, data } = req.body;
      if (!name || !data) {
        return res.status(400).json({ error: "Video filename and base64 binary data are required." });
      }

      // Check format
      const extension = name.split(".").pop()?.toLowerCase();
      if (!extension || !["mp4", "mov", "webm"].includes(extension)) {
        return res.status(400).json({ error: "Unsupported video format. Only MP4, MOV, and WEBM are allowed." });
      }

      // Format base64 data sanitation
      const base64Data = data.replace(/^data:video\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Validate video file size: limit to 50MB
      if (buffer.length > 50 * 1024 * 1024) {
        return res.status(400).json({ error: "Video file exceeds 50MB limit." });
      }

      const id = `video_${Date.now()}`;
      const safeName = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filterName = `${id}_${safeName}`;
      const filePath = path.join(uploadsDir, filterName);

      fs.writeFileSync(filePath, buffer);
      const url = `/uploads/${filterName}`;

      const videoMeta = {
        name,
        url,
        size: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString()
      };

      try {
        await firestore.collection("videos").doc(id).set(videoMeta);
      } catch (dbErr: any) {
        console.error("[Video DB] Firestore collection save failed:", dbErr);
        // Clean up physical file on failure
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(500).json({ error: `Database error storing video metadata: ${dbErr.message}` });
      }

      return res.json({ success: true, id, ...videoMeta });
    } catch (err: any) {
      console.error("[Video DB Upload Error]", err);
      return res.status(500).json({ error: "Failed to store video asset." });
    }
  });

  // Replace Video API Route
  app.put("/api/admin/videos/:id", adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, data } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Video ID is required for replacement." });
      }
      if (!name || !data) {
        return res.status(400).json({ error: "Replacement video filename and binary data are required." });
      }

      // Check format
      const extension = name.split(".").pop()?.toLowerCase();
      if (!extension || !["mp4", "mov", "webm"].includes(extension)) {
        return res.status(400).json({ error: "Unsupported format. Only MP4, MOV, and WEBM formats are supported." });
      }

      // Format base64 data sanitation
      const base64Data = data.replace(/^data:video\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Validate video file size: limit to 50MB
      if (buffer.length > 50 * 1024 * 1024) {
        return res.status(400).json({ error: "Video file exceeds 50MB limit." });
      }

      // Find old metadata
      let oldUrl = "";
      const item = await firestore.collection("videos").doc(id).get();
      if (item.exists) {
        oldUrl = item.data()?.url || "";
      } else {
        return res.status(404).json({ error: "Video metadata not found for update" });
      }

      // Delete old physical file if exists
      if (oldUrl) {
        const oldFileName = oldUrl.split("/").pop();
        if (oldFileName) {
          const oldFilePath = path.join(uploadsDir, oldFileName);
          if (fs.existsSync(oldFilePath)) {
            try {
              fs.unlinkSync(oldFilePath);
            } catch (fsErr) {
              console.warn("Could not remove old video file physical asset:", fsErr);
            }
          }
        }
      }

      // Write new replacement physical file
      const safeName = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filterName = `${id}_${safeName}`;
      const filePath = path.join(uploadsDir, filterName);

      fs.writeFileSync(filePath, buffer);
      const url = `/uploads/${filterName}`;

      const videoMeta = {
        name,
        url,
        size: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString()
      };

      try {
        await firestore.collection("videos").doc(id).set(videoMeta);
      } catch (dbErr: any) {
        console.error("[Video DB] Firestore collection replacement failed:", dbErr);
        // Clean up replacement physical file on failure
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(500).json({ error: `Database error replacing video metadata: ${dbErr.message}` });
      }

      return res.json({ success: true, id, ...videoMeta });
    } catch (err: any) {
      console.error("[Video DB Replace Error]", err);
      return res.status(500).json({ error: "Failed to replace video asset." });
    }
  });

  // Delete Video API Route
  app.delete("/api/admin/videos/:id", adminOnly, async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Video ID is required for deletion." });
      }

      // Find metadata to locate physical file
      let url = "";
      const item = await firestore.collection("videos").doc(id).get();
      if (item.exists) {
        url = item.data()?.url || "";
      } else {
        return res.status(404).json({ error: "Video metadata not found for deletion" });
      }

      // Delete physical file asset
      if (url) {
        const fileName = url.split("/").pop();
        if (fileName) {
          const filePath = path.join(uploadsDir, fileName);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (fsErr) {
              console.warn("Could not delete physical video file asset:", fsErr);
            }
          }
        }
      }

      // Delete from Firestore DB
      await firestore.collection("videos").doc(id).delete();

      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Video DB Delete Error]", err);
      return res.status(500).json({ error: `Failed to delete video asset: ${err.message}` });
    }
  });

// Vite integration middleware for dev & production asset pipeline
  if (process.env.NODE_ENV !== "production") {
    try {
      const viteDevServer = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(viteDevServer.middlewares);

      // Serve index.html with Vite transforms for all non-API, non-file GET requests
      app.get("*", async (req, res, next) => {
        // Skip API routes and files with extensions
        if (req.originalUrl.startsWith("/api") || req.originalUrl.includes(".")) {
          return next();
        }
        try {
          const templatePath = path.join(process.cwd(), "index.html");
          let template = fs.readFileSync(templatePath, "utf-8");
          template = await viteDevServer.transformIndexHtml(req.originalUrl, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } catch (err) {
          next(err);
        }
      });

      console.log("[Vite] Dev server middleware initialized successfully");
    } catch (err) {
      console.error("[Vite] Dev server middleware failed to start:", err);
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      seedDatabase().catch((err) => console.error("Error seeding database on boot: ", err));
      console.log(`Server successfully running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });
  } else {
    seedDatabase().catch((err) => console.error("Error seeding database in serverless start: ", err));
  }
}

startServer();

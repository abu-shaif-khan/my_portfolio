import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { DEFAULT_PORTFOLIO_DATA } from "./src/data";
import { PortfolioData, ContactMessage } from "./src/types";

const app = express();
const PORT = 3000;

// Setup directories
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const PORTFOLIO_FILE = path.join(DATA_DIR, "portfolio.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure Database Files Exist
function initDB() {
  // 1. Portfolio data
  if (!fs.existsSync(PORTFOLIO_FILE)) {
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(DEFAULT_PORTFOLIO_DATA, null, 2), "utf8");
    console.log("Initialized portfolio.json with default seed data");
  }

  // 2. Contact messages
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), "utf8");
    console.log("Initialized messages.json empty list");
  }

  // 3. Admin Authentication File
  if (!fs.existsSync(AUTH_FILE)) {
    const salt = crypto.randomBytes(16).toString("hex");
    const defaultPassword = "shaif123"; // Easy default password as requested for dynamic admin login
    const hash = crypto.createHmac("sha256", salt).update(defaultPassword).digest("hex");
    
    const initialAuth = {
      user: "askshovon5207@gmail.com",
      passwordHash: hash,
      salt: salt,
      sessions: {} as { [token: string]: { expiry: number } }
    };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(initialAuth, null, 2), "utf8");
    console.log("Initialized auth.json with default admin credentials");
  }
}

initDB();

// Large limits to handle direct Base64 image payload uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// Session authentication middleware helper
function getAdminAuth() {
  if (!fs.existsSync(AUTH_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, "utf8"));
  } catch (e) {
    return null;
  }
}

function saveAdminAuth(authData: any) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2), "utf8");
}

function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Missing authentication token." });
  }

  const token = authHeader.split(" ")[1];
  const authData = getAdminAuth();

  if (!authData || !authData.sessions || !authData.sessions[token]) {
    return res.status(401).json({ error: "Invalid or expired session token." });
  }

  const session = authData.sessions[token];
  if (Date.now() > session.expiry) {
    // Delete expired session
    delete authData.sessions[token];
    saveAdminAuth(authData);
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }

  // Session is valid, reset countdown/extend session
  authData.sessions[token].expiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hour extension
  saveAdminAuth(authData);
  next();
}

// API ENDPOINTS

// 0. GET Portfolio Resume Document (Public)
app.get("/api/portfolio/resume", (req, res) => {
  try {
    if (fs.existsSync(PORTFOLIO_FILE)) {
      const dataRaw = fs.readFileSync(PORTFOLIO_FILE, "utf8");
      const data = JSON.parse(dataRaw);
      if (data.hero && data.hero.resumeUrl) {
        if (data.hero.resumeUrl.startsWith("/")) {
          const filePath = path.join(process.cwd(), data.hero.resumeUrl);
          if (fs.existsSync(filePath)) {
            res.setHeader("Content-Type", "application/pdf");
            return res.sendFile(filePath);
          }
        } else if (data.hero.resumeUrl.startsWith("http")) {
          return res.redirect(data.hero.resumeUrl);
        }
      }
    }
    
    // Fallback if no custom PDF resume is active
    res.setHeader("Content-Type", "text/plain");
    res.send(`--------------------------------------------------
ABU SHAIF KHAN - IT & NETWORK SPECIALIST RESUME
--------------------------------------------------
Email: askshovon5207@gmail.com
Location: Dhaka, Bangladesh

EXPERTISE SUMMARY:
- Enterprise Cisco Routing & Switching (CCNA, CCNP level)
- Advanced Firewall and Security Gateways (Fortinet NSE)
- Virtualization & Cloud Systems (Microsoft Azure, AWS, VMware vSphere)
- Windows Server & Active Directory Infrastructure
- Network Monitoring & Analysis Tools (PRTG, Wireshark, Zabbix)

EDUCATION:
- B.Sc. in Computer Science & Engineering (XYZ University, 2020)

EXPERIENCE:
- Senior Network Engineer at ABC Technologies (2022 - Present)
- IT Support & System Administrator at Global Tech Services (2021 - 2022)

Generated dynamically via Portfolio Platform. Upload the customized PDF format from the Admin Panel.
--------------------------------------------------`);
  } catch (error) {
    res.status(500).send("Error reading resume payload.");
  }
});

// 1. GET Portfolio Data
app.get("/api/portfolio", (req, res) => {
  try {
    const dataRaw = fs.readFileSync(PORTFOLIO_FILE, "utf8");
    const data = JSON.parse(dataRaw);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to read portfolio config." });
  }
});

// 2. POST Save Portfolio Data (Admin only)
app.post("/api/portfolio", checkAdminAuth, (req, res) => {
  try {
    const incomingData: PortfolioData = req.body;
    if (!incomingData.hero || !incomingData.skills || !incomingData.experiences || !incomingData.education || !incomingData.certifications || !incomingData.contact) {
      return res.status(400).json({ error: "Invalid portfolio data structure schema." });
    }

    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(incomingData, null, 2), "utf8");
    res.json({ message: "Portfolio successfully updated!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save portfolio values." });
  }
});

// 3. POST Contact Form Submit (Public)
app.post("/api/contact/message", (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required. Please check input." });
    }

    const messagesRaw = fs.readFileSync(MESSAGES_FILE, "utf8");
    const messagesList: ContactMessage[] = JSON.parse(messagesRaw);

    const newMessage: ContactMessage = {
      id: crypto.randomBytes(8).toString("hex"),
      name: name.toString().substring(0, 100),
      email: email.toString().substring(0, 100),
      subject: subject.toString().substring(0, 200),
      message: message.toString().substring(0, 5000),
      status: "unread",
      createdAt: new Date().toISOString()
    };

    messagesList.unshift(newMessage); // newest first
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messagesList, null, 2), "utf8");

    res.json({ success: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to process security form submit." });
  }
});

// 4. GET Admin Messages List (Admin only)
app.get("/api/admin/messages", checkAdminAuth, (req, res) => {
  try {
    const dataRaw = fs.readFileSync(MESSAGES_FILE, "utf8");
    const messages = JSON.parse(dataRaw);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to read logs." });
  }
});

// 5. POST Mark Message as Read (Admin only)
app.post("/api/admin/messages/:id/read", checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const messagesRaw = fs.readFileSync(MESSAGES_FILE, "utf8");
    const messagesList: ContactMessage[] = JSON.parse(messagesRaw);

    const targetIndex = messagesList.findIndex(m => m.id === id);
    if (targetIndex === -1) {
      return res.status(404).json({ error: "Message not found." });
    }

    messagesList[targetIndex].status = "read";
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messagesList, null, 2), "utf8");
    res.json({ message: "Message marked as read." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update record." });
  }
});

// 6. DELETE Message (Admin only)
app.delete("/api/admin/messages/:id", checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const messagesRaw = fs.readFileSync(MESSAGES_FILE, "utf8");
    const messagesList: ContactMessage[] = JSON.parse(messagesRaw);

    const filtered = messagesList.filter(m => m.id !== id);
    if (filtered.length === messagesList.length) {
      return res.status(404).json({ error: "Message not found." });
    }

    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(filtered, null, 2), "utf8");
    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message." });
  }
});

// 7. POST Admin Login
app.post("/api/admin/login", (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const authData = getAdminAuth();
    if (!authData) {
      return res.status(500).json({ error: "Authentication system not initialized." });
    }

    const hash = crypto.createHmac("sha256", authData.salt).update(password).digest("hex");
    if (hash !== authData.passwordHash) {
      return res.status(401).json({ error: "Invalid password key." });
    }

    // Generate secure session token (2 hr expiry)
    const token = crypto.randomBytes(32).toString("hex");
    if (!authData.sessions) {
      authData.sessions = {};
    }
    
    authData.sessions[token] = {
      expiry: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };

    saveAdminAuth(authData);
    res.json({ token, email: authData.user });
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate." });
  }
});

// 8. POST Change Admin Password (Admin only)
app.post("/api/admin/change-password", checkAdminAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required." });
    }

    const authData = getAdminAuth();
    if (!authData) {
      return res.status(500).json({ error: "Authentication database error." });
    }

    const currentHash = crypto.createHmac("sha256", authData.salt).update(currentPassword).digest("hex");
    if (currentHash !== authData.passwordHash) {
      return res.status(401).json({ error: "Incorrect current password." });
    }

    // Renew keys and hash
    const newSalt = crypto.randomBytes(16).toString("hex");
    const newHash = crypto.createHmac("sha256", newSalt).update(newPassword).digest("hex");

    authData.salt = newSalt;
    authData.passwordHash = newHash;
    // Wipe other active sessions for security except the current session if supplied
    const authHeader = req.headers.authorization;
    const currentToken = authHeader ? authHeader.split(" ")[1] : null;
    
    const updatedSessions: { [token: string]: any } = {};
    if (currentToken && authData.sessions[currentToken]) {
      updatedSessions[currentToken] = authData.sessions[currentToken];
    }
    authData.sessions = updatedSessions;

    saveAdminAuth(authData);
    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password." });
  }
});

// 9. POST Upload Base64 Image Asset (Admin only)
app.post("/api/admin/upload", checkAdminAuth, (req, res) => {
  try {
    const { name, type, data } = req.body;
    if (!name || !type || !data) {
      return res.status(400).json({ error: "Invalid upload payload components." });
    }

    // Split base64 scheme out
    const match = data.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: "Invalid base64 encoding format." });
    }

    const base64Data = match[2];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Secure file extension match
    const originalExt = path.extname(name).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".pdf"];
    const ext = allowedExts.includes(originalExt) ? originalExt : ".jpg";

    const fileName = `upload-${crypto.randomBytes(8).toString("hex")}${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    fs.writeFileSync(filePath, imageBuffer);
    console.log(`Successfully saved uploaded file to ${filePath}`);

    res.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error("Upload error details: ", error);
    res.status(500).json({ error: "Failed to store uploaded file." });
  }
});

// Vite Integration Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite integration");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with static directory serving");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully running on http://localhost:${PORT}`);
  });
}

startServer();

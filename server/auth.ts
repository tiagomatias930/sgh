import express from "express";
import session from "express-session";
import { storage } from "./storage";

// Default admin credentials
const ADMIN_USERNAME = "admin";

// Function to get admin password from Google Apps Script
async function getAdminPassword(): Promise<string> {
  try {
    // Try to get from Google Apps Script storage first
    const result = await (storage as any).makeRequest({
      acao: "findDocumentId",
      banco: "hospital_pediatrico",
      colecao: "admin_config",
      id: "admin_credentials"
    });

    if (result && result.password) {
      return result.password;
    }
  } catch (error) {
    console.error('Error getting admin password from Google Apps Script:', error);
  }

  // Fallback to default password
  return "admin123";
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  return session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: express.Express) {
  app.use(getSession());

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME) {
      try {
        const adminPassword = await getAdminPassword();

        if (password === adminPassword) {
          (req.session as any).isAuthenticated = true;
          (req.session as any).user = { username: ADMIN_USERNAME };
          return res.json({ success: true, user: { username: ADMIN_USERNAME } });
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }

    res.status(401).json({ success: false, message: "Credenciais inválidas" });
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Erro ao fazer logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    if ((req.session as any)?.isAuthenticated) {
      res.json((req.session as any).user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  if ((req.session as any)?.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
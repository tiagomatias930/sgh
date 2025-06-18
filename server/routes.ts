import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";

const updatePostSchema = insertPostSchema.partial();

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Public post routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Only return published posts for public access
      if (!post.published) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Public admin routes - accessible to anyone on /xadminx with password
  app.get("/api/admin/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req: any, res) => {
    try {
      const validatedData = insertPostSchema.parse({
        ...req.body,
        authorId: "admin",
      });

      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid post data", 
          errors: error.errors 
        });
      }
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", async (req: any, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      // Check if post exists first
      const existingPost = await storage.getPostById(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      const validatedData = updatePostSchema.parse(req.body);
      const post = await storage.updatePost(id, validatedData);

      if (!post) {
        return res.status(404).json({ message: "Post not found after update" });
      }

      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid post data", 
          errors: error.errors 
        });
      }
      console.error("Error updating post:", error);
      res.status(500).json({ 
        message: "Failed to update post",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      await storage.deletePost(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: "Nome, email e mensagem são obrigatórios" });
      }

      // In a real implementation, you would send an email or save to database
      console.log("Contact form submission:", { name, email, phone, message });

      res.json({ message: "Mensagem enviada com sucesso! Entraremos em contacto em breve." });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Erro ao enviar mensagem. Tente novamente." });
    }
  });

  // Simple password check for admin access
  app.post("/api/admin/verify", async (req, res) => {
    const { password } = req.body;
    
    if (password === "genio123") {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Senha incorreta" });
    }
  });

  // Database status endpoint - simplified for Google Apps Script only
  app.get("/api/admin/database-status", (req, res) => {
    res.json({
      currentDatabase: "Google Apps Script",
      useGoogleScript: true,
      googleScriptUrl: "https://script.google.com/macros/s/AKfycbxqNmSmyjrp-x50uWAtv48pwbmuG38vyyVjg1oP845qv9xlhZmmGwgy2TnxQesZHZ0WTw/exec"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { type User, type Post, type UpsertUser, type InsertPost } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Post operations
  getAllPosts(): Promise<Post[]>;
  getPublishedPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: string): Promise<void>;
}

// Google Apps Script Storage Implementation
export class GoogleAppsScriptStorage implements IStorage {
  private readonly GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqNmSmyjrp-x50uWAtv48pwbmuG38vyyVjg1oP845qv9xlhZmmGwgy2TnxQesZHZ0WTw/exec";
  private readonly DATABASE_NAME = "hospital_pediatrico";
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create database if it doesn't exist
      await this.makeRequest({
        acao: "createDatabase",
        db: this.DATABASE_NAME
      });

      // Create users collection
      await this.makeRequest({
        acao: "createCollection",
        db: this.DATABASE_NAME,
        colecao: "users",
        campos: ["email", "firstName", "lastName", "profileImageUrl"]
      });

      // Create posts collection
      await this.makeRequest({
        acao: "createCollection",
        db: this.DATABASE_NAME,
        colecao: "posts",
        campos: ["title", "content", "excerpt", "imageUrl", "category", "published", "authorId"]
      });

      // Create admin_config collection for storing admin credentials
      await this.makeRequest({
        acao: "createCollection",
        db: this.DATABASE_NAME,
        colecao: "admin_config",
        campos: ["password"]
      });

      // Initialize admin password if it doesn't exist
      try {
        const existingConfig = await this.makeRequest({
          acao: "findDocumentId",
          db: this.DATABASE_NAME,
          colecao: "admin_config",
          id: "admin_credentials"
        });

        if (!existingConfig || existingConfig.error) {
          // Create default admin password
          await this.makeRequest({
            acao: "set",
            db: this.DATABASE_NAME,
            colecao: "admin_config",
            _id: "admin_credentials",
            password: "admin123"
          });
          console.log("Default admin password initialized in Google Apps Script");
        }
      } catch (error) {
        console.error("Error initializing admin password:", error);
      }

      this.initialized = true;
      console.log("Google Apps Script database initialized successfully");
    } catch (error) {
      console.error("Error initializing Google Apps Script database:", error);
      // Continue anyway - collections might already exist
      this.initialized = true;
    }
  }

  private async makeRequest(data: any): Promise<any> {
    try {
      const response = await fetch(this.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Apps Script request failed:', error);
      throw error;
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    await this.ensureInitialized();
    try {
      const result = await this.makeRequest({
        acao: "findDocumentId",
        db: this.DATABASE_NAME,
        colecao: "users",
        id: id
      });

      if (!result || result.error) {
        return undefined;
      }

      return {
        id: result._id,
        email: result.email || null,
        firstName: result.firstName || null,
        lastName: result.lastName || null,
        profileImageUrl: result.profileImageUrl || null,
        createdAt: result.createdAt ? new Date(result.createdAt) : new Date(),
        updatedAt: result.updatedAt ? new Date(result.updatedAt) : new Date()
      };
    } catch (error) {
      console.error('Error getting user from Google Apps Script:', error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    await this.ensureInitialized();
    try {
      // First try to find existing user
      const existingUser = await this.getUser(userData.id);

      if (existingUser) {
        // Update existing user
        const result = await this.makeRequest({
          acao: "update",
          db: this.DATABASE_NAME,
          colecao: "users",
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date().toISOString()
        });

        return {
          id: result._id,
          email: result.email || null,
          firstName: result.firstName || null,
          lastName: result.lastName || null,
          profileImageUrl: result.profileImageUrl || null,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt)
        };
      } else {
        // Create new user
        const result = await this.makeRequest({
          acao: "set",
          banco: this.DATABASE_NAME,
          colecao: "users",
          _id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl
        });

        return {
          id: result._id,
          email: result.email || null,
          firstName: result.firstName || null,
          lastName: result.lastName || null,
          profileImageUrl: result.profileImageUrl || null,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.createdAt)
        };
      }
    } catch (error) {
      console.error('Error upserting user in Google Apps Script:', error);
      throw error;
    }
  }

  // Post operations
  async getAllPosts(): Promise<Post[]> {
    await this.ensureInitialized();
    try {
      const result = await this.makeRequest({
        acao: "find",
        db: this.DATABASE_NAME,
        colecao: "posts",
        options: {
          sort: { createdAt: -1 }
        }
      });

      if (!Array.isArray(result)) {
        return [];
      }

      return result.map(this.formatPostFromGoogleScript);
    } catch (error) {
      console.error('Error getting all posts from Google Apps Script:', error);
      return [];
    }
  }

  async getPublishedPosts(): Promise<Post[]> {
    await this.ensureInitialized();
    try {
      const result = await this.makeRequest({
        acao: "find",
        db: this.DATABASE_NAME,
        colecao: "posts",
        filter: { published: true },
        options: {
          sort: { createdAt: -1 }
        }
      });

      if (!Array.isArray(result)) {
        return [];
      }

      return result.map(this.formatPostFromGoogleScript);
    } catch (error) {
      console.error('Error getting published posts from Google Apps Script:', error);
      return [];
    }
  }

  async getPostById(id: string): Promise<Post | undefined> {
    await this.ensureInitialized();
    try {
      const result = await this.makeRequest({
        acao: "findDocumentId",
        db: this.DATABASE_NAME,
        colecao: "posts",
        id: id.toString()
      });

      if (!result || result.error) {
        return undefined;
      }

      return this.formatPostFromGoogleScript(result);
    } catch (error) {
      console.error('Error getting post by ID from Google Apps Script:', error);
      return undefined;
    }
  }

  async createPost(postData: InsertPost): Promise<Post> {
    await this.ensureInitialized();
    try {
      const result = await this.makeRequest({
        acao: "insert",
        db: this.DATABASE_NAME,
        colecao: "posts",
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        imageUrl: postData.imageUrl,
        category: postData.category,
        published: postData.published,
        authorId: postData.authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (!result || result.error) {
        throw new Error(`Failed to create post: ${result?.error || 'Unknown error'}`);
      }

      return this.formatPostFromGoogleScript(result);
    } catch (error) {
      console.error('Error creating post in Google Apps Script:', error);
      throw error;
    }
  }

  async updatePost(id: string, postData: Partial<InsertPost>): Promise<Post> {
    await this.ensureInitialized();
    try {
      console.log(`Attempting to update post with ID: ${id}`, postData);

      const updateData: any = {
        acao: "update",
        db: this.DATABASE_NAME,
        colecao: "posts",
        id: id, // Use the ID directly as it should match the _id in Google Apps Script
        updatedAt: new Date().toISOString()
      };

      // Add only the fields that are being updated
      if (postData.title !== undefined) updateData.title = postData.title;
      if (postData.content !== undefined) updateData.content = postData.content;
      if (postData.excerpt !== undefined) updateData.excerpt = postData.excerpt;
      if (postData.imageUrl !== undefined) updateData.imageUrl = postData.imageUrl;
      if (postData.category !== undefined) updateData.category = postData.category;
      if (postData.published !== undefined) updateData.published = postData.published;
      if (postData.authorId !== undefined) updateData.authorId = postData.authorId;

      const updateResult = await this.makeRequest(updateData);
      console.log('Update result:', updateResult);

      if (updateResult && updateResult.error) {
        throw new Error(`Failed to update post: ${updateResult.error}`);
      }

      // Always fetch the updated post to ensure we have the latest data
      const updatedPost = await this.getPostById(id);
      if (!updatedPost) {
        throw new Error('Post not found after update');
      }

      return updatedPost;
    } catch (error) {
      console.error('Error updating post in Google Apps Script:', error);
      throw error;
    }
  }

  async deletePost(id: string): Promise<void> {
    await this.ensureInitialized();
    try {
      console.log(`Attempting to delete post with ID: ${id}`);

      // Use the ID directly as it should match the _id in Google Apps Script
      const deleteResult = await this.makeRequest({
        acao: 'delete',
        db: this.DATABASE_NAME,
        colecao: 'posts',
        id: id // Use the ID directly
      });

      console.log('Delete result:', deleteResult);

      // Check if deletion was successful
      if (deleteResult && deleteResult.error) {
        throw new Error(`Failed to delete post: ${deleteResult.error}`);
      }

      // If the result indicates failure, throw an error
      if (deleteResult && deleteResult.deleted === false) {
        throw new Error('Post could not be deleted');
      }

    } catch (error) {
      console.error('Error deleting post in Google Apps Script:', error);
      throw error;
    }
  }

  private formatPostFromGoogleScript(data: any): Post {
    // Log the raw data to understand the ID structure
    console.log('Raw Google Script data:', JSON.stringify(data, null, 2));

    // Store the original database ID for operations
    const originalId = data._id || data.id;
    console.log('Original ID from database:', originalId);

    return {
      id: originalId,
      title: data.title || "",
      content: data.content || "",
      excerpt: data.excerpt || "",
      imageUrl: data.imageUrl || null,
      category: data.category || "noticia",
      published: data.published === true || data.published === "true",
      authorId: data.authorId || "admin",
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    };
  }
}

// Storage factory function - only Google Apps Script
export const storage = new GoogleAppsScriptStorage();
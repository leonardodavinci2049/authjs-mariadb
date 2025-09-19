// lib/betterAuthAdapter.ts
import type { BetterAuthAdapter } from "better-auth";
import { db } from "./db";

export const mysqlAdapter: BetterAuthAdapter = {
  async getUserByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return (rows as any[])[0] ?? null;
  },

  async getUserById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return (rows as any[])[0] ?? null;
  },

  async createUser(user) {
    const [result] = await db.query(
      "INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)",
      [user.id, user.email, user.password, user.name ?? null]
    );
    return { ...user };
  },

  // Sessões
  async createSession(session) {
    await db.query(
      "INSERT INTO sessions (id, userId, expiresAt, createdAt) VALUES (?, ?, ?, ?)",
      [session.id, session.userId, session.expiresAt, session.createdAt]
    );
    return session;
  },

  async getSessionAndUser(sessionId) {
    const [rows] = await db.query(
      `SELECT s.*, u.* FROM sessions s 
       JOIN users u ON s.userId = u.id 
       WHERE s.id = ?`,
      [sessionId]
    );
    if (!(rows as any[])[0]) return null;

    const session = {
      id: (rows as any)[0].id,
      userId: (rows as any)[0].userId,
      expiresAt: (rows as any)[0].expiresAt,
      createdAt: (rows as any)[0].createdAt,
    };
    const user = {
      id: (rows as any)[0].userId,
      email: (rows as any)[0].email,
      name: (rows as any)[0].name,
    };
    return { session, user };
  },

  async deleteSession(sessionId) {
    await db.query("DELETE FROM sessions WHERE id = ?", [sessionId]);
  },
};

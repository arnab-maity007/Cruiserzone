import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  // Production: use Turso via libsql adapter
  if (process.env.TURSO_DATABASE_URL) {
    const { createClient } = require("@libsql/client");
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");

    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  // Development: local SQLite file (DATABASE_URL = file:./prisma/dev.db)
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
}

const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

import fs from "fs/promises";
import path from "path";

export async function initDb(db) {
    try {
        const schemaPath = path.resolve("db", "schema.sql");
        const schemaSql = await fs.readFile(schemaPath, "utf-8");

        const statements = schemaSql
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);

        for (const statement of statements) {
            await db.raw(statement);
        }

        console.log("✅ Database schema initialized");
    } catch (error) {
        console.error("⚠️ Failed to initialize database schema:", error.message);
    }
}

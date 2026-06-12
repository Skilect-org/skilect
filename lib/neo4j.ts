/**
 * Neo4j Driver
 *
 * Singleton driver instance for the Neo4j graph database.
 * Always use `runNeo4jQuery()` for one-off queries — it opens a session,
 * runs the query, and closes the session automatically.
 *
 * Call `closeNeo4jDriver()` on graceful shutdown (e.g. in a shutdown hook).
 *
 * Required env vars:
 *   NEO4J_URI        e.g. neo4j+s://xxxxx.databases.neo4j.io
 *   NEO4J_USERNAME   e.g. neo4j
 *   NEO4J_PASSWORD
 */

import neo4j, { Driver, Session } from "neo4j-driver";

const neo4jUri = process.env.NEO4J_URI;
const neo4jUsername = process.env.NEO4J_USERNAME;
const neo4jPassword = process.env.NEO4J_PASSWORD;

if (!neo4jUri || !neo4jUsername || !neo4jPassword) {
  throw new Error(
    "[Neo4j] Missing NEO4J_URI, NEO4J_USERNAME, or NEO4J_PASSWORD"
  );
}

// ── Singleton driver ──────────────────────────────────────────────────────────
let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      neo4jUri!,
      neo4j.auth.basic(neo4jUsername!, neo4jPassword!)
    );
  }
  return driver;
}

// ── Session helper ────────────────────────────────────────────────────────────
// Opens a session, runs your callback, closes the session — even on error.
export async function runNeo4jQuery<T>(
  fn: (session: Session) => Promise<T>
): Promise<T> {
  const session = getNeo4jDriver().session();
  try {
    return await fn(session);
  } finally {
    await session.close();
  }
}

// ── Graceful shutdown ─────────────────────────────────────────────────────────
export async function closeNeo4jDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

export { neo4jUri, neo4jUsername };

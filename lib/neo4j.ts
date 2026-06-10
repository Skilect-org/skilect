/**
 * Neo4j Driver
 *
 * Initializes and exports the Neo4j driver for graph database operations.
 * Uses environment variables for configuration.
 *
 * Required env vars:
 *   NEO4J_URI
 *   NEO4J_USERNAME
 *   NEO4J_PASSWORD
 */

// TODO: Install neo4j-driver and uncomment
// import neo4j, { Driver } from "neo4j-driver";

const neo4jUri = process.env.NEO4J_URI!;
const neo4jUsername = process.env.NEO4J_USERNAME!;
const neo4jPassword = process.env.NEO4J_PASSWORD!;

// Singleton Neo4j driver instance
// let driver: Driver | null = null;

// export function getNeo4jDriver(): Driver {
//   if (!driver) {
//     driver = neo4j.driver(
//       neo4jUri,
//       neo4j.auth.basic(neo4jUsername, neo4jPassword)
//     );
//   }
//   return driver;
// }

// export async function closeNeo4jDriver() {
//   if (driver) {
//     await driver.close();
//     driver = null;
//   }
// }

export { neo4jUri, neo4jUsername, neo4jPassword };

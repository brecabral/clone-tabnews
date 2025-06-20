import { createRouter } from "next-connect"
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller"

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandler);
 
async function getHandler(request, response) {
  let dbClient;
  try{
    dbClient = await database.getNewClient();
  
    const migrationsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
  
    const PendingMigrations = await migrationRunner(migrationsOptions);
    return response.status(200).json(PendingMigrations);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request, response) {
  let dbClient;
  try{
    dbClient = await database.getNewClient();

    const migrationsOptions = {
      dbClient: dbClient,
      dryRun: false,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const migratedMigrations = await migrationRunner(migrationsOptions);
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient?.end();
  }
}
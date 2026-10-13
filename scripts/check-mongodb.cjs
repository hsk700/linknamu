(async () => {
  const { default: nextEnv } = await import("@next/env");
  const { MongoClient } = await import("mongodb");
  nextEnv.loadEnvConfig(process.cwd());
  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    await client.db("linknamu").command({ ping: 1 });
    console.log("MongoDB connection OK");
  } catch (error) {
    console.error("MongoDB connection failed:", error.name, error.code || "");
    process.exitCode = 1;
  } finally {
    if (client) await client.close();
  }
})();

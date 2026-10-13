import { MongoClient, type Db } from "mongodb";

const mongo = globalThis as unknown as { _mongoClientPromise?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  if (!mongo._mongoClientPromise) {
    mongo._mongoClientPromise = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
      .connect().catch((error) => {
        mongo._mongoClientPromise = undefined;
        throw error;
      });
  }
  return (await mongo._mongoClientPromise).db("linknamu");
}

import mongoose from "mongoose";

let {
  MONGO_HOST = "localhost",
  MONGO_PORT = "27017",
  MONGO_USER,
  MONGO_PASS,
  MONGO_NAME = "bot",
  MONGODB_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/`
} = process.env;

if (MONGO_USER && MONGO_PASS && MONGO_HOST) {
  const user = encodeURIComponent(MONGO_USER);
  const pass = encodeURIComponent(MONGO_PASS);
  MONGODB_URI = `mongodb+srv://${user}:${pass}@${MONGO_HOST}/`;
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose cache
declare global {
  var mongooseCache: CachedConnection;
}

let cached: CachedConnection = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB
 * Uses caching to avoid multiple connections in development (Turbopack reloads)
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGO_NAME
    };

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        console.log("Connected to MongoDB");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;

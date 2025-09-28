import mongoose from "mongoose";

export async function connectToMongo(uri: string) {
  mongoose.set("strictQuery", true);
  mongoose.set("debug", true);
  await mongoose.connect(uri);
  console.log("[db] connected to MongoDB Atlas");
}

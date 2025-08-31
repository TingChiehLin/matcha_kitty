import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function getCandidates() {
  try {
    await client.connect();
    const db = client.db("matcha");
    const collection = db.collection("candidates");
    const candidates = await collection.find({}).toArray();
    return candidates;
  } catch (err) {
    console.error(err);
    return [];
  }
}

app.get("/api/candidates", async (req, res) => {
  const data = await getCandidates();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

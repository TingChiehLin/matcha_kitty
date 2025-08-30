// server.js
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
const PORT = 5000;

// 允许跨域请求
app.use(cors());

// 本地 MongoDB URI
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function getCandidates() {
  try {
    await client.connect();
    const db = client.db("matcha"); // 数据库名
    const collection = db.collection("candidates"); // 集合名
    const candidates = await collection.find({}).toArray();
    return candidates;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// API 路由
app.get("/api/candidates", async (req, res) => {
  const data = await getCandidates();
  res.json(data);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

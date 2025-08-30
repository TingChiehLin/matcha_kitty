const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  if (!client.isConnected()) await client.connect();
  return client.db("matcha");
}

module.exports = connectDB;
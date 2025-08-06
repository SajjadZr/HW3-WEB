const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

const DB_PATH = "db.json";

function readDB() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
  const data = readDB();
  res.json(data);
});

router.post("/", (req, res) => {
  const newItem = { id: uuidv4(), ...req.body };
  const data = readDB();
  data.push(newItem);
  writeDB(data);
  res.status(201).json(newItem);
});

router.put("/:id", (req, res) => {
  const data = readDB();
  const index = data.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).send("Not found");
  data[index] = { ...data[index], ...req.body };
  writeDB(data);
  res.json(data[index]);
});

router.delete("/:id", (req, res) => {
  const data = readDB();
  const newData = data.filter(p => p.id !== req.params.id);
  writeDB(newData);
  res.sendStatus(204);
});

module.exports = router;

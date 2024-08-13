const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

const db = {
  host: "localhost",
  user: "root",
  password: "2903",
  database: "todo_manager",
};

app.get("/tasks", (req, res) => {
  const dbs = mysql.createConnection(db);
  const query =
    "SELECT subject, description, date FROM logs WHERE complete = 0";
  dbs.query(query, (error, results) => {
    dbs.end();
    if (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json(results);
  });
});

app.put("/complete/:subject", (req, res) => {
  const dbs = mysql.createConnection(db);
  const { subject } = req.params;
  const query = `UPDATE logs SET complete = TRUE WHERE subject = ?`;
  dbs.query(query, [subject], (error, results) => {
    dbs.end();
    if (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    if (results.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Task not found" });
    }
  });
});

app.post("/submit", (req, res) => {
  const dbs = mysql.createConnection(db);
  const { subject, description, date_a } = req.body;
  const query = `INSERT INTO logs (subject, description, date) VALUES (?, ?, ?)`;
  dbs.query(query, [subject, description, date_a], (error) => {
    dbs.end();
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true });
  });
});

app.get("/archieve", (req, res) => {
  const dbs = mysql.createConnection(db);
  const query =
    "SELECT subject, description, date FROM logs WHERE complete = 1";
  dbs.query(query, (error, results) => {
    dbs.end();
    if (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json(results);
  });
});

app.delete("/delete/:subject", (req, res) => {
  const dbs = mysql.createConnection(db);
  const { subject } = req.params;
  const query = `DELETE FROM logs WHERE subject = ?`;

  dbs.query(query, [subject], (error, results) => {
    dbs.end();
    if (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    if (results.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Task not found" });
    }
  });
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(bodyParser.json());

let submissions: any[] = [];

const loadSubmissions = () => {
  try {
    const data = fs.readFileSync("db.json", "utf8");
    submissions = JSON.parse(data);
  } catch (error) {
    console.error("Error loading submissions:", error);
  }
};

const saveSubmissions = () => {
  try {
    fs.writeFileSync("db.json", JSON.stringify(submissions, null, 2));
  } catch (error) {
    console.error("Error saving submissions:", error);
  }
};

loadSubmissions();

app.get("/ping", (req, res) => {
  res.send(true);
});

app.post("/submit", (req, res) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  submissions.push({ name, email, phone, github_link, stopwatch_time });
  saveSubmissions();
  res.send({ success: true });
});

app.get("/read", (req, res) => {
  const index = parseInt(req.query.index as string);
  if (index >= 0 && index < submissions.length) {
    res.send({ ...submissions[index], total_submissions: submissions.length });
  } else {
    res.status(400).send({ error: "Index out of range" });
  }
});

app.delete("/delete", (req, res) => {
  const index = parseInt(req.query.index as string);
  if (index >= 0 && index < submissions.length) {
    submissions.splice(index, 1);
    saveSubmissions();
    res.send({ success: true });
  } else {
    res.status(400).send({ error: "Index out of range" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

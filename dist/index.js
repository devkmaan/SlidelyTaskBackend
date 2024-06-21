"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
let submissions = [];
const loadSubmissions = () => {
    try {
        const data = fs_1.default.readFileSync("db.json", "utf8");
        submissions = JSON.parse(data);
    }
    catch (error) {
        console.error("Error loading submissions:", error);
    }
};
const saveSubmissions = () => {
    try {
        fs_1.default.writeFileSync("db.json", JSON.stringify(submissions, null, 2));
    }
    catch (error) {
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
    const index = parseInt(req.query.index);
    if (index >= 0 && index < submissions.length) {
        res.send(Object.assign(Object.assign({}, submissions[index]), { total_submissions: submissions.length }));
    }
    else {
        res.status(400).send({ error: "Index out of range" });
    }
});
app.delete("/delete", (req, res) => {
    const index = parseInt(req.query.index);
    if (index >= 0 && index < submissions.length) {
        submissions.splice(index, 1);
        saveSubmissions();
        res.send({ success: true });
    }
    else {
        res.status(400).send({ error: "Index out of range" });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

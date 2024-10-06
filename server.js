
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
   
  );
});


app.get("/api/overlays", (req, res) => {
  db.all("SELECT * FROM overlays", (err, rows) => {
    res.json(rows);
  });
});

app.post("/api/overlays", (req, res) => {
  const { id, type, content, position, size } = req.body;
  db.run(
    "INSERT INTO overlays (id, type, content, x, y, width, height) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, type, content, position.x, position.y, size.width, size.height]
  );
  res.status(201).send("Overlay added");
});

app.put("/api/overlays/:id", (req, res) => {
  const { type, content, position, size } = req.body;
  db.run(
    "UPDATE overlays SET type = ?, content = ?, x = ?, y = ?, width = ?, height = ? WHERE id = ?",
    [type, content, position.x, position.y, size.width, size.height, req.params.id]
  );
  res.send("Overlay updated");
});

app.delete("/api/overlays/:id", (req, res) => {
  db.run("DELETE FROM overlays WHERE id = ?", [req.params.id]);
  res.send("Overlay deleted");
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

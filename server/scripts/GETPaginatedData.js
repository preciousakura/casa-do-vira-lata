const fs = require('fs')

function GETPaginatedData(req, res, path) {
  const page = Number(req.query.page);
  const size = Number(req.query.size);

  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const result = jsonData.items.slice(page * size, (page * size) + size);
      res.json({ items: result, total: jsonData.items.length });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = GETPaginatedData;

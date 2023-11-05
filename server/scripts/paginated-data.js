const fs = require('fs')

function paginatedData(req, res, path) {
  const page = Number(req.query.page ? req.query.page : 1);
  const size = Number(req.query.size ? req.query.size : 10);

  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    try {
      if((page - 1) < 0) return res.json({ items: [], total: 0 });
      const jsonData = JSON.parse(data);
      const result = jsonData.items.slice((page - 1) * size, ((page - 1) * size) + size);
      res.json({ items: result, total: jsonData.items.length });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = paginatedData;

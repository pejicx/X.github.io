import express from "express";

const app = express();
const PORT = 3000;

app.get("*", (req, res) => {
  res.send("<h1>PejicAIX Server is Running (JS)</h1><p>Time: " + new Date().toISOString() + "</p>");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Ultra Simple JS Server running on http://0.0.0.0:${PORT}`);
});

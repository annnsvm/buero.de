const router = require("express").Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend is healthy ✅" });
});

module.exports = router;

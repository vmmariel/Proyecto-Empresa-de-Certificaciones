const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { startQuiz, submitAnswers } = require("../controllers/questions.controller");

router.post("/start", verifyToken, startQuiz);

router.post("/submit", verifyToken, submitAnswers);

const path = require("path");
const fs = require("fs");

router.get("/certificado", (req, res) => {
  const filePath = req.query.path;

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).send("Certificado no encontrado");
  }

  res.download(filePath);
});

module.exports = router;

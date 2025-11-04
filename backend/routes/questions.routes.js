const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { startQuiz, submitAnswers, Certificado } = require("../controllers/questions.controller");

router.post("/start", verifyToken, startQuiz);

router.post("/submit", verifyToken, submitAnswers);

router.post("/certificado",verifyToken,Certificado)

const path = require("path");
const fs = require("fs");


module.exports = router;

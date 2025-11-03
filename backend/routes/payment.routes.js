// routes/payment.routes.js
const express = require("express");
const router = express.Router();
const { makePayment } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/", verifyToken, makePayment);

module.exports = router;

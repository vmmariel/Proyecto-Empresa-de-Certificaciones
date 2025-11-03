const express = require("express");
const router = express.Router();
const { enviarMensaje, obtenerMensajes } = require("../controllers/contacto.controller.js");

// Ruta para enviar mensaje (desde el formulario)
router.post("/contacto", enviarMensaje);

// Ruta opcional para obtener todos los mensajes
router.get("/contacto", obtenerMensajes);

module.exports = router;

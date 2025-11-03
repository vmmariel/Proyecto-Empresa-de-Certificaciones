const mensajes = require("../data/mensajes.js");

// Controlador para enviar mensaje
const enviarMensaje = (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body;

  // Validación básica
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  const nuevoMensaje = {
    nombre,
    email,
    telefono,
    mensaje,
  };

  mensajes.push(nuevoMensaje);

  console.log("Mensajes recibidos:");
  console.table(mensajes);

  res.status(200).json({ message: "Mensaje recibido correctamente" });
};

// Controlador para consultar todos los mensajes
const obtenerMensajes = (req, res) => {
  res.status(200).json(mensajes);
};

module.exports = { enviarMensaje, obtenerMensajes };

const mensajes = require("../data/mensajes.js");

// Controlador para enviar mensaje
const enviarMensaje = (req, res) => {
  try{
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
  } catch (error) {
    console.error("Error en enviarMensaje:", error);
    res.status(500).json({ message: "Error interno al enviar el mensaje." });
  }
};

// Controlador para consultar todos los mensajes
const obtenerMensajes = (req, res) => {
  try {
    // Si el arreglo está vacío, lo indicamos
    if (!mensajes || mensajes.length === 0) {
      return res.status(404).json({ message: "No hay mensajes registrados." });
    }

    res.status(200).json(mensajes);

  } catch (error) {
    console.error("Error en obtenerMensajes:", error);
    res.status(500).json({ message: "Error interno al obtener los mensajes." });
  }
};

module.exports = { enviarMensaje, obtenerMensajes };

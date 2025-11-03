const users = require("../data/users.json");
const { createSession, deleteSession } = require("../middleware/auth.middleware");

exports.login = (req, res) => {
  const { cuenta } = req.body || {};
  const contrasena = req.body?.contrasena ?? req.body?.["contraseña"];

  if (!cuenta || !contrasena) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: 'cuenta' y 'contrasena'.",
      ejemplo: { cuenta: "gina", contrasena: "1234" }
    });
  }

  const match = users.find(u => u.cuenta === cuenta && u.contrasena === contrasena);

  if (!match) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  const token = createSession(match.cuenta); 
  
  console.log(`[LOGIN] Usuario: ${match.cuenta} | Token: ${token} | Procede el login`);

  return res.status(200).json({
    mensaje: "Acceso permitido",
    usuario: { cuenta: match.cuenta, pago: match.pago, intento: match.intento },
    token: token 
  });
};

exports.logout = (req, res) => {
  const token = req.token; 
  const userId = req.userId; 

  console.log(`[LOGOUT] Usuario en sesión: ${userId} | Token: ${token} | Procede el logout`);

  const deleted = deleteSession(token);

  if (deleted) {
    return res.status(200).json({ 
      mensaje: "Sesión cerrada correctamente" 
    });
  } else {
    return res.status(404).json({ 
      error: "Sesión no encontrada" 
    });
  }
};

exports.getProfile = (req, res) => {
  const userId = req.userId; 

  const user = users.find(u => u.cuenta === userId);

  if (!user) {
    return res.status(404).json({ 
      error: "Usuario no encontrado" 
    });
  }

  return res.status(200).json({
    usuario: { 
      cuenta: user.cuenta 
    }
  });
};

exports.makePayment = (req, res) => {
    const user = users.find(u => u.cuenta === req.userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (user.pago === true) {
        return res.status(400).json({ mensaje: "Pago ya realizado" });
    }

    user.pago = true;

    res.status(200).json({ mensaje: "Pago realizado correctamente", pago: user.pago });
};

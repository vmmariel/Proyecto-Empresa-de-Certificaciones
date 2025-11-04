const express = require("express");
const authRoutes = require("./routes/auth.routes");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path")

app.use(express.json());

const ALLOWED_ORIGINS = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

app.use(cors({ 
  origin: function (origin, callback) {
    
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true); 
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

  optionsSuccessStatus: 200
}));

app.use("/api", authRoutes);

const questionsRoutes = require("./routes/questions.routes");
app.use("/api/questions", questionsRoutes);

const paymentRoutes = require("./routes/payment.routes");
app.use("/api/payment", paymentRoutes);

const contactoRoutes = require("./routes/contacto.routes");
app.use("/api", contactoRoutes);


// Aquí configuras la carpeta pública
app.use("/api/descargas", express.static(path.join(__dirname, "resources/certificados")));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

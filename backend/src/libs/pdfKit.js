const PDFDocument = require('pdfkit');
const fs = require("fs");
const path = require("path");

function generarCertificado({ nombreCompleto, fecha, ciudad }) {
  // Crear el documento
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 50,
  });

  // Ruta donde se guardará el PDF generado
  const outputPath = path.join(__dirname, `../../resources/certificados/${nombreCompleto.replace(/\s+/g, "_")}_Certificado.pdf`);

  // Crear carpeta si no existe
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Encabezado
  const logoPath = path.join(__dirname, "../../resources/logotipo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 60, 40, { width: 100 });
  }

  doc
    .fontSize(26)
    .fillColor("#171717")
    .text("LenCore", 180, 50)
    .fontSize(16)
    .text("Certificación Profesional", 180, 80)
    .moveDown(1);

  // Título central
  doc
    .fontSize(28)
    .fillColor("#0A74DA")
    .text("Certificado de Aprobación", { align: "center" })
    .moveDown(0.6);

  // Cuerpo
  doc
    .fontSize(16)
    .fillColor("black")
    .text("Por medio del presente, se certifica que:", { align: "center" })
    .moveDown(0.4);

  doc
    .fontSize(24)
    .fillColor("#0A74DA")
    .text(nombreCompleto, { align: "center", bold: true })
    .moveDown(0.6);

  doc
    .fontSize(16)
    .fillColor("black")
    .text(
      "Ha aprobado satisfactoriamente el examen de certificación en:",
      { align: "center" }
    )
    .moveDown(0.4);

  doc
    .fontSize(20)
    .fillColor("#0A74DA")
    .text("Certificación en C#", { align: "center" })
    .moveDown(1.5);

  // Detalles inferiores
  doc
    .fontSize(12)
    .fillColor("black")
    .text(`Fecha del examen: ${fecha}`, { align: "center" })
    .text(`Ciudad: ${ciudad}`, { align: "center" })
    .moveDown(1.3);

  // Firmas
  const firmaInstructor = path.join(__dirname, "../../resources/firma_instructor.jpeg");
  const firmaCEO = path.join(__dirname, "../../resources/firma_ceo.jpeg");

  const yFirmas = 400;

  if (fs.existsSync(firmaInstructor)) {
    doc.image(firmaInstructor, 150, yFirmas - 30, { width: 130 });
  }

  if (fs.existsSync(firmaCEO)) {
    doc.image(firmaCEO, 480, yFirmas -30, { width: 130 });
  }

  doc
    .fontSize(12)
    .text("Sofía de la Fuente", 160, yFirmas + 60)
    .text("Instructora", 190, yFirmas + 75)
    .text("Fatima Mariel Villalpando Mota", 490, yFirmas + 60)
    .text("CEO de LenCore", 530, yFirmas + 75);

  // Cierre
  doc
    .moveDown(2)
    .fontSize(9)
    .fillColor("gray")
    .text("© 2025 LenCore. Todos los derechos reservados.", { align: "center" });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

module.exports = { generarCertificado };

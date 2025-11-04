import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Ruta para enviar correos
app.post("/send-email", async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  // Configuración del transporte de correo (usa tu cuenta Gmail o similar)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // tu correo
      pass: process.env.EMAIL_PASS, // tu contraseña o app password
    },
  });

  const mailOptions = {
    from: correo,
    to: process.env.EMAIL_USER,
    subject: `Nuevo mensaje de ${nombre} - ÓpticaSami`,
    text: `
      Nombre: ${nombre}
      Correo: ${correo}
      Mensaje:
      ${mensaje}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ success: false, message: "Error al enviar el correo" });
  }
});

// Render usará este puerto automáticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`));


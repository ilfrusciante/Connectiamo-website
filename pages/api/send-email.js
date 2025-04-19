
// pages/api/send-email.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    try {
      // Logica placeholder per invio email (es: via SendGrid, Nodemailer, ecc.)
      console.log("Email ricevuta da:", name, email);
      console.log("Messaggio:", message);

      return res.status(200).json({ success: true, message: "Email inviata!" });
    } catch (error) {
      console.error("Errore invio email:", error);
      return res.status(500).json({ success: false, message: "Errore interno." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Metodo ${req.method} non consentito`);
  }
}

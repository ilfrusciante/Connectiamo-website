import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html, text, from, fromName } = req.body;

  // Validazione
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Configurazione SMTP per Office 365
    const transporter = nodemailer.createTransporter({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true per 465, false per altri porti
      auth: {
        user: 'info@connectiamo.com',
        pass: 'Galati.72',
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Opzioni email
    const mailOptions = {
      from: `"${fromName || 'Connectiamo'}" <${from || 'info@connectiamo.com'}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''), // Versione testo se non fornita
    };

    // Invia email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email inviata:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email inviata con successo'
    });

  } catch (error) {
    console.error('Errore nell\'invio email:', error);
    return res.status(500).json({ 
      error: 'Errore nell\'invio email',
      details: error.message 
    });
  }
}

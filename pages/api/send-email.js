import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html, text, from, fromName } = req.body;

  console.log('API send-email chiamata con:', { to, subject, from, fromName });

  // Validazione
  if (!to || !subject || !html) {
    console.error('Campi mancanti:', { to, subject, html });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Creazione transporter SMTP...');
    
    // Configurazioni SMTP alternative per GoDaddy con timeout ridotti
    const smtpConfigs = [
      {
        host: 'smtpout.secureserver.net',
        port: 587,
        secure: false,
        auth: {
          user: 'info@connectiamo.com',
          pass: 'Galati.72',
        },
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        connectionTimeout: 10000, // 10 secondi
        greetingTimeout: 10000,
        socketTimeout: 10000
      },
      {
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: true,
        auth: {
          user: 'info@connectiamo.com',
          pass: 'Galati.72',
        },
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
      },
      {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'info@connectiamo.com',
          pass: 'Galati.72',
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
      }
    ];

    let transporter;
    let lastError;

    // Prova diverse configurazioni SMTP
    for (const config of smtpConfigs) {
      try {
        console.log(`Tentativo con configurazione: ${config.host}:${config.port} (secure: ${config.secure})`);
        
        transporter = nodemailer.createTransport(config);

        // Verifica connessione con timeout
        await Promise.race([
          transporter.verify(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Verifica timeout')), 10000)
          )
        ]);
        
        console.log(`Connessione SMTP verificata con successo: ${config.host}:${config.port}`);
        break; // Se funziona, esci dal ciclo
        
      } catch (error) {
        console.log(`Fallita configurazione ${config.host}:${config.port}:`, error.message);
        lastError = error;
        continue;
      }
    }

    if (!transporter) {
      throw new Error(`Tutte le configurazioni SMTP sono fallite. Ultimo errore: ${lastError.message}`);
    }

    // Opzioni email
    const mailOptions = {
      from: `"${fromName || 'Connectiamo'}" <${from || 'info@connectiamo.com'}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''), // Versione testo se non fornita
    };

    console.log('Invio email con opzioni:', { to: mailOptions.to, subject: mailOptions.subject });

    // Invia email con timeout
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Invio email timeout')), 30000)
      )
    ]);

    console.log('Email inviata con successo:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email inviata con successo'
    });

  } catch (error) {
    console.error('Errore dettagliato nell\'invio email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });

    // Traduci gli errori SMTP in italiano
    let errorDetails = error.message;
    if (error.message.includes('Invalid login')) {
      errorDetails = 'Credenziali email non valide. Verifica username e password.';
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      errorDetails = 'Server email non trovato. Verifica la configurazione SMTP.';
    } else if (error.message.includes('EAUTH')) {
      errorDetails = 'Autenticazione email fallita. Verifica le credenziali.';
    } else if (error.message.includes('ECONNECTION')) {
      errorDetails = 'Impossibile connettersi al server email. Riprova più tardi.';
    } else if (error.message.includes('ETIMEDOUT')) {
      errorDetails = 'Timeout della connessione email. Riprova più tardi.';
    } else if (error.message.includes('ESOCKET')) {
      errorDetails = 'Errore di connessione al server email. Riprova più tardi.';
    } else if (error.message.includes('Verifica timeout')) {
      errorDetails = 'Timeout durante la verifica della connessione SMTP.';
    } else if (error.message.includes('Invio email timeout')) {
      errorDetails = 'Timeout durante l\'invio dell\'email. Riprova più tardi.';
    }

    return res.status(500).json({
      error: 'Errore nell\'invio email',
      details: errorDetails,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

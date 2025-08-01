// Integrazione con Brevo (ex-Sendinblue)
// https://www.brevo.com/

export async function sendEmail(emailContent) {
  // Se non hai configurato Brevo, questa funzione non farà nulla
  if (!process.env.BREVO_API_KEY) {
    console.log('Servizio email Brevo non configurato. Email che verrebbe inviata:', emailContent);
    return { success: true, message: 'Email simulata (Brevo non configurato)' };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: 'Connectiamo',
          email: process.env.FROM_EMAIL || 'noreply@connectiamo.com'
        },
        to: [
          {
            email: emailContent.to,
            name: emailContent.to.split('@')[0] // Usa la parte prima della @ come nome
          }
        ],
        subject: emailContent.subject,
        htmlContent: emailContent.html,
        textContent: emailContent.text || emailContent.html.replace(/<[^>]*>/g, ''), // Versione testo senza HTML
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Errore API Brevo: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Errore nell\'invio email tramite Brevo:', error);
    throw error;
  }
} 
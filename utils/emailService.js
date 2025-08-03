// Integrazione con SMTP di Office 365
// Configurazione per info@connectiamo.com

export async function sendEmail(emailContent) {
  try {
    // Usa l'API di Supabase per inviare email tramite SMTP
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailContent.to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text || emailContent.html.replace(/<[^>]*>/g, ''),
        from: 'info@connectiamo.com',
        fromName: 'Connectiamo'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Errore API SMTP: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Errore nell\'invio email tramite SMTP:', error);
    throw error;
  }
} 
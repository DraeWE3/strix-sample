const config = Object.freeze({
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  timeoutMs: 20000
});

function templateParams(inquiry) {
  return {
    to_email: 'info@strixproduction.com',
    name: inquiry.name,
    company: 'Not provided',
    email: inquiry.email,
    reason: inquiry.services.join(', ') || 'General enquiry',
    subject: `New project inquiry${inquiry.budget ? ` — ${inquiry.budget}` : ''}`,
    message: [
      inquiry.project,
      '',
      `Budget (USD): ${inquiry.budget || 'Not decided'}`,
      `Brief / reference: ${inquiry.brief || 'Not provided'}`
    ].join('\n')
  };
}

export async function sendInquiry(inquiry) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: config.publicKey,
        service_id: config.serviceId,
        template_id: config.templateId,
        template_params: templateParams(inquiry)
      }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('Your inquiry could not be delivered.');
    return true;
  } finally {
    clearTimeout(timeout);
  }
}

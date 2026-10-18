const config = Object.freeze({
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  timeoutMs: 20000
});

// The recipient is fixed in the EmailJS template (see emailjs/lead-template.html), never sent from the browser.
// One merge field per form input: {{name}} {{email}} {{services}} {{budget}} {{project}} {{brief}}.
export function templateParams(inquiry, captchaToken = '') {
  const services = inquiry.services.join(', ') || 'General enquiry';
  const params = {
    name: inquiry.name,
    email: inquiry.email,
    services,
    budget: inquiry.budget || 'Not decided',
    project: inquiry.project,
    brief: inquiry.brief || 'Not provided',
    subject: `New project inquiry${inquiry.budget ? ` — ${inquiry.budget}` : ''}`,
    // Legacy names kept so an older template still renders something.
    reason: services,
    message: inquiry.project
  };
  if (captchaToken) params['g-recaptcha-response'] = captchaToken;
  return params;
}

export async function sendInquiry(inquiry, { captchaToken = '', fetchImpl = fetch } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    const response = await fetchImpl(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: config.publicKey,
        service_id: config.serviceId,
        template_id: config.templateId,
        template_params: templateParams(inquiry, captchaToken)
      }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('Your inquiry could not be delivered.');
    return true;
  } finally {
    clearTimeout(timeout);
  }
}

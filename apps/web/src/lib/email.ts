const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@institutodalton.org.br";

interface EmailParams {
  to: string[];
  subject: string;
  html: string;
}

export async function sendEmail(params: EmailParams) {
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL] (no API key) To: ${params.to.join(",")} | Subject: ${params.subject}`);
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });
  } catch (err) {
    console.error("[EMAIL] Falha ao enviar:", err);
  }
}

export function emailTemplate(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:#1B5E34;color:white;padding:15px 20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0;font-size:16px">Instituto Dalton Salomão</h2>
        <p style="margin:4px 0 0;font-size:12px;opacity:0.8">Sistema de Gestão Patrimonial</p>
      </div>
      <div style="border:1px solid #ddd;border-top:none;padding:20px;border-radius:0 0 8px 8px">
        <h3 style="color:#1B5E34;margin-top:0">${title}</h3>
        ${body}
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
        <p style="font-size:11px;color:#999">
          Este é um e-mail automático do sistema de gestão patrimonial. Não responda a esta mensagem.
        </p>
      </div>
    </div>
  `;
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarCodigoVerificacao(email, nome, codigo) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Omar-404 — Confirme seu cadastro',
    html: `
      <div style="font-family:monospace;background:#0a0a0a;color:#e8e8e8;padding:32px;border-radius:8px;">
        <h2 style="color:#c8f560">Omar-404</h2>
        <p>Olá, <strong>${nome}</strong>.</p>
        <p>Seu código de confirmação é:</p>
        <div style="font-size:32px;font-weight:bold;color:#c8f560;letter-spacing:8px;margin:24px 0">
          ${codigo}
        </div>
        <p style="color:#666;font-size:12px">Expira em 15 minutos.</p>
      </div>
    `,
  });
}

module.exports = { enviarCodigoVerificacao };
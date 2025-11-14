const nodemailer = require("nodemailer");
const { GMAIL_USER, GMAIL_PASS } = process.env;

// Buat transporter Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

/**
 * Kirim email pengingat ke user
 * @param {string} to - Email penerima
 * @param {string} subject - Judul email
 * @param {string} text - Isi email
 */
async function sendReminderEmail(to, subject, text) {
  const mailOptions = {
    from: `"Learning Weekly Target" <${GMAIL_USER}>`,
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email terkirim ke ${to}: ${info.response}`);
  } catch (err) {
    console.error("Gagal mengirim email:", err);
  }
}

module.exports = { sendReminderEmail };
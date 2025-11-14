// Placeholder config for Gmail / Nodemailer. Replace with real credentials or OAuth2 setup.
module.exports = {
host: 'smtp.gmail.com',
port: 587,
secure: false,
auth: {
user: process.env.GMAIL_USER || 'your-email@gmail.com',
pass: process.env.GMAIL_PASS || 'your-app-password'
}
};
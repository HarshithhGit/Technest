const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Check if configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-gmail-app-password') {
      console.log('================ EMAIL LOG (Mock Mode) ================');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('Body:');
      console.log(html.replace(/<[^>]*>/g, '\n').trim());
      console.log('========================================================');
      return { success: true, mock: true };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"TechNest Projects" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email Dispatch Failed:', error.message);
    // Return success: false, but don't let it crash the controller flow
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };

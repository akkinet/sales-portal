import nodemailer from 'nodemailer'

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Your email provider's SMTP server (e.g., smtp.gmail.com)
    port: 587,                // Port for the SMTP server (usually 587 or 465)
    secure: false,             // Set to true if using port 465
    auth: {
        user: process.env.EMAIL_ID, // Your email address
        pass: process.env.EMAIL_PASS     // Your email password (or app password for Gmail)
    }
});

const sendMail = (to, subject, html) => {
    // Define email options
    const mailOptions = {
        from: process.env.EMAIL_ID,
        to,
        subject,
        html
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export default sendMail
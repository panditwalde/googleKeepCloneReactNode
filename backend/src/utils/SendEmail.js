import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email, resetLink) => {
    // Create a Nodemailer transporter using SMTP
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com', // Your Gmail username
            pass: 'your-password' // Your Gmail password
        }
    });

    // Define email options
    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click on the following link to reset your password: ${resetLink}`
    };

    try {
        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true; // Email sent successfully
    } catch (error) {
        console.error('Error sending email: ', error);
        return false; // Email sending failed
    }
};

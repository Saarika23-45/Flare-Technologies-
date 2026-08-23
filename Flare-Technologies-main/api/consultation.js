export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, phone, company, service, goal } = req.body;

        // Basic Backend Validation
        if (!name || !email || !service || !goal) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (goal.length > 2000) {
            return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
        }

        // Dynamically import dependencies for Serverless function
        const nodemailer = require('nodemailer');
        const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        const targetEmail = 'marketing@flaretechnologies.in';
        const targetWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // fallback to twilio sandbox if unspecified
        const destinationWhatsApp = 'whatsapp:+917899104311';

        // 1. Nodemailer Setup
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Standard SMTP connection (assumes Gmail/Workspace, configurable via env)
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const htmlEmailBody = `
            <h2>New Consultation Request – Flare Technologies</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p><strong>Primary Interest:</strong> ${service}</p>
            <br/>
            <h3>Goals & Challenges</h3>
            <p style="white-space: pre-wrap;">${goal}</p>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: targetEmail,
            subject: 'New Consultation Request – Flare Technologies',
            html: htmlEmailBody
        };

        // 2. Twilio WhatsApp Setup
        const twilioMessageTemplate = `🚨 *New Consultation Request*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone || 'N/A'}\n*Service:* ${service}\n\n*Goal:* ${goal.slice(0, 500)}${goal.length > 500 ? '...' : ''}`;

        // 3. Dispatch concurrently (don't block the UI if one hangs slightly longer)
        const dispatchPromises = [];

        // Gracefully attempt email dispatch
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            dispatchPromises.push(transporter.sendMail(mailOptions).catch(err => console.error("Nodemailer Error:", err)));
        } else {
            console.warn("EMAIL_USER or EMAIL_PASS not set in Vercel. Skipping Email dispatch.");
        }

        // Gracefully attempt Twilio dispatch
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            dispatchPromises.push(
                twilioClient.messages.create({
                    from: targetWhatsApp,
                    to: destinationWhatsApp,
                    body: twilioMessageTemplate
                }).catch(err => console.error("Twilio Error:", err))
            );
        } else {
            console.warn("Twilio credentials not set in Vercel. Skipping WhatsApp dispatch.");
        }

        // Await resolutions
        await Promise.allSettled(dispatchPromises);

        // Always return success to FRONTEND so the UI updates natively, even if backend notification configurations are missing keys initially.
        return res.status(200).json({ success: true, message: 'Consultation request processed.' });

    } catch (error) {
        console.error('Book Consultation API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

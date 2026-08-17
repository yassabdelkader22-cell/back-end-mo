// controllers/contactController.js
const transporter = require('../config/email.config');

// ========== إرسال رسالة الاتصال ==========
exports.sendContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // التحقق من وجود البيانات
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: '❌ Tous les champs sont requis'
            });
        }

        // البريد الإلكتروني للمالك (مستلم الرسالة)
        const ownerEmail = process.env.OWNER_EMAIL || 'mtagebaudeservice@gmail.com';

        // إعداد البريد الإلكتروني
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: ownerEmail,
            subject: `📩 Nouveau message de contact - ${name}`,
            replyTo: email,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #f7971e, #ffd200); padding: 20px; border-radius: 10px 10px 0 0; text-align: center; color: #000; }
                        .header h2 { margin: 0; }
                        .content { padding: 20px; }
                        .field { margin-bottom: 15px; }
                        .field-label { font-weight: bold; color: #333; }
                        .field-value { color: #555; margin-top: 5px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
                        .footer { text-align: center; padding: 15px; color: #888; font-size: 12px; border-top: 1px solid #eee; margin-top: 20px; }
                        .badge { display: inline-block; background: #4caf50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>📩 Nouveau message de contact</h2>
                            <span class="badge">MTA Gebäudeservice</span>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="field-label">👤 Nom complet</div>
                                <div class="field-value">${name}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">📧 Email</div>
                                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                            </div>
                            <div class="field">
                                <div class="field-label">💬 Message</div>
                                <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>📅 Reçu le ${new Date().toLocaleString('fr-FR')}</p>
                            <p>© 2026 MTA Gebäudeservice - Tous droits réservés</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                📩 Nouveau message de contact
                
                👤 Nom: ${name}
                📧 Email: ${email}
                💬 Message: ${message}
                
                ---
                Reçu le ${new Date().toLocaleString('fr-FR')}
                MTA Gebäudeservice
            `
        };

        // إرسال البريد الإلكتروني
        await transporter.sendMail(mailOptions);

        // إرسال نسخة تأكيد للعميل
        const clientMailOptions = {
            from: `"MTA Gebäudeservice" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '✅ Confirmation de réception - MTA Gebäudeservice',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                        .container { max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #f7971e, #ffd200); padding: 20px; border-radius: 10px 10px 0 0; text-align: center; color: #000; }
                        .content { padding: 20px; text-align: center; }
                        .check { font-size: 60px; color: #4caf50; }
                        .footer { text-align: center; padding: 15px; color: #888; font-size: 12px; border-top: 1px solid #eee; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>✅ Message reçu !</h2>
                        </div>
                        <div class="content">
                            <div class="check">✅</div>
                            <h3>Bonjour ${name},</h3>
                            <p>Nous avons bien reçu votre message.</p>
                            <p>Nous vous répondrons dans les plus brefs délais.</p>
                            <p style="color: #888; font-size: 14px; margin-top: 20px;">
                                <strong>Votre message :</strong><br>
                                "${message}"
                            </p>
                        </div>
                        <div class="footer">
                            <p>© 2026 MTA Gebäudeservice - Tous droits réservés</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                ✅ Message reçu !
                
                Bonjour ${name},
                
                Nous avons bien reçu votre message.
                Nous vous répondrons dans les plus brefs délais.
                
                Votre message :
                "${message}"
                
                ---
                MTA Gebäudeservice
            `
        };

        await transporter.sendMail(clientMailOptions);

        res.json({
            success: true,
            message: '✅ Message envoyé avec succès'
        });

    } catch (error) {
        console.error('Erreur email:', error);
        res.status(500).json({
            success: false,
            message: '❌ Erreur lors de l\'envoi du message'
        });
    }
};
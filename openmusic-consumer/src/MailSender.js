const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        this.sendEmail = this.sendEmail.bind(this)
    }

    sendEmail(targetEmail, content) {
        const message = {
            from: '"Open Music" <duw4ng@gmail.com>',
            to: targetEmail,
            subject: 'Export Playlist',
            text: 'Terlampir adalah hasil export dari playlist yang dipilih :)',
            attachments: [
                {
                    filename: 'playlist.json',
                    content,
                },
            ],
        };

        return this._transporter.sendMail(message)
    }

}

module.exports = MailSender;

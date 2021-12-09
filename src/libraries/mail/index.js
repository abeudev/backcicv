const fs = require('fs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const config = require('../../config');
class Mail {
    constructor() {
        this.sender = config.mail.user;
        this.receivers = '';
        this.subject = '';
        this.html = '<h1> Hello World </h1>';
        this.attachments = [];

        this.transporter = nodemailer.createTransport({
            service : 'gmail',
            host : 'smtp.ethereal.email',
            port : 587,
            secure : false,
            auth : config.mail
        });
    }

    /**
     * set mail sender
     *
     * @param String sender
     * */
    set_sender(sender) {
        this.sender = sender;
    }

    /**
     * set mail subject
     *
     * @param String subject
     * */
    set_subject(subject) {
        this.subject = subject;
    }

    /**
     * set mail receivers
     * separate multiple email address with comma (,)
     *
     * @param String receivers
     * */
    set_receivers(receivers) {
        this.receivers = receivers;
    }

    /**
     * set mail html content
     * @param {Object} data
     * @param {String} html
     * */
    set_html_content(data, html) {
        const template = handlebars.compile(html);
        const htmlToSend = template(data);
        this.html = htmlToSend;
    }

    /**
     *
     * send mail
     *
     * */
    send(callback) {
        const data = {
            from : this.sender,
            to : this.receivers,
            subject : this.subject,
            html : this.html,
            attachments : this.attachments
        };
        this.transporter.sendMail(data, callback);
    }

    /**
     * Read HTML File
     * @param {String} path
     */
    read_html_file(path) {
        return fs.readFileSync(path, { encoding:'utf8', flag:'r' });
    }

    message() {
        return {
            from : this.sender,
            to : this.receivers,
            subject : this.subject,
            html : this.html,
            attachments : this.attachments
        };
    }
}


module.exports = Mail;
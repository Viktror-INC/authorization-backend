import { TransportOptions, createTransport } from "nodemailer";

const configOptions = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user:  process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

class MailService {
  transporter = createTransport(configOptions as TransportOptions);

  constructor() {}

  async sendACtivationMail(to, link) {
    await this.transporter.sendMail({
      from:  process.env.SMTP_USER, // sender address
      to, // list of receivers
      subject: "Activation" + process.env.API_URL, // Subject line
      text: "", // plain text body
      html: `
      <div>
        <h1>For activation follow link</h1>
        <a href="${link}">${link}</a>
      </div>`, // html body
    });
  }
}

export default new MailService();

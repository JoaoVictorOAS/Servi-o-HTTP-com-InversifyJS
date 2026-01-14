
import { injectable } from "inversify";
import nodemailer from "nodemailer";
import { Mailer } from "../../domain/mailer";

@injectable()
export class EtherealMailer implements Mailer {
  async send(to_address: string, email_subject: string, email_body: string): Promise<void> {
    const test_account = await nodemailer.createTestAccount();

    const email_transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: test_account.user,
        pass: test_account.pass,
      },
    });

    const sent_email_info = await email_transporter.sendMail({
      from: '"Seu Nome: " <seu_email@example.com>',
      to: to_address,
      subject: email_subject,
      text: email_body,
    });

    console.log("Mensagem enviada: %s", sent_email_info.messageId);
    console.log("URL de visualização: %s", nodemailer.getTestMessageUrl(sent_email_info));
  }
}

@injectable()
export class SmtpMailer implements Mailer {
  private _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send(to_address: string, email_subject: string, email_body: string): Promise<void> {
    await this._transporter.sendMail({
      from: '"Seu Nome: " <seu_email@example.com>',
      to: to_address,
      subject: email_subject,
      text: email_body,
    });
  }
}

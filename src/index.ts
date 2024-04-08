import express, { Application } from "express";
import path from "path";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface EmailConfig {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  name: string;
  address: string;
  to: string;
  subject: string;
  text: string;
}

class Main {
  private config: EmailConfig;
  private server: Application;

  constructor(config: EmailConfig) {
    this.config = config;
    this.server = express();
  }

  listen() {
    this.server.listen(3000, () => console.log("Server is running"));
  }

  private createTransporter(): Transporter {
    return nodemailer.createTransport({
      service: this.config.service,
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.username,
        pass: this.config.password,
      },
    });
  }

  private createMailOptions(): SendMailOptions {
    return {
      from: {
        name: this.config.name,
        address: this.config.address,
      },
      to: this.config.to,
      subject: this.config.subject,
      text: this.config.text,
      attachments: [
        {
          filename: path.join(__dirname, "/confia.jpeg"),
          content: "image/jpeg",
        },
      ],
    };
  }

  async sendMail() {
    const transporter = this.createTransporter();
    const mailOptions = this.createMailOptions();

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Message sent: ${info.messageId}`);
    } catch (error) {
      console.error("Error occurred: ", error);
    }
  }
}

const emailConfig: EmailConfig = {
  service: process.env.SERVICE!,
  host: process.env.HOST!,
  port: Number(process.env.PORT),
  secure: Boolean(process.env.SECURE),
  username: process.env.AUTH_USER!,
  password: process.env.AUTH_PASS!,
  name: process.env.FROM_NAME!,
  address: process.env.FROM_ADDRESS!,
  to: process.env.TO!,
  subject: process.env.SUBJECT!,
  text: process.env.TEXT!,
};

const main = new Main(emailConfig);
main.sendMail();

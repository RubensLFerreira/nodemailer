import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as nodemailer from "nodemailer";

dotenv.config();

const server = express();

class Main {
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

  constructor(
    service: string,
    host: string,
    port: number,
    secure: boolean,
    username: string,
    password: string,
    name: string,
    address: string,
    to: string,
    subject: string,
    text: string
  ) {
    this.service = service;
    this.host = host;
    this.port = port;
    this.secure = secure;
    this.username = username;
    this.password = password;
    this.name = name;
    this.address = address;
    this.to = to;
    this.subject = subject;
    this.text = text;
  }

  start() {
    server.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }

  get transporter() {
    const transporter = nodemailer.createTransport({
      service: this.service,
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.username,
        pass: this.password,
      },
    });

    return transporter;
  }

  get mailOption() {
    const mailOptions = {
      from: {
        name: this.name,
        address: this.address,
      },
      to: this.to,
      subject: this.subject,
      text: this.text,
      attachments: [
        {
          filename: path.join(__dirname, "/confia.jpeg"),
          content: "image/jpeg",
        },
      ],
    };

    return mailOptions;
  }

  async sendMail(
    transporter: nodemailer.Transporter,
    mailOptions: nodemailer.SendMailOptions
  ) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error occurred: ", error);
    }
  }
}

const main = new Main(
  process.env.SERVICE!,
  process.env.HOST!,
  Number(process.env.PORT),
  Boolean(process.env.SECURE),
  process.env.AUTH_USER!,
  process.env.AUTH_PASS!,
  process.env.FROM_NAME!,
  process.env.FROM_ADDRESS!,
  process.env.TO!,
  process.env.SUBJECT!,
  process.env.TEXT!
);

main.sendMail(main.transporter, main.mailOption);

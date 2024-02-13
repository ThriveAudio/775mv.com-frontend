// @ts-nocheck
import { getDocument } from "./mongo"
const nodemailer = require("nodemailer")
const nunjucks = require("nunjucks")

export async function sendEmail(to, subject, html) {

  const config = await getDocument('config', {'type': 'config'})

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thriveaudiollc@gmail.com",
      pass: config['gmail'],
    },
  })

  var mailOptions = {
    from: "thriveaudiollc@gmail.com",
    to: to,
    subject: subject,
    html: html,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  })

}

export function sendTemplate(to, subject, template, args) {
  nunjucks.configure('app/api/templates/', { autoescape: true })
  const render = nunjucks.render(template, args);
  sendEmail(to, subject, render)
}

import nodemailer from "nodemailer";

export async function sendEmail(to,subject,html) {
const transport= nodemailer.createTransport({
  service:'gmail',
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAILSENDER,
    pass: process.env.PASSWORDSENDER,
  },
});

  const info = await transport.sendMail({
    from:`myhous <${process.env.EMAILSENDER}>`,
    to,
    subject,
    html
  });

return info;
}
  
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(
  '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',
);
const msg = {
  to: 'laura271260@gmail.com',
  from: 'laura271260@gmail.com',
  subject: 'Trying send email',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then((response) => console.log('Email sent'))
  .catch((e) => console.log(e.message));

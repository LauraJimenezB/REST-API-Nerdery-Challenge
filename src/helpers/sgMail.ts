import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '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');

const msg = {
  to: 'diana@ravn.co',
  from: 'dianaordonez1998@gmail.com',
  subject: 'Trying send email',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then((response) => console.log('Email sent', response))
  .catch((e) => console.log(e.message))

// (async () => {
//   try {
//     const result = await sgMail.send(msg);
//     console.log(result)
//   } catch(e) {
//     console.error(e)
//     if(e.response) {
//       console.error(e.response.body)
//     }
//   }
// })();
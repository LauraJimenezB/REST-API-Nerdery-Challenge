import { PrismaClient, TokenType, User } from '@prisma/client';
import {
  newToken,
  validatePassword,
  verifyToken,
  encryptPassword,
} from '../helpers/handlerPasswordAndToken';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SigninUserDto } from '../dtos/signin-user.dto';
import createError from 'http-errors';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const prisma = new PrismaClient();

// Generate a random 8 digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

async function sendEmailToken(email: string, token: string): Promise<void>{
  const msg = {
    to: email,
    from: 'diana@ravn.co', // Use the email address or domain you verified above
    subject: 'Confirm email',
    html: `http://localhost:3000/users/${token}/confirm`,
  };

  await sgMail.send(msg)

}

export async function sendConfirmToken(user: CreateUserDto): Promise<void> {
  const emailToken = generateEmailToken();
  const encryptedPass = await encryptPassword(user.password);
  const tokenExpiration = new Date()
  
  await prisma.token.create({
    data: {
      emailToken,
      type: TokenType.EMAIL,
      expiration: tokenExpiration,
      user: {
        connectOrCreate: {
          create: {
            username: user.username,
            email: user.email,
            password: encryptedPass
          },
          where: {
            email: user.email,
          },
        },
      },
    },
  })
  
  await sendEmailToken(user.email, emailToken)

}

export async function uniqueEmail(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) return false;
  return true;
}

export async function confirmEmailService(idTokeEmail: string): Promise<User> {

  const isExistToken = await prisma.token.findUnique({
    where: {
      emailToken: idTokeEmail
    }
  })

  if(!isExistToken) throw createError(400, 'Token not exists');

  const user = await prisma.user.update({
    where: {
      id: isExistToken.userId
    },
    data: {
      confirmedAt: new Date()
    }
  })

  const token = newToken(user.id);
  const newUser = { ...user, token };

  return Promise.resolve(newUser);

}

export async function signUpService(body: CreateUserDto): Promise<void> {
  await body.isValid();
  const validEmail = await uniqueEmail(body.email);

  if (!validEmail)
  throw new createError(400, 'This email is already registered');

  await sendConfirmToken(body);
  
}

export async function signInService(body: SigninUserDto): Promise<User> {
  await body.isValid();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) throw new createError(404, 'Not found user');

  const isPasswordMatching = await validatePassword(
    body.password,
    user.password,
  );

  if (!isPasswordMatching) throw new createError(400, 'Invalid password');

  const token = newToken(user.id);
  const newUser = { ...user, token };
  return Promise.resolve(newUser);
}

export async function protectService(
  authorization: string | undefined,
): Promise<User> {
  if (!authorization || authorization === undefined || authorization === null)
    throw new createError(401, 'Login credentials are required to access');
  //console.log('authorization', authorization);
  const token = authorization.split('Bearer')[1];

  if (!token)
    throw new createError(401, 'Login credentials are required to access');

  const payload = await verifyToken(token);
  const user = await prisma.user.findUnique({
    where: {
      id: Number(payload.id),
    },
  });

  if (!user) throw new createError(404, 'Not found user');

  return user;
  //req.body.user = user;
}

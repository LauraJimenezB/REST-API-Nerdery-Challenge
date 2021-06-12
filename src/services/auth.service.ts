import { PrismaClient, User } from '@prisma/client';
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

export async function uniqueEmail(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) return false;
  return true;
}

export async function signUpService(body: CreateUserDto): Promise<User> {
  await body.isValid();
  const validEmail = await uniqueEmail(body.email);

  if (!validEmail)
    throw createError(400, 'This email is already registered');
  const encryptedPass = await encryptPassword(body.password);
  const user = await prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      password: encryptedPass,
    },
  });
  const token = newToken(user.id);
  const newUser = { ...user, token };

  /* const msg = {
    to: body.email,
    from: 'diana@ravn.co', // Use the email address or domain you verified above
    subject: 'Confirm email',
    html: `localhost:3000/users/${token}/confirm`,
  };

  sgMail
  .send(msg)
  .then((result) => {
    console.log(result)
  }, error => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }); */

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      tokenConfirm: token,
    }
  })
  console.log('updatedUser', updatedUser);

  return Promise.resolve(newUser);
}

export async function signInService(body: SigninUserDto): Promise<User> {
  await body.isValid();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) throw createError(404, 'Not found user');

  const isPasswordMatching = await validatePassword(
    body.password,
    user.password,
  );

  if (!isPasswordMatching) throw createError(400, 'Invalid password');

  const token = newToken(user.id);
  const newUser = { ...user, token };
  return Promise.resolve(newUser);
}

export async function protectService(
  authorization: string | undefined,
): Promise<User> {
  if (!authorization || authorization === undefined || authorization === null)
    throw createError(401, 'Login credentials are required to access');
  //console.log('authorization', authorization);
  const token = authorization.split('Bearer')[1];

  if (!token)
    throw createError(401, 'Login credentials are required to access');

  const payload = await verifyToken(token);
  const user = await prisma.user.findUnique({
    where: {
      id: Number(payload.id),
    },
  });

  if (!user) throw createError(404, 'Not found user');

  return user;
  //req.body.user = user;
}

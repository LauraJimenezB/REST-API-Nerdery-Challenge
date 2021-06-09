// import { NextFunction, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { encryptPassword, validatePassword, newToken, verifyToken } from './handlerPasswordAndToken';

// const prisma = new PrismaClient();

// const notRepiteEmail = async (email: string): Promise<boolean> => {
//   const user = await prisma.user.findUnique({
//     where: {
//       email: email,
//     },
//   });
//   if (!user) return true;
//   return false;
// };

// export const signup = async (req: Request, res: Response) => {
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).json('Email and password required');
//   }
 
//   try {
//     if ( await notRepiteEmail(req.body.email)) {
//       req.body.password = await encryptPassword(req.body.password);
//       const savedUser = await prisma.user.create({
//         data: {
//           username: req.body.username,
//           email: req.body.email,
//           password: req.body.password,
//         },
//       });

//       const token: string = newToken(savedUser);
//       return res.status(200).send({ token });

//     } else {
//       return res.status(400).json('The email already exists');
//     }
//   } catch (e) {
//     //console.log(e);
//     return res.status(400).end();
//   }
// };

// export const signin = async (req: Request, res: Response) => {
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).json('Email and password required');
//   }

//   const user = await prisma.user.findUnique({
//     where: {
//       email: req.body.email,
//     },
//   });

//   if (!user) return res.status(400).json('Email or password is wrong');
//   const isPasswordMatching: boolean = await validatePassword(
//     req.body.password,
//     user.password,
//   );

//   try {
//     if (!isPasswordMatching) return res.status(400).json('Invalid password');

//     const token: string = newToken(user);
//     return res.status(201).send({ token });
//   } catch (e) {
//     console.error(e);
//     return res.status(400).json('Not auth');
//   }
// };

// //manejar cuando se repite el correo al login

// export const protect = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   if (!req.headers.authorization) {
//     return res.status(401).end();
//   }

//   const token = req.headers.authorization.split('Bearer')[1];

//   if (!token) {
//     return res.status(401).end();
//   }

//   try {
//     const payload = await verifyToken(token);

//     const user = await prisma.user.findUnique({
//       where: {
//         id: payload.id,
//       },
//     });
//     //res.status(200).send({user});
//     //res.json(user);
//     req.body.user = user;
//     next();
//   } catch (e) {
//     console.error(e);
//     return res.status(401).json(e);
//   }
// };

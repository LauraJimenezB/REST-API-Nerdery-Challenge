import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  password: string;
}

export const encryptPassword = async(password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt)
}

// async function validatePassword(password: string):Promise<boolean>{
//   return await bcrypt.compare(password, this.password)
// }
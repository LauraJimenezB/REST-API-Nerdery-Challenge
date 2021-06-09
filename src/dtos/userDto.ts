import bcrypt from 'bcryptjs';

// export class UserDto {
//   id: number;
//   username: string;
//   email: string

//   constructor(id: number, username: string, email: string) {
//     this.id = id;
//     this.username = username;
//     this.email = email;
//   }
// }

export class UserDto {
  constructor(
    public id: number,
    public username: string,
    public email: string,
  ) { }
}

export interface IUser {
  id: number;
  username: string;
  email: string;
}

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export async function validatePassword(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

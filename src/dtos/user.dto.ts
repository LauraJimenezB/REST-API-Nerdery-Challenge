// export class UserDto {
//   constructor(
//     public id: number,
//     public username: string,
//     public email: string,
//     public password: string
//   ) {}
// }
import { Expose, Exclude } from 'class-transformer'

export class UserDto {
  id                :number       
  username          :string
  email             :string
  @Exclude()
  password          :string
  role              :string
  @Exclude()
  confirmedAt       : Date
  @Exclude()
  emailIsPublic     :boolean
  @Exclude()
  fullname          :string
  @Exclude()
  fullnameIsPublic  :boolean
  @Exclude()
  bio               :string
  @Exclude()
  comments          :string[]
  @Exclude()
  posts             :string[]
  token             :string
}

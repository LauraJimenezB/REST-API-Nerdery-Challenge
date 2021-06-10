import createError from 'http-errors';
import { validate, ValidationError } from 'class-validator';

export class BaseDto {
  async isValid(): Promise<boolean> {
    const errors = await validate(this)
    console.log('errors', errors)
    const badRequest = new createError.BadRequest()

    if (errors.length > 0) {
      //console.log('errors', errors);
      throw createError(badRequest.statusCode, badRequest.name, {
        errors: errors.map((e: ValidationError) => ({
          property: e.property,
          constraints: this.getConstraints(e),
        })),
      })
    }

    return true
  }

  private getConstraints(error: ValidationError): string[] {
    if (error?.children?.length) {
      return this.getConstraints(error.children[0])
    }

    return Object.values(error.constraints ?? {})
  }
}

// Errors:  [
//    ValidationError {
//      target: UserDto { username: 'fredy', email: 'abc', password: 'password' },
//      value: 'abc',
//      property: 'email',
//      children: [],
//      constraints: { isEmail: 'email must be an email' }
//    }
//  ]
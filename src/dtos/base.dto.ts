import createError from 'http-errors';
import { validate, ValidationError } from 'class-validator';

export class BaseDto {
  async isValid(): Promise<boolean> {
    const errors = await validate(this)
    //console.log('errors', errors)
    const badRequest = new createError.BadRequest()
   
    if (errors.length > 0) {
      //console.log('errors', errors);
      throw createError(badRequest.statusCode, badRequest.name, {
        errors: errors.map((e: ValidationError) => ({
          property: e.property,
          constraints: Object.values(e.constraints).toString(),
        })),
      })
    }

    return true
  }

}

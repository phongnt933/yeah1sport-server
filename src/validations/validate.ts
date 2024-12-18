import {
  validate as baseValidate,
  EvOptions,
  schema,
} from 'express-validation';
import { ValidationOptions } from 'joi';
import { RequestHandler } from 'express';

const evOptions: EvOptions = {
  context: true,
  keyByField: true,
};

const validate = (
  schema: schema,
  options: ValidationOptions = {},
): RequestHandler => {
  return baseValidate(schema, evOptions, options);
};

export default validate;

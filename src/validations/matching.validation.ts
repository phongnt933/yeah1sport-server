import { Joi, schema } from "express-validation";

import validate from "./validate";

const createMatching: schema = {
  body: Joi.object({
    bookingId: Joi.string().required(),
    quantity: Joi.number().required(),
    message: Joi.string().required(),
  }),
};

export const matchingValidation = {
  createMatching: validate(createMatching),
};

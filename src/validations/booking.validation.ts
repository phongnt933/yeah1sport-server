import { Joi, schema } from 'express-validation';

import validate from './validate';

const equipmentSchema = Joi.object({
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
}).required();

const createBooking: schema = {
  body: Joi.object({
    fieldId: Joi.string().required(),
    fieldPrice: Joi.number().positive().required(),
    totalAmount: Joi.number().positive().required(),
    date: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    equipments: Joi.array().when(Joi.array().min(1), {
      then: Joi.array().items(equipmentSchema),
      otherwise: Joi.array().empty(),
    }),
  }),
};

const captureBooking: schema = {
  body: Joi.object({
    orderId: Joi.string().required(),
  }),
};

export const bookingValidation = {
  createBooking: validate(createBooking),
  captureBooking: validate(captureBooking),
};

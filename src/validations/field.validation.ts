import { Joi, schema } from 'express-validation';

import validate from './validate';
import { IBaseField } from '../@types';
import { FIELD_TYPE } from '../constants';

const equipmentSchema = Joi.object({
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
}).required();

const createField: schema = {
  body: Joi.object<IBaseField>({
    name: Joi.string().required(),
    specificAddress: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
    phone: Joi.string().required(),
    type: Joi.string()
      .valid(
        FIELD_TYPE.SOCCER,
        FIELD_TYPE.BADMINTON,
        FIELD_TYPE.PICKER_BALL,
        FIELD_TYPE.TABLE_TENNIS,
        FIELD_TYPE.TENNIS,
      )
      .required(),
    capacity: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
    equipments: Joi.array().when(Joi.array().min(1), {
      then: Joi.array().items(equipmentSchema),
      otherwise: Joi.array().empty(),
    }),
  }),
};

export const fieldValidation = {
  createField: validate(createField),
};

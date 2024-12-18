import { Joi, schema } from 'express-validation';

import validate from './validate';
import { ROLE, USER_STATUS } from '../constants';
import { IBaseUser } from '../@types';

const createCustomer: schema = {
  body: Joi.object<IBaseUser>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
  }),
};
const createCMSUser: schema = {
  body: Joi.object<IBaseUser>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string()
      .valid(...Object.values(ROLE))
      .required(),
    phone: Joi.string().required(),
  }),
};

const loginUser: schema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const getListUsers: schema = {
  params: Joi.object({
    email: Joi.string(),
    phone: Joi.string(),
    role: Joi.string().valid(...Object.values(ROLE)),
    page: Joi.number(),
    records: Joi.number(),
  }),
};

const getUser: schema = {
  query: Joi.object({
    uid: Joi.string(),
  }),
};

const updateUser: schema = {
  query: Joi.object({
    uid: Joi.string(),
  }),
  body: Joi.object({
    password: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    role: Joi.string().valid(...Object.values(ROLE)),
    status: Joi.string().valid(...Object.values(USER_STATUS)),
    phone: Joi.string(),
  }),
};

const deleteUser: schema = {
  query: Joi.object({
    id: Joi.string(),
  }),
};

export const userValidation = {
  createCustomer: validate(createCustomer),
  createCMSUser: validate(createCMSUser),
  getUser: validate(getUser),
  getListUsers: validate(getListUsers),
  loginUser: validate(loginUser),
  updateUser: validate(updateUser),
  deleteUser: validate(deleteUser),
};

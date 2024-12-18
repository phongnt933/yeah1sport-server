import { Document } from 'mongoose';
import { ROLE, USER_STATUS } from '../constants';

export interface IBaseUser {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: ROLE;
  status: USER_STATUS;
}

export interface IUserDoc extends IBaseUser, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserQuery {
  email?: string;
  page?: number;
  record?: number;
  role?: string;
  status?: string;
}

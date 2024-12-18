import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IUserDoc } from '../@types';
import { ROLE, USER_STATUS } from '../constants';
import { hashBcrypt } from '../utils';

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => uuidv4(),
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ROLE.ADMIN, ROLE.CUSTOMER, ROLE.FIELD_OWNER, ROLE.REFEREE],
    },
    status: {
      type: String,
      enum: [USER_STATUS.LOCKED, USER_STATUS.ACTIVE],
      default: USER_STATUS.ACTIVE,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

UserSchema.pre('save', async function save(next) {
  try {
    const user = this as unknown as IUserDoc;
    if (!user.isModified('password')) {
      next();
      return;
    }
    const hash = await hashBcrypt(user.password);
    this.password = hash;
    next();
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export const User = model<IUserDoc>('user', UserSchema);

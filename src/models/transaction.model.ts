import { Schema, model } from 'mongoose';

import { v4 as uuidv4 } from 'uuid';
import { PAYMENT_METHOD, TRANSACTION_STATUS } from '../constants/transaction';
import { ITransactionDoc } from '../@types';
import { number } from 'joi';

const TransactionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => uuidv4(),
    },
    bookingId: { type: String, index: true, ref: 'Booking', required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        TRANSACTION_STATUS.APPROVED,
        TRANSACTION_STATUS.CANCELLED,
        TRANSACTION_STATUS.COMPLETED,
        TRANSACTION_STATUS.CREATED,
        TRANSACTION_STATUS.VOIDED,
      ],
      default: TRANSACTION_STATUS.CREATED,
    },
    paymentMethod: {
      type: String,
      enum: [PAYMENT_METHOD.PAYPAL],
      default: PAYMENT_METHOD.PAYPAL,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Transaction = model<ITransactionDoc>(
  'transaction',
  TransactionSchema,
);

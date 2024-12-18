import { Document } from 'mongoose';
import { PAYMENT_METHOD, TRANSACTION_STATUS } from '../constants';

export interface IBaseTransaction {
  bookingId: string;
  orderId: string;
  amount: number;
  status: TRANSACTION_STATUS;
  paymentMethod?: PAYMENT_METHOD;
}

export interface ITransactionDoc extends IBaseTransaction, Document {
  paymentMethod: PAYMENT_METHOD;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionQuery {
  page?: number;
  record?: number;
}

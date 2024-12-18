import { Document } from 'mongoose';
import { BOOKING_STATUS } from '../constants/booking';

export interface IBoughtEquipment {
  name: string;
  price: number;
  count: number;
}

export interface IBaseBooking {
  fieldId: string;
  orderId: string;
  fieldPrice: number;
  totalAmount: number;
  userId: string;
  equipments: IBoughtEquipment[];
  date: string;
  startTime: string;
  endTime: string;
}

export interface IBookingDoc extends IBaseBooking, Document {
  id: string;
  status: BOOKING_STATUS;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingQuery {
  page?: number;
  record?: number;
}

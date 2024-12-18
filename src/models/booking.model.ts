import { Schema, model } from 'mongoose';

import { IBookingDoc } from '../@types';
import { v4 as uuidv4 } from 'uuid';
import { BOOKING_STATUS } from '../constants/booking';

const EquipmentSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const BookingSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => uuidv4(),
    },
    fieldId: { type: String, index: true, ref: 'Field', required: true },
    userId: { type: String, index: true, ref: 'User', required: true },
    orderId: { type: String, required: true },
    fieldPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    equipments: { type: [EquipmentSchema], default: [] },
    status: {
      type: String,
      enum: [
        BOOKING_STATUS.FAILED,
        BOOKING_STATUS.COMPLETED,
        BOOKING_STATUS.PENDING,
      ],
      default: BOOKING_STATUS.PENDING,
    },
    date: { type: String, required: true },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Booking = model<IBookingDoc>('booking', BookingSchema);

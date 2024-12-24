import { Schema, model } from "mongoose";

import { IBookingDoc } from "../@types";
import { v4 as uuidv4 } from "uuid";
import { BOOKING_STATUS } from "../constants";

const EquipmentSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const BookingSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => uuidv4(),
    },
    userId: { type: String, index: true, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        BOOKING_STATUS.FAILED,
        BOOKING_STATUS.COMPLETED,
        BOOKING_STATUS.PENDING,
      ],
      default: BOOKING_STATUS.PENDING,
    },
    // field info
    fieldId: { type: String, index: true, ref: "Field", required: true },
    orderId: { type: String, ref: "Transaction", required: true },
    fieldPrice: { type: Number, required: true },
    equipments: { type: [EquipmentSchema], default: [] },
    // referee
    refereeId: { type: String, ref: "User", required: false },
    refereePrice: { type: Number, required: false },
    refereeOrderId: { type: String, ref: "Transaction", required: false },
    // instructor
    instructorId: { type: String, ref: "User", required: false },
    instructorPrice: { type: Number, required: false },
    instructorOrderId: { type: String, ref: "Transaction", required: false },
    // matching
    isMatching: { type: Boolean, default: false },
    quantity: { type: Number, default: 0 },
    message: { type: String },
    members: {
      type: [
        {
          type: String,
          ref: "User",
        },
      ],
      default: [],
    },
    // time
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
  }
);

export const Booking = model<IBookingDoc>("booking", BookingSchema);

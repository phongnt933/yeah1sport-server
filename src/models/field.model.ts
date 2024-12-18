import { Schema, model } from 'mongoose';

import { IFieldDoc } from '../@types';
import { FIELD_TYPE } from '../constants';
import { v4 as uuidv4 } from 'uuid';

const EquipmentSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const FieldSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => uuidv4(),
    },
    name: { type: String, required: true, index: true },
    specificAddress: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    phone: { type: String, required: true },
    // coordinates: {
    //   lat: { type: Number, required: true },
    //   lng: { type: Number, required: true },
    // },
    type: {
      type: String,
      enum: [
        FIELD_TYPE.BADMINTON,
        FIELD_TYPE.PICKER_BALL,
        FIELD_TYPE.SOCCER,
        FIELD_TYPE.TABLE_TENNIS,
        FIELD_TYPE.TENNIS,
      ],
      required: true,
    },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    equipments: { type: [EquipmentSchema], default: [] },
    owner: {
      type: String,
      index: true,
      ref: 'User',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Field = model<IFieldDoc>('field', FieldSchema);

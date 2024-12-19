import { Schema, model } from "mongoose";

import { ITeamDoc } from "../@types";
import { FIELD_TYPE } from "../constants";
import { v4 as uuidv4 } from "uuid";

const TeamSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => uuidv4(),
    },
    name: { type: String, required: true },
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
    description: {
      type: String,
    },
    captain: {
      type: String,
      index: true,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Team = model<ITeamDoc>("team", TeamSchema);

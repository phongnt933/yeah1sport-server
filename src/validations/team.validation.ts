import { Joi, schema } from "express-validation";

import validate from "./validate";
import { FIELD_TYPE } from "../constants";

const createTeam: schema = {
  body: Joi.object({
    name: Joi.string().required(),
    type: Joi.string()
      .valid(
        FIELD_TYPE.SOCCER,
        FIELD_TYPE.BADMINTON,
        FIELD_TYPE.PICKER_BALL,
        FIELD_TYPE.TABLE_TENNIS,
        FIELD_TYPE.TENNIS
      )
      .required(),
    description: Joi.string(),
    members: Joi.array().items(Joi.string().email()).required(),
  }),
};

export const teamValidation = {
  createTeam: validate(createTeam),
};

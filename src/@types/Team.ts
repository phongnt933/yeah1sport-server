import { FIELD_TYPE } from "../constants";

export interface IBaseTeam {
  name: string;
  type: FIELD_TYPE;
  description?: string;
  captain: string;
  members: string[];
}

export interface ITeamDoc extends IBaseTeam, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamQuery {
  page?: number;
  record?: number;
}

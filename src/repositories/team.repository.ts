import { FlattenMaps, Types } from "mongoose";
import { IBaseTeam, ITeamDoc, ITeamQuery } from "../@types";
import { Team } from "../models";
import { parseFilters } from "../utils";

const createTeam = async (team: IBaseTeam): Promise<ITeamDoc> => {
  try {
    const newTeam = new Team({ ...team });
    return await newTeam.save();
  } catch (error) {
    throw error;
  }
};

const getTeam = async (
  value: any
): Promise<
  | (FlattenMaps<ITeamDoc> & {
      _id: Types.ObjectId;
    })
  | null
> => {
  const team = await Team.findOne(value).lean().select("-_id");
  return team;
};

const getListTeamUser = async (
  query: ITeamQuery & { userId: string }
): Promise<{ data: ITeamDoc[]; total: number }> => {
  const { page = 1, record = 15, userId } = query;

  if (typeof Number(page) !== "number" || typeof Number(record) !== "number") {
    return { data: [], total: 0 };
  }

  const [queryResult] = await Team.aggregate([
    {
      $match: {
        $or: [
          {
            captain: userId,
          },
          {
            members: userId,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "captain",
        foreignField: "id",
        as: "captainInfo",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "id",
        as: "membersInfo",
      },
    },
    {
      $unwind: {
        path: "$captainInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        type: 1,
        description: 1,
        "captainInfo.id": 1,
        "captainInfo.name": 1,
        "membersInfo.id": 1,
        "membersInfo.name": 1,
        "membersInfo.email": 1,
      },
    },
    {
      $addFields: {
        captain: "$captainInfo",
        members: "$membersInfo",
      },
    },
    {
      $project: {
        captainInfo: 0,
        membersInfo: 0,
      },
    },
    {
      $facet: {
        result: [
          { $sort: { createdAt: -1 } },
          { $skip: (Number(page) - 1) * Number(record) },
          { $limit: Number(record) },
          { $project: { _id: false } },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const { result, totalCount } = queryResult;
  const total = totalCount[0] ? totalCount[0].count : 0;

  return { data: result, total };
};

const getListTeam = async (
  query: ITeamQuery
): Promise<{ data: ITeamDoc[]; total: number }> => {
  const { page = 1, record = 15, ...rest } = query;
  const parsedFilters = parseFilters(rest);

  if (typeof Number(page) !== "number" || typeof Number(record) !== "number") {
    return { data: [], total: 0 };
  }

  const [queryResult] = await Team.aggregate([
    { $match: parsedFilters },
    {
      $lookup: {
        from: "users",
        localField: "captain",
        foreignField: "id",
        as: "captainInfo",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "id",
        as: "membersInfo",
      },
    },
    {
      $unwind: {
        path: "$captainInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        id: 1,
        name: 1,
        type: 1,
        description: 1,
        "captainInfo.id": 1,
        "captainInfo.name": 1,
        "membersInfo.id": 1,
        "membersInfo.name": 1,
        "membersInfo.email": 1,
      },
    },
    {
      $addFields: {
        captain: "$captainInfo",
        members: "$membersInfo",
      },
    },
    {
      $project: {
        captainInfo: 0,
        membersInfo: 0,
      },
    },
    {
      $facet: {
        result: [
          { $sort: { createdAt: -1 } },
          { $skip: (Number(page) - 1) * Number(record) },
          { $limit: Number(record) },
          { $project: { password: false, _id: false } },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const { result, totalCount } = queryResult;
  const total = totalCount[0] ? totalCount[0].count : 0;

  return { data: result, total };
};

const updateTeam = async (
  query: any,
  newData: any
): Promise<
  | (FlattenMaps<ITeamDoc> & {
      _id: Types.ObjectId;
    })
  | null
> => {
  const team = await Team.findOneAndUpdate(query, newData).lean();
  return team;
};

const deleteTeam = async (
  query: any
): Promise<
  | (FlattenMaps<ITeamDoc> & {
      _id: Types.ObjectId;
    })
  | null
> => {
  const team = await Team.findOneAndDelete(query).lean();
  return team;
};

export const teamRepository = {
  createTeam,
  getTeam,
  getListTeamUser,
  updateTeam,
  deleteTeam,
  getListTeam,
};

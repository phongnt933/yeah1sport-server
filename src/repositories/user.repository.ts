import { User } from "../models";
import { IBaseUser, IUserDoc, IUserQuery } from "../@types";
import { parseFilters } from "../utils";

const createUser = async (user: IBaseUser): Promise<IUserDoc> => {
  const newUser = new User({ ...user });
  return await newUser.save();
};

const getUser = async (value: any): Promise<IUserDoc | null> => {
  const user = await User.findOne(value).lean().select("-_id");
  return user;
};

const getListUsers = async (
  query: IUserQuery
): Promise<{ data: IUserDoc[]; total: number }> => {
  const { page = 1, record = 15, ...rest } = query;
  const parsedFilters = parseFilters(rest);

  if (typeof Number(page) !== "number" || typeof Number(record) !== "number") {
    return { data: [], total: 0 };
  }

  const [queryResult] = await User.aggregate([
    { $match: parsedFilters },
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

const findUsers = async (query: any) => {
  try {
    return User.find(query);
  } catch (err) {
    throw err;
  }
};

const updateUser = async (
  query: any,
  newData: any
): Promise<IUserDoc | null> => {
  const user = await User.findOneAndUpdate(query, newData, {
    new: true,
  })
    .lean()
    .select("-password -_id");
  return user;
};

const changePassword = async (
  query: any,
  newData: any
): Promise<IUserDoc | null> => {
  const user = await User.findOneAndUpdate(query).lean();
  return user;
};

const deleteUser = async (query: any): Promise<IUserDoc | null> => {
  const user = await User.findOneAndDelete(query).lean();
  return user;
};

const countOfUser = async (query: any): Promise<number> => {
  const result = await User.count(query).lean();
  return result;
};

export const userRepository = {
  createUser,
  getUser,
  getListUsers,
  updateUser,
  deleteUser,
  changePassword,
  countOfUser,
  findUsers,
};

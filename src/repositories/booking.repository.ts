import { FlattenMaps, Types } from "mongoose";
import { IBaseBooking, IBookingDoc, IBookingQuery } from "../@types";
import { Booking } from "../models";
import { parseFilters } from "../utils";

const getListBookingPagination = async (
  query: any
): Promise<{ data: IBookingDoc[]; total: number }> => {
  const { page = 1, record = 15, ...rest } = query;
  const parsedFilters = parseFilters(rest);

  if (typeof Number(page) !== "number" || typeof Number(record) !== "number") {
    return { data: [], total: 0 };
  }

  const [queryResult] = await Booking.aggregate([
    { $match: parsedFilters },
    {
      $lookup: {
        from: "fields",
        localField: "fieldId",
        foreignField: "id",
        as: "fieldDetails",
      },
    },
    {
      $unwind: {
        path: "$fieldDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
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

const getListBooking = async (query: any): Promise<IBookingDoc[]> => {
  const data = await Booking.find(query);
  return data;
};

const getListMatching = async (
  preQuery: any,
  query: any
): Promise<{ data: IBookingDoc[]; total: number }> => {
  const { page = 1, record = 15, type, ward, district, province } = query;

  const parsedFilters: any = {};

  if (type) {
    parsedFilters["field.type"] = new RegExp(type, "i");
  }
  if (ward) {
    parsedFilters["field.ward"] = new RegExp(ward, "i");
  }
  if (district) {
    parsedFilters["field.district"] = new RegExp(district, "i");
  }
  if (province) {
    parsedFilters["field.province"] = new RegExp(province, "i");
  }

  if (typeof Number(page) !== "number" || typeof Number(record) !== "number") {
    return { data: [], total: 0 };
  }
  const [queryResult] = await Booking.aggregate([
    { $match: preQuery },
    {
      $lookup: {
        from: "fields",
        localField: "fieldId",
        foreignField: "id",
        as: "fieldDetails",
      },
    },
    {
      $unwind: {
        path: "$fieldDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "matching.members",
        foreignField: "id",
        as: "matchingDetails",
      },
    },
    {
      $project: {
        id: 1,
        totalAmount: 1,
        equipments: 1,
        startTime: 1,
        endTime: 1,
        date: 1,
        isMatching: 1,
        members: 1,
        quantity: 1,
        "fieldDetails.name": 1,
        "fieldDetails.specificAddress": 1,
        "fieldDetails.ward": 1,
        "fieldDetails.district": 1,
        "fieldDetails.province": 1,
        "fieldDetails.type": 1,
        userDetails: 1,
      },
    },
    {
      $addFields: {
        field: "$fieldDetails",
      },
    },
    {
      $project: {
        fieldDetails: 0,
      },
    },
    {
      $match: parsedFilters,
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

const createBooking = async (booking: IBaseBooking): Promise<IBookingDoc> => {
  try {
    const newBooking = new Booking({ ...booking });
    return await newBooking.save();
  } catch (err) {
    throw err;
  }
};

const updateBooking = async (
  query: any,
  newData: any
): Promise<
  | (FlattenMaps<IBookingDoc> & {
      _id: Types.ObjectId;
    })
  | null
> => {
  const booking = await Booking.findOneAndUpdate(query, newData).lean();
  return booking;
};

export const bookingRepository = {
  getListBookingPagination,
  getListBooking,
  createBooking,
  updateBooking,
  getListMatching,
};

import { FlattenMaps, Types } from 'mongoose';
import { IBaseBooking, IBookingDoc, IBookingQuery } from '../@types';
import { Booking } from '../models';
import { parseFilters } from '../utils';

const getListBookingPagination = async (
  query: any,
): Promise<{ data: IBookingDoc[]; total: number }> => {
  const { page = 1, record = 15, ...rest } = query;
  const parsedFilters = parseFilters(rest);

  if (typeof Number(page) !== 'number' || typeof Number(record) !== 'number') {
    return { data: [], total: 0 };
  }

  const [queryResult] = await Booking.aggregate([
    { $match: parsedFilters },
    {
      $lookup: {
        from: 'fields',
        localField: 'fieldId',
        foreignField: 'id',
        as: 'fieldDetails',
      },
    },
    {
      $unwind: {
        path: '$fieldDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'id',
        as: 'userDetails',
      },
    },
    {
      $unwind: {
        path: '$userDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   $addFields: {
    //     owner: {
    //       id: '$owner',
    //       name: '$userDetails.name',
    //     },
    //   },
    // },
    // {
    //   $project: {
    //     userDetails: 0,
    //     _id: 0,
    //     'equipments._id': 0,
    //   },
    // },
    {
      $facet: {
        result: [
          { $sort: { createdAt: -1 } },
          { $skip: (Number(page) - 1) * Number(record) },
          { $limit: Number(record) },
          { $project: { _id: false } },
        ],
        totalCount: [{ $count: 'count' }],
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

const createBooking = async (booking: IBaseBooking): Promise<IBookingDoc> => {
  const newBooking = new Booking({ ...booking });
  return await newBooking.save();
};

const updateBooking = async (
  query: any,
  newData: any,
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
};

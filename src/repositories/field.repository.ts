import { Field } from '../models';
import { IBaseField, IFieldDoc, IFieldQuery } from '../@types';
import { parseFilters } from '../utils';
import { FlattenMaps, Types } from 'mongoose';

const createField = async (field: IBaseField): Promise<IFieldDoc> => {
  const newField = new Field({ ...field });
  return await newField.save();
};
const getField = async (
  value: any,
): Promise<
  | (FlattenMaps<IFieldDoc> & {
      _id: Types.ObjectId;
    })
  | null
  | null
> => {
  const field = await Field.findOne(value).lean();
  return field;
};
const getListFieldPagination = async (
  query: IFieldQuery & { owner?: string },
): Promise<{ data: IFieldDoc[]; total: number }> => {
  const { page = 1, record = 15, ...rest } = query;
  const parsedFilters = parseFilters(rest);

  if (typeof Number(page) !== 'number' || typeof Number(record) !== 'number') {
    return { data: [], total: 0 };
  }

  const [queryResult] = await Field.aggregate([
    { $match: parsedFilters },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
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
    {
      $addFields: {
        owner: {
          id: '$owner',
          name: '$userDetails.name',
        },
      },
    },
    {
      $project: {
        userDetails: 0,
        _id: 0,
        'equipments._id': 0,
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
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const { result, totalCount } = queryResult;
  const total = totalCount[0] ? totalCount[0].count : 0;

  return { data: result, total };
};
const getListField = async (query: any): Promise<IFieldDoc[]> => {
  return Field.find(query);
};

export const fieldRepository = {
  createField,
  getField,
  getListFieldPagination,
  getListField,
};

import { NextFunction, Response } from 'express';
import { RequestPayload } from '../@types';
import { ROLE, messages } from '../constants';
import httpStatus from 'http-status';
import { getApiResponse } from '../utils';
import { bookingRepository, fieldRepository } from '../repositories';

export const createField = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.payload && req.payload.role !== ROLE.FIELD_OWNER) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }

    const { name, ...rest } = req.body;

    const checkName = await fieldRepository.getField({ name });

    if (checkName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.FIELD_IS_EXIST));
    }

    const createField = await fieldRepository.createField({
      name,
      owner: req.payload!.id,
      ...rest,
    });

    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse({ ...messages.CREATE_SUCCESS, data: createField.id }),
      );
  } catch (error) {
    next(error);
  }
};

export const getAllField = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.payload && req.payload.role === ROLE.FIELD_OWNER) {
      const fieldList = await fieldRepository.getListFieldPagination({
        ...req.query,
        owner: req.payload.id,
      });

      return res.status(httpStatus.OK).json(getApiResponse(fieldList));
    }

    if (req.payload && req.payload.role === ROLE.ADMIN) {
      const fieldList = await fieldRepository.getListFieldPagination(req.query);
      return res.status(httpStatus.OK).json(getApiResponse(fieldList));
    }

    return res
      .status(httpStatus.FORBIDDEN)
      .json(getApiResponse(messages.ACCESS_DENIED));
  } catch (error) {
    next(error);
  }
};

export const findField = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { date, startTime, endTime, ...restQuery } = req.query;

    const fieldList = await fieldRepository.getListFieldPagination({
      ...restQuery,
    });

    if (fieldList.total === 0) {
      return res.status(httpStatus.OK).json(getApiResponse(fieldList));
    }

    const bookingList = await bookingRepository.getListBooking({
      date,
      startTime,
      endTime,
    });

    const availableFields = fieldList.data.filter((field) =>
      bookingList.every((booking) => booking.fieldId !== field.id),
    );

    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse({
          total: availableFields.length,
          data: availableFields,
        }),
      );
  } catch (error) {
    next(error);
  }
};

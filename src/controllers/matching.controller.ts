import { NextFunction, Response } from "express";
import { RequestPayload } from "../@types";
import httpStatus from "http-status";
import { ROLE, messages } from "../constants";
import { getApiResponse } from "../utils";
import { bookingRepository } from "../repositories";

export const createMatching = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.payload && req.payload.role !== ROLE.CUSTOMER) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }

    const { bookingId, quantity, message } = req.body;

    const bookingRecord = await bookingRepository.updateBooking(
      { id: bookingId },
      { quantity, message, isMatching: true }
    );

    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse({ ...messages.CREATE_SUCCESS, data: bookingRecord?.id })
      );
  } catch (error) {
    next(error);
  }
};

export const updateMatching = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.payload && req.payload.role !== ROLE.CUSTOMER) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }

    const userId = req.payload!.id;
    const id = req.params.id;

    const matching = await bookingRepository.updateBooking(
      { id },
      { $addToSet: { members: userId } }
    );
    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ ...messages.UPDATE_SUCCESS, data: matching?.id }));
  } catch (error) {
    next(error);
  }
};

export const getListMatching = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.payload && req.payload.role !== ROLE.CUSTOMER) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }

    const userId = req.payload!.id;

    const { type, ward, district, province, page, record } = req.query;

    const listMatching = await bookingRepository.getListMatching(
      {
        isMatching: true,
        userId: { $ne: userId },
        $expr: {
          $lt: [{ $size: "$members" }, "$quantity"],
        },
        members: { $nin: [userId] },
      },
      {
        type,
        ward,
        district,
        province,
        page,
        record,
      }
    );

    return res.status(httpStatus.OK).json(getApiResponse(listMatching));
  } catch (error) {
    next(error);
  }
};

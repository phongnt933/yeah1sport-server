import { NextFunction, Response } from "express";
import { RequestPayload } from "../@types";
import { ROLE, messages } from "../constants";
import httpStatus from "http-status";
import { getApiResponse } from "../utils";
import {
  capturePayPalOrder,
  createPayPalOrder,
  getPayPalAccessToken,
} from "../services";
import { bookingRepository, userRepository } from "../repositories";

export const createRefereeOrder = async (
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

    const { bookingId, refereeId } = req.body;

    const refereeInfo = await userRepository.getUser({ id: refereeId });

    const paypalToken = await getPayPalAccessToken();

    const orderResponse = await createPayPalOrder({
      accessToken: paypalToken,
      currency: "USD",
      amount: refereeInfo?.price || 0,
    });

    const bookingRecord = await bookingRepository.updateBooking(
      { id: bookingId },
      {
        refereeId,
        refereePrice: refereeInfo?.price || 0,
        refereeOrderId: orderResponse.id,
      }
    );

    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse({
          ...messages.CREATE_SUCCESS,
          data: { orderId: orderResponse.id },
        })
      );
  } catch (error) {
    next(error);
  }
};

export const getListReferee = async (
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

    const refereeList = await userRepository.getListUsers({
      role: ROLE.REFEREE,
      page: 1,
      record: Number.MAX_SAFE_INTEGER,
    });

    return res.status(httpStatus.OK).json(getApiResponse(refereeList));
  } catch (error) {
    next(error);
  }
};

export const captureRefereeOrder = async (
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

    const { orderId } = req.body;

    const paypalToken = await getPayPalAccessToken();

    const captureData = await capturePayPalOrder({
      accessToken: paypalToken,
      orderId,
    });

    return res.status(httpStatus.OK).json(
      getApiResponse({
        ...messages.CREATE_SUCCESS,
        data: { status: captureData.status },
      })
    );
  } catch (error) {
    next(error);
  }
};

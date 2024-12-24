import { NextFunction, Response } from "express";
import { RequestPayload } from "../@types";
import httpStatus from "http-status";
import { getApiResponse } from "../utils";
import {
  getPayPalAccessToken,
  createPayPalOrder,
  capturePayPalOrder,
} from "../services";
import { ROLE, TRANSACTION_STATUS, messages } from "../constants";
import {
  bookingRepository,
  fieldRepository,
  transactionRepository,
} from "../repositories";
import { BOOKING_STATUS } from "../constants";

export const createBooking = async (
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

    const {
      fieldId,
      fieldPrice,
      equipments,
      totalAmount,
      startTime,
      endTime,
      date,
    } = req.body;

    const paypalToken = await getPayPalAccessToken();

    const orderResponse = await createPayPalOrder({
      accessToken: paypalToken,
      currency: "USD",
      amount: totalAmount,
    });

    const newBooking = await bookingRepository.createBooking({
      fieldId,
      userId: req.payload ? req.payload.id : "",
      orderId: orderResponse.id,
      fieldPrice,
      totalAmount,
      equipments,
      date,
      startTime,
      endTime,
    });

    return res.status(httpStatus.OK).json(
      getApiResponse({
        ec: 0,
        data: { orderId: orderResponse.id, id: newBooking.id },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (
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

    let bookingStatus = BOOKING_STATUS.PENDING;

    if (captureData.status === TRANSACTION_STATUS.COMPLETED) {
      bookingStatus = BOOKING_STATUS.COMPLETED;
    } else if (
      captureData.status === TRANSACTION_STATUS.CANCELLED ||
      captureData.status === TRANSACTION_STATUS.VOIDED
    ) {
      bookingStatus = BOOKING_STATUS.FAILED;
    }

    const bookingData = await bookingRepository.updateBooking(
      { orderId },
      { status: bookingStatus }
    );

    if (!bookingData) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.NOT_FOUND));
    }

    const newTransaction = await transactionRepository.createTransaction({
      bookingId: bookingData.id,
      orderId,
      amount: bookingData.totalAmount,
      status: captureData.status,
    });

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ ec: 0, data: { status: captureData.status } }));
  } catch (error) {
    next(error);
  }
};

export const getListBooking = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.payload && req.payload.role === ROLE.ADMIN) {
      const bookingList = await bookingRepository.getListBookingPagination(
        req.query
      );
      return res.status(httpStatus.OK).json(getApiResponse(bookingList));
    }

    if (req.payload && req.payload.role === ROLE.FIELD_OWNER) {
      const uid = req.payload!.id;

      const fields = await fieldRepository.getListField({ owner: uid });

      const fieldIds = fields.map((field) => field.id);

      const bookingList = await bookingRepository.getListBookingPagination({
        ...req.query,
        fieldId: { $in: fieldIds },
      });
      return res.status(httpStatus.OK).json(getApiResponse(bookingList));
    }

    if (req.payload && req.payload.role === ROLE.CUSTOMER) {
      const uid = req.payload!.id;
      const bookingList = await bookingRepository.getListBookingPagination({
        ...req.query,
        userId: uid,
      });
      return res.status(httpStatus.OK).json(getApiResponse(bookingList));
    }

    return res
      .status(httpStatus.FORBIDDEN)
      .json(getApiResponse(messages.ACCESS_DENIED));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

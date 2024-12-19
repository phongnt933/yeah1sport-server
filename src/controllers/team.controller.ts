import { NextFunction, Response } from "express";
import { RequestPayload } from "../@types";
import { ROLE, messages } from "../constants";
import httpStatus from "http-status";
import { getApiResponse, omitIsNil } from "../utils";
import { teamRepository, userRepository } from "../repositories";

export const createTeam = async (
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

    const { name, type, description, members } = req.body;

    const checkTeam = await teamRepository.getTeam({ name });

    if (checkTeam) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.TEAM_IS_EXIST));
    }

    const users = await userRepository.findUsers({ email: { $in: members } });

    const filteredUsers = users.filter((user) => user.role === ROLE.CUSTOMER);

    const captainId = req.payload ? req.payload.id : "";

    const createTeam = await teamRepository.createTeam(
      omitIsNil(
        {
          name,
          type,
          description,
          captain: captainId,
          members: filteredUsers.map((user) => user.id),
        },
        { deep: false }
      )
    );

    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse({ ...messages.CREATE_SUCCESS, data: createTeam.id })
      );
  } catch (error) {
    next(error);
  }
};

export const getListTeamUser = async (
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

    const teamList = await teamRepository.getListTeamUser({
      ...req.query,
      userId: req.payload ? req.payload.id : "",
    });

    return res.status(httpStatus.OK).json(getApiResponse(teamList));
  } catch (error) {
    next(error);
  }
};

export const getListTeam = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.payload && req.payload.role !== ROLE.ADMIN) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }

    const teamList = await teamRepository.getListTeam(req.query);

    return res.status(httpStatus.OK).json(getApiResponse(teamList));
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, description, members } = req.body;

    const users = await userRepository.findUsers({ email: { $in: members } });

    const filteredUsers = users.filter((user) => user.role === ROLE.CUSTOMER);

    const team = await teamRepository.updateTeam(
      { id: req.params.id },
      omitIsNil(
        {
          name,
          type,
          description,
          members: filteredUsers.map((user) => user.id),
        },
        { deep: false }
      )
    );

    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse({ msg: "Cập nhật thành công", data: { id: team?.id } })
      );
  } catch (error) {
    next(error);
  }
};

export const deletedTeam = async (
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

    const team = await teamRepository.deleteTeam({ id: req.params.id });

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ msg: "Xoá thành công", data: { id: team?.id } }));
  } catch (error) {
    next(error);
  }
};

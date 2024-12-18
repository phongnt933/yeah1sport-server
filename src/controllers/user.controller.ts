import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { userRepository } from '../repositories';
import {
  compareBcrypt,
  generateAccessToken,
  generateRefreshToken,
  getApiResponse,
  hashBcrypt,
} from '../utils';
import { ROLE, USER_STATUS, messages } from '../constants';
import { RequestPayload } from '../@types';

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, ...rest } = req.body;

    const checkEmail = await userRepository.getUser({ email });

    if (checkEmail) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_IS_EXIST));
    }
    const createUser = await userRepository.createUser({
      email,
      role: ROLE.CUSTOMER,
      ...rest,
    });

    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse({ ...messages.REGISTER_SUCCESS, data: createUser.id }),
      );
  } catch (error) {
    next(error);
  }
};

export const createCMSUser = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.payload && req.payload.role !== ROLE.ADMIN) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }

    const { email, role, ...rest } = req.body;

    const checkEmail = await userRepository.getUser({ email });

    if (checkEmail) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_IS_EXIST));
    }
    const createUser = await userRepository.createUser({
      email,
      role,
      ...rest,
    });

    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse({ ...messages.REGISTER_SUCCESS, data: createUser.id }),
      );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.getUser({ email });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_IS_NOT_FOUND));
    }

    if (user.status === USER_STATUS.LOCKED) {
      return res
        .status(httpStatus.LOCKED)
        .json(getApiResponse(messages.USER_IS_LOCKED));
    }

    const matchPassword = await compareBcrypt(password, user.password);

    if (!matchPassword) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(getApiResponse(messages.PASSWORD_INCORRECT));
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });

    const refreshToken = generateRefreshToken({
      id: user.id,
      role: user.role,
    });

    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: {
          id: user.id,
          role: user.role,
          email: user.email,
          name: user.name,
          accessToken,
          refreshToken,
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getListUser = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.payload && req.payload.role !== ROLE.ADMIN) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }
    const userList = await userRepository.getListUsers(req.query);

    return res.status(httpStatus.OK).json(getApiResponse(userList));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    if (
      (req.payload && req.payload.id === id) ||
      (req.payload && req.payload.role === ROLE.ADMIN)
    ) {
      const user = await userRepository.getUser({ id });
      if (!user) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json(getApiResponse(messages.USER_IS_NOT_FOUND));
      }

      const { password, ...restUser } = user;

      return res.status(httpStatus.OK).json(
        getApiResponse({
          data: {
            ...restUser,
          },
        }),
      );
    }
    return res
      .status(httpStatus.FORBIDDEN)
      .json(getApiResponse(messages.ACCESS_DENIED));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (
      req.payload &&
      req.payload.id !== id &&
      req.payload.role !== ROLE.ADMIN
    ) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }

    const user = await userRepository.updateUser({ id }, req.body);

    return res.status(httpStatus.OK).json(getApiResponse({ data: user }));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (req.payload && req.payload.id !== id) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }
    const { currentPassword, newPassword } = req.body;

    const user = await userRepository.getUser({ id });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_IS_NOT_FOUND));
    }

    const checkPassword = await compareBcrypt(currentPassword, user.password);

    if (!checkPassword) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.CURRENT_PASSWORD_INCORRECT));
    }
    const newPasswordHash = await hashBcrypt(newPassword);

    const newUser = await userRepository.updateUser(
      { id },
      { password: newPasswordHash },
    );

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ data: newUser?.id }));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (
      req.payload &&
      req.payload.id === id &&
      req.payload.role !== ROLE.ADMIN
    ) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json(getApiResponse(messages.ACCESS_DENIED));
    }

    const user = await userRepository.deleteUser({ id });

    return res.status(httpStatus.OK).json(getApiResponse({ data: user }));
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordChange = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    const user = await userRepository.getUser({ id });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_IS_NOT_FOUND));
    }

    const { newPassword } = req.body;

    const newPasswordHash = await hashBcrypt(newPassword);

    const newUser = await userRepository.updateUser(
      { id },
      { password: newPasswordHash },
    );

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ data: { id: newUser?.id } }));
  } catch (error) {
    next(error);
  }
};

// export const randomUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { total } = req.body;

//     const randomRole = () => {
//       const ranNumber = Math.floor(Math.random() * 30);

//       if (ranNumber < 10) {
//         return ROLE.ADMIN;
//       } else if (ranNumber >= 10 && ranNumber < 20) {
//         return ROLE.STUDENT;
//       }
//       return ROLE.COLLABORATOR;
//     };

//     for (let i = 1; i <= total; i++) {
//       const userInfo = {
//         firstName: 'Mr',
//         lastName: i.toString(),
//         email: `hong${i}@gviet.vn`,
//         role: randomRole(),
//         password: '123456',
//         phone: '123456',
//       };

//       await userRepository.createUser(userInfo);
//     }

//     return res
//       .status(httpStatus.OK)
//       .json(getApiResponse({ ...messages.REGISTER_SUCCESS, data: total }));
//   } catch (error) {
//     next(error);
//   }
// };

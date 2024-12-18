import axios from 'axios';
import { paypalInfo } from '../configs';

export const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${paypalInfo.clientId}:${paypalInfo.clientSecret}`,
    ).toString('base64');

    const response = await axios.post(
      `${paypalInfo.api}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }

    return error;
  }
};

export const createPayPalOrder = async ({
  accessToken,
  currency,
  amount,
}: {
  accessToken: string;
  currency?: string;
  amount: number;
}) => {
  try {
    const orderResponse = await axios.post(
      `${paypalInfo.api}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency || 'VND',
              value: amount,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return orderResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        msg: error.response?.data || error.message,
        status: error.response?.status,
      };
    }

    return error;
  }
};

export const capturePayPalOrder = async ({
  accessToken,
  orderId,
}: {
  accessToken: string;
  orderId: string;
}) => {
  try {
    const captureResponse = await axios.post(
      `${paypalInfo.api}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return captureResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }

    return error;
  }
};

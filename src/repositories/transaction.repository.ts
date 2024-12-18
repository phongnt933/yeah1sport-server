import { IBaseTransaction, ITransactionDoc } from '../@types';
import { Transaction } from '../models';

const createTransaction = async (
  transaction: IBaseTransaction,
): Promise<ITransactionDoc> => {
  const newTransaction = new Transaction({ ...transaction });
  return await newTransaction.save();
};
export const transactionRepository = {
  createTransaction,
};

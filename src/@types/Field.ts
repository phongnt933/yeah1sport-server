import { FIELD_TYPE } from '../constants';

export interface IEquipment {
  name: string;
  price: number;
}

export interface IBaseField {
  owner: string;
  name: string;
  specificAddress: string;
  ward: string;
  district: string;
  province: string;
  phone: string;
  //   coordinates: {
  //     lat: number;
  //     lng: number;
  //   };
  type: FIELD_TYPE;
  capacity: number;
  price: number;
  equipments: IEquipment[];
}

export interface IFieldDoc extends IBaseField, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFieldQuery {
  page?: number;
  record?: number;
}

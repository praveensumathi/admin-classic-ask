import { IUser } from "./customer";

export interface Id {
  _id?: string;
}

export interface IOrder extends Id {
  orderDateAndTime: Date;
  orderNumber: string;
  hasTrackingAttachment: boolean;
}

export interface IOrderList {
  productOrderDetail: IOrder[],
  total: number
}

export interface IOrderDetailByOrderID {
  _id: string;
  shippingDetail: IShippingdetail;
  userId: string;
  productdetail: IProductdetail[];
  totalPrice: number;
  paymentInfo: IPaymentInfo;
  status: number;
  orderedDateAndTime: Date;
  userName: string;
  image: string;
  orderNumber: string;
  courierType: string;
  deliveryFee: string;
  curierCharge: number;
  cancellationReason: string;
  transactionId?: string;
}

export interface IPaymentInfo {
  originalTransactionId: string;
  merchantTransactionId: string
}

export interface IProductdetail {
  productId: string;
  title: string;
  productCode: string;
  posterURL: string;
  sizes: ISize[];
  _id: string;
}

export interface ISize {
  size: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface IShippingdetail {
  name: string;
  address: string;
  phoneNumber: string;
  alternativeNumber: number;
  pincode: number;
  city: string;
  state: string;
  orderNumber: string;
  district: string;
}

export interface IOnlineGSTBill {
  orders: IGstBillOrders[];
}

export interface Order {
  shippingDetail: ShippingDetail;
  _id: string;
  userId: string;
  orderNumber: string;
  productdetail: Productdetail[];
  totalPrice: number;
  status: number;
  image: string;
  courierType: string;
  orderedDateAndTime: Date;
  __v: number;
}

export interface IGstBillOrders {
  //shippingDetail: ShippingDetail;
  _id: string;
  userId: string;
  orderNumber: string;
  productdetail: Productdetail[];
  totalPrice: number;
  status: number;
  image: string;
  courierType: string;
  orderedDateAndTime: Date;
  userName: string;
  shippingUserName: string;
}

export interface Productdetail {
  productId: string;
  title: string;
  productCode: string;
  posterURL: string;
  sizes: Size[];
  _id: string;
}

export interface Size {
  size: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface ShippingDetail {
  address: string;
  phoneNumber: string;
  pincode: number;
  district: string;
  state: string;
}


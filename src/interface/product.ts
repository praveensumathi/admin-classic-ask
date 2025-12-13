export interface IProduct {
  _id?: string;
  title: string;
  description: string;
  productCode: string | undefined;
  // netWeight: number | undefined;
  materialType: string;
  posterURL: string;
  categoryName: string;
  categoryId: string;
  sizes: ISize[];
  price?: number;
  purchaseDate: string;
  sellerName: string;
  isWithGST: boolean;
  images: string[];
}

export interface ISize {
  purchasePrice?: number;
  resellingPrice?: number;
  offlineSellingPrice?: number;
  size: string;
  inStock: number;
  purchaseQty: number;
  netWeight: number;
  MRPprice?: number;
  price?: number;
}
export interface IDeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}
export interface IOfflineProductOrder {
  _id: string;
  title: string;
  images: string[];
  price: number;
  sizes: Size[];
  description: string;
  productCode: string;
  materialType: string;
  posterURL: string;
  category: string;
  createdDate: Date;
  __v: number;
}

export interface Size {
  size: string;
  purchasePrice: number;
  inStock: number;
  purchaseQty: number;
  netWeight: number;
  MRPprice: number;
  resellingPrice: number;
  price: number;
  offlineSellingPrice: number;
  _id: string;
}

export interface IOfflineOrderDataResponse {
  data: IOfflineOrder;
}

export interface IOfflineOrder {
  _id?: string;
  sizeWithQuantityPrice: IOfflineOrderSizeWithQuantityPrice[];
  orderNumber?: string;
  totalPrice: number;
  customerName: string;
  phoneNumber: string | undefined;
  discount: number;
  modeOfTransaction: string;
  createdAt?: Date;
  removedOrderedProductIds?: string[];
}

export interface IOfflineOrderSizeWithQuantityPrice {
  id?: number;
  productId: string;
  title: string;
  productCode: string;
  orderedProductWithSizeObjectId?: string;
  sizes: IOfflineOrderSize[];
  selectedSize?: IOfflineOrderSize | null;
}

export interface IOfflineOrderSize {
  sizeId?: string;
  size: string;
  offlineSellingPrice: number;
  billQuantity: number;
  inStock: number;
  totalPrice: number;
}

export interface IOrderOffline {
  orders: OrderElement[];
}

export interface OrderElement {
  _id: string;
  sizeWithQuantityPrice: SizeWithQuantityPrice[];
  orderNumber: string;
  totalPrice: number;
  customerName: string;
  discount: number;
  modeOfTransaction: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface SizeWithQuantityPrice {
  productCode: string;
  title: string;
  sizes: Size[];
  _id: string;
}

export interface Size {
  size: string;
  offlineSellingPrice: number;
  purchasePrice: number;
  billQuantity: number;
  totalPrice: number;
  _id: string;
}

export interface IProductList {
  products: IProduct[],
  total: number,
}
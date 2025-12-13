import { ICategory } from "../interface/category";
import { ICustomer } from "../interface/customer";
import { IProduct } from "../interface/product";

export const CategoryInitialValue: ICategory = {
  _id: "",
  name: "",
  description: "",
  image: "",
  productCount: 0,
};
export const ProductInitialValue: IProduct = {
  _id: "",
  title: "",
  description: "",
  productCode: "",
  materialType: "",
  categoryId: "",
  posterURL: "",
  netWeight: undefined,
  categoryName: "",
  sizes: [
    {
      size: "",
      inStock: 0,
      MRPprice: undefined,
      price: 0,
    },
  ],
  images: [],
};
export const CustomerInitialValue: ICustomer = {
  _id: "",
  phoneNumber: "",
  name: "",
  email: "",
};

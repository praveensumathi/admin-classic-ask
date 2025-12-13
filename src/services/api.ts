import { ICategory } from "../interface/category";
import { IOnlineGSTBill, IOrderDetailByOrderID } from "../interface/order";
import { ILoginFormInputs, ILoginResponse, IUser } from "../interface/customer";
import {
  httpWithCredentials,
  httpWithMultipartFormData,
  httpWithoutCredentials,
} from "./http";
import {
  IDeleteResult,
  IOfflineOrder,
  IOfflineOrderDataResponse,
  IOfflineOrderSizeWithQuantityPrice,
  IOfflineProductOrder,
  IOrderOffline,
} from "../interface/product";

const getCategories = async () => {
  const data = await httpWithCredentials.get<ICategory[]>("fetchCategory");
  return data.data;
};

const generateResetLink = async (phoneNumber: number) => {
  try {
    const response = await httpWithCredentials.post<string>(
      "customer/generateResetLink",
      {
        phoneNumber,
      }
    );
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error generating reset link:", error);
    throw error;
  }
};

const getOrderDetailByOrderId = async (orderId: string) => {
  try {
    var response = await httpWithCredentials.get<IOrderDetailByOrderID>(
      `/orders/getOrderDetailById/${orderId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminLogin = async (credential: ILoginFormInputs) => {
  try {
    const response = await httpWithCredentials.post<ILoginResponse>(
      "/customer/adminLogin",
      credential
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const isAuthorized = async () => {
  try {
    const response = await httpWithCredentials.get<IUser>(
      "/customer/isAuthorized"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (updateOrder: FormData) => {
  try {
    const id = updateOrder.get("id");

    if (id !== null) {
      const response =
        await httpWithMultipartFormData.put<IOrderDetailByOrderID>(
          `orders/updateOrderStatus/${id}`,
          updateOrder
        );
      return response.data;
    } else {
      console.error("Missing 'id' in FormData");
    }
  } catch (error) {
    throw error;
  }
};

const logOut = async () => {
  try {
    const response = await httpWithCredentials.get<ILoginResponse>(
      "/customer/logout"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteOutofStockProduct = async () => {
  try {
    const response = await httpWithCredentials.delete<IDeleteResult>(
      "/product/deleteOutOfStock"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchProductByProductCode = async (productCode: string) => {
  try {
    const response =
      await httpWithCredentials.get<IOfflineOrderSizeWithQuantityPrice>(
        `product/fetchProductByProductCode/${productCode}`
      );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const createNewOfflineOrder = async (savedProducts: IOfflineOrder) => {
  try {
    const response = await httpWithCredentials.post<IOfflineOrderDataResponse>(
      "offlineOrder/createOfflineOrder",
      savedProducts
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const getOfflineOrdersReportByDateWise = async (
  fromDate: string,
  toDate: string
) => {
  try {
    const url = `${import.meta.env.VITE_AXIOS_BASE_URL
      }offlineOrder/getOfflineOrdersReportByDateWise/${fromDate}/${toDate}`;
    window.open(url, "_blank");
  } catch (error) {
    throw error;
  }
};

const getOfflineOrdersForGstByDateWise = async (
  fromDate: string,
  toDate: string
) => {
  try {
    const response = await httpWithCredentials.get<IOrderOffline>(
      `offlineOrder/getOfflineOrdersForGstByDateWise/${fromDate}/${toDate}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllOnlineOrdersForGstByDateWise = async (
  fromDate: string,
  toDate: string
) => {
  try {
    const response = await httpWithCredentials.get<IOnlineGSTBill>(
      `orders/getAllOnlineOrdersForGstByDateWise/${fromDate}/${toDate}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPurchaseProductReportByDateWise = async (
  fromDate: string,
  toDate: string
) => {
  try {
    const url = `${import.meta.env.VITE_AXIOS_BASE_URL
      }product/getPurchaseProductReportByDateWise/${fromDate}/${toDate}`;
    window.open(url, "_blank");
  } catch (error) {
    throw error;
  }
};

const getOnlineSellingReport = async (fromDate: string, toDate: string) => {
  try {
    const url = `${import.meta.env.VITE_AXIOS_BASE_URL
      }orders/getOnlineSellingReport/${fromDate}/${toDate}`;
    window.open(url, "_blank");
  } catch (error) {
    throw error;
  }
};

const getProductInstockReportByDateWise = async (
  fromDate: string,
  toDate: string
) => {
  try {
    const url = `${import.meta.env.VITE_AXIOS_BASE_URL
      }product/getProductInstockReportByDateWise/${fromDate}/${toDate}`;
    window.open(url, "_blank");
  } catch (error) {
    throw error;
  }
};

const MakeCustomerAsReseller = async (
  userId: string | undefined,
  isReseller: boolean
) => {
  try {
    const response = await httpWithCredentials.put<IUser>(
      `/customer/makeCustomerAsReseller/${userId}`,
      { isReseller: isReseller }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getOfflineOrdersByOrderNumber = async (orderNumber: string) => {
  try {
    const response = await httpWithCredentials.get<IOfflineOrder>(
      `offlineOrder/getOfflineOrdersByOrderNumber/${orderNumber}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateOfflineOrder = async (orderId: string, updatedData: any) => {
  try {
    console.log("orderId before API request:", orderId);
    const response = await httpWithCredentials.put<IOfflineOrderDataResponse>(
      `offlineOrder/updateOfflineOrder/${orderId}`,
      updatedData
    );
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API request error", error);
    throw error;
  }
};

export {
  getCategories,
  generateResetLink,
  adminLogin,
  isAuthorized,
  getOrderDetailByOrderId,
  updateOrderStatus,
  logOut,
  deleteOutofStockProduct,
  fetchProductByProductCode,
  createNewOfflineOrder,
  getOfflineOrdersReportByDateWise,
  getPurchaseProductReportByDateWise,
  getProductInstockReportByDateWise,
  MakeCustomerAsReseller,
  getOfflineOrdersForGstByDateWise,
  getAllOnlineOrdersForGstByDateWise,
  getOnlineSellingReport,
  getOfflineOrdersByOrderNumber,
  updateOfflineOrder,
};

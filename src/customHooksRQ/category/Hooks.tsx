import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICategory } from "../../interface/category";
import {
  httpWithMultipartFormData,
  httpWithCredentials,
} from "../../services/http";
import { ICustomerList } from "../../interface/customer";
import {
  IDeleteResult,
  IOfflineOrder,
  IProduct,
  IProductList,
} from "../../interface/product";
import { IOrderList } from "../../interface/order";
import { OfflineOrders } from "../../interface/offlineOrders";

const getAllCategories = async () => {
  try {
    const response = await httpWithCredentials.get<ICategory[]>(
      "/category/getAllCategory"
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const getAllProducts = async (
  searchName: string,
  page: number,
  pageSize: number
) => {
  try {
    const response = await httpWithCredentials.get<IProductList>(
      "/product/getAllProducts",
      {
        params: {
          searchName,
          page,
          pageSize,
        },
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const fetchProductsByCategory = async (categoryId: string) => {
  try {
    const response = await httpWithCredentials.get<IProduct[]>(
      `/category/fetchProductsByCategoryId/${categoryId}`
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

//get all custemers
export const getAllCustomers = async (name: string, phoneNumber: string) => {
  try {
    const response = await httpWithCredentials.get<ICustomerList>(
      "/customer/getAllCustomers",
      { params: { name, phoneNumber } }
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

//delete customer
const deleteCustomer = async (customerId: string) => {
  try {
    var response = await httpWithCredentials.delete<IDeleteResult>(
      `customer/deleteCustomer/${customerId}`
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const deleteCategory = async (CategoryId: string) => {
  try {
    var response = await httpWithCredentials.delete(
      `category/deleteCategory/${CategoryId}`
    );

    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const createCategory = async (newCategory: FormData) => {
  try {
    var response = await httpWithCredentials.post<ICategory>(
      "/category/createCategory",
      newCategory
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (updateProductFormData: FormData) => {
  try {
    var id = updateProductFormData.get("id");
    var response = await httpWithMultipartFormData.put<IProduct>(
      `product/updateProduct/${id}`,
      updateProductFormData
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const updateCategory = async (updateCategory: FormData) => {
  try {
    var id = updateCategory.get("id");
    var response = await httpWithMultipartFormData.put<ICategory>(
      `category/updateCategory/${id}`,
      updateCategory
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createProduct = async (newProduct: FormData) => {
  try {
    var response = await httpWithMultipartFormData.post<IProduct>(
      "/product/createProduct",
      newProduct
    );
    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};

const deleteProduct = async (productId: string) => {
  try {
    const response = await httpWithCredentials.delete<IDeleteResult>(
      `/product/deleteProduct/${productId}`
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    const message = (error as Error).message;
    throw new Error(message);
  }
};
const deleteCategoryWiseProduct = async (productId: string) => {
  try {
    const response = await httpWithCredentials.delete<IDeleteResult>(
      `/product/deleteProduct/${productId} `
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    const message = (error as Error).message;
    throw new Error(message);
  }
};

const productBulkDelete = async (productIds: string[]) => {
  try {
    const response = await httpWithCredentials.post<IDeleteResult>(
      "/product/productBulkDelete",
      {
        productIds: productIds,
      }
    );
    return response.data;
  } catch (error) {
    const message = (error as Error).message;
    throw new Error(message);
  }
};
const getAllOrders = async (
  status: string,
  date: any,
  orderNumber: string | null
) => {
  try {
    const response = await httpWithCredentials.get<IOrderList>(
      `/orders/getAllOrders/${status}`,
      { params: { orderNumber, date } }
    );

    return response.data;
  } catch (error) {
    const message = (error as Error).message;
    throw new Error(message);
  }
};

const getAllOfflineOrders = async (date: any, orderNumber: string | null) => {
  try {
    const response = await httpWithCredentials.get<OfflineOrders>(
      "/offlineOrder/getAllOfflineOrders",
      { params: { orderNumber, date } }
    );

    return response.data;
  } catch (error) {
    const message = (error as Error).message;
    throw new Error(message);
  }
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const usefetchProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => fetchProductsByCategory(categoryId),
    refetchOnWindowFocus: false,
  });
};

// export const useGetCustomer = () => {
//   return useQuery({
//     queryKey: ["customers"],
//     queryFn: getAllCustomers,
//     refetchOnWindowFocus: false,
//   });
// };

export const useGetProducts = (
  searchName: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["products", { search: searchName, page, pageSize }],
    queryFn: () => getAllProducts(searchName, page, pageSize),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useBulkProductDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productBulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetAllOrders = (
  status: string,
  date: any,
  orderNumber: string | null
) => {
  return useQuery({
    queryKey: ["orders", status],
    queryFn: () => getAllOrders(status, date, orderNumber),
    refetchOnWindowFocus: false,
  });
};

export const useGetAllOfflineOrders = (
  date: any,
  orderNumber: string | null
) => {
  return useQuery({
    queryKey: ["offlineorders"],
    queryFn: () => getAllOfflineOrders(date, orderNumber),
    refetchOnWindowFocus: false,
  });
};

export const usedeleteCategoryWiseProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryWiseProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

// update category sort order by accepting ordered array of category ids
const updateCategoryOrder = async (orderedCategoryIds: string[]) => {
  try {
    const response = await httpWithCredentials.put(
      "/category/updateCategorySortOrder",
      {
        orderedCategoryIds,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useUpdateCategoryOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedCategoryIds: string[]) =>
      updateCategoryOrder(orderedCategoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

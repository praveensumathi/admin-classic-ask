export interface ICustomer {
  _id?: string;
  phoneNumber: string;
  name: string;
  email: string;
  isReseller: boolean;
}
export interface IDeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}

export interface IUser {
  userId: string | null;
  phoneNumber: string | null;
  name: string | null;
  role: string | null;
}

export interface ILoginResponse {
  data: IUser | null;
  message: string;
  status?: boolean;
}

export interface ILoginFormInputs {
  phoneNumber: string;
  password: string;
}

export interface IAuthContext {
  user: IUser | null;
  updateUserData: (user: IUser | null) => void;
}


export interface ICustomerList {
  customers: ICustomer[],
  total: number
}
import React, { useCallback, useContext, useState, createContext } from "react";
import { IAuthContext, IUser } from "../interface/customer";

const AuthContext = createContext<IAuthContext>({
  user: {
    userId: null,
    phoneNumber: null,
    name: null,
    role: null,
  },
  updateUserData: () => {},
});

function AuthProvider({ children }) {
  const [user, setUser] = useState<IUser | null>(null);

  const updateUserData = (userData: IUser | null) => {
    if (userData) {
      setUser((prevUser) => ({
        ...prevUser,
        ...userData,
      }));
    }
  };

  const contextValue: IAuthContext = {
    user,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext<IAuthContext>(AuthContext);
  return context;
}

export default AuthProvider;

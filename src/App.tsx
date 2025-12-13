import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import theme from "./theme/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Routes } from "react-router-dom";
import { paths } from "./routes/paths";
import Orders from "./pages/orders/Orders";
import Layout from "./pages/layout/Layout";
import Products from "./pages/products/Products";
import Posters from "./pages/posters/Posters";
import Categories from "./pages/categories/Categories";
import Customers from "./pages/customers/Customers";
import OrdersDetails from "./pages/orders/OrdersDetails";
import SnackBarProvider from "./context/SnackBarContext";
import CustomSnackBar from "./context/CustomSnackBar";
import Login from "./pages/login/Login";
import PrivateRoute from "./common/components/PrivateRoute";
import AuthProvider, { useAuthContext } from "./context/AuthContext";

import Stores from "./pages/store/Stores";

import Reports from "./pages/reports/Reports";
import OfflineOrders from "./pages/offlineOrders/OfflineOrders";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <SnackBarProvider>
            <Routes>
              <Route path={paths.LOGIN} element={<Login />} />
              <Route path={paths.ROOT} element={<Layout />}>
                <Route
                  index
                  path="/"
                  element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={paths.PRODUCT}
                  element={
                    <PrivateRoute>
                      <Products />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={paths.CATEGORY}
                  element={
                    <PrivateRoute>
                      <Categories />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={paths.POSTERS}
                  element={
                    <PrivateRoute>
                      <Posters />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={paths.CUSTOMERS}
                  element={
                    <PrivateRoute>
                      <Customers />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={`${paths.STORES}/:orderNumber?`}
                  element={
                    <PrivateRoute>
                      <Stores />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={paths.OFFLINEORDERS}
                  element={
                    <PrivateRoute>
                      <OfflineOrders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={paths.REPORTS}
                  element={
                    <PrivateRoute>
                      <Reports />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={`${paths.ORDERSDETAILS}/:id`}
                  element={
                    <PrivateRoute>
                      <OrdersDetails />
                    </PrivateRoute>
                  }
                />
              </Route>
            </Routes>
            <CustomSnackBar />
          </SnackBarProvider>
        </ThemeProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

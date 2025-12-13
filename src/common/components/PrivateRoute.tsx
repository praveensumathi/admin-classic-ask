import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { isAuthorized } from "../../services/api";
import { paths } from "../../routes/paths";

const PrivateRoute = ({ children }) => {
  const { user, updateUserData } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      const user = await isAuthorized();
      if (!user) {
        navigate(paths.LOGIN); // Redirect to login page if not authorized
      } else {
        updateUserData({ ...user });
        // navigate(paths.ROOT);
      }
    } catch (error) {
      console.error("Error checking authorization:", error);
      navigate(paths.LOGIN); // Redirect to login page if an error occurs
    }
  };

  return user && <>{children}</>;
};

export default PrivateRoute;

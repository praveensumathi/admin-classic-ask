import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import { adminLogin, isAuthorized } from "../../services/api";
import { ILoginFormInputs } from "../../interface/customer";
import { useSnackBar } from "../../context/SnackBarContext";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required()
    .typeError("Please enter the PhoneNumber")
    .matches(/^[0-9]{10}$/, "Please enter a valid phone number"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const { updateSnackBarState } = useSnackBar();
  const { updateUserData } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((show) => !show);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const handleLogin = async (data: ILoginFormInputs) => {
    try {
      const response = await adminLogin(data);
      if (response.data) {
        updateUserData({ ...response.data });

        if (response.data.role === "shop") {
          navigate(`/${paths.STORES}`);
        } else {
          navigate(paths.ROOT);
        }
      } else {
        console.log("Login failed");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        updateSnackBarState(true, error.response.data.message, "error");
      }
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    setIsLoading(true);
    let user;

    try {
      user = await isAuthorized();
      if (!user) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        updateUserData({ ...user });

        if (user.role === "shop") {
          navigate(paths.STORES);
        } else {
          navigate(paths.ROOT);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error checking authorization:", error);

      if (user && user.role === "shop") {
        navigate(paths.STORES);
      } else {
        navigate(paths.LOGIN);
      }
    }
  };

  return (
    <>
      {isLoading != null && !isLoading && (
        <>
          <AppBar>
            <Toolbar>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexGrow: 0,
                }}
              >
                <Link
                  to={paths.ROOT}
                  style={{ textDecoration: "none", display: "flex" }}
                >
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                    src="/assets/images/Logo2.jpg"
                    alt=""
                  />
                </Link>
                <Typography sx={{ fontWeight: 600 }}>Venus Ethnic</Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "70vh",
              marginTop: "20px",
            }}
          >
            <Box>
              <Typography variant="h5" align="center" gutterBottom>
                <b> Login</b>
              </Typography>
              <form onSubmit={handleSubmit(handleLogin)}>
                <Typography sx={{ fontWeight: 600, opacity: 0.7, my: "7px" }}>
                  PhoneNumber<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="tel"
                  {...register("phoneNumber")}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message?.toString()}
                  FormHelperTextProps={{
                    sx: { color: "red", marginLeft: "0px" },
                  }}
                  sx={{
                    mt: 0,
                    mb: "15px",
                  }}
                  autoComplete="new"
                  required
                />

                <Typography sx={{ my: "7px", fontWeight: 600, opacity: 0.7 }}>
                  Password<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  autoComplete="new"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message?.toString()}
                  required
                  sx={{
                    mt: 0,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 3 }}
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default Login;

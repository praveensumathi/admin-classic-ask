import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1B4C8C",
    },
    secondary: {
      main: "#ece7ee",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "Inter-Regular",
    button: {
      textTransform: "none",
      fontWeight: 500,
      textDecoration: "none",
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#1B4C8C",
          "&:hover": {
            backgroundColor: "#1B4C8C",
            color: "white",
          },
        },
      },
    },
  },
});

export default theme;

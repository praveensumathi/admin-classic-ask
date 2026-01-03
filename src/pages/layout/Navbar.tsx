import React from "react";
import { useNavbarStyle } from "../../styles/NavbarStyle";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavbarDrawer from "../../pageDrawer/Navbardrawer";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import { logOut } from "../../services/api";
import { useSnackBar } from "../../context/SnackBarContext";
import { useAuthContext } from "../../context/AuthContext";

function Navbar() {
  const classes = useNavbarStyle();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { updateSnackBarState } = useSnackBar();
  const { user, updateUserData } = useAuthContext();
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const [isNavBarOpen, setNavBarOpen] = React.useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setNavBarOpen((prevState) => !prevState);
  };

  const handleLogoutClick = async () => {
    await logOut()
      .then((response) => {
        if (response.status) {
          updateUserData(null);

          handleClose();
          navigate("/login");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.log(error.response.data);
          updateSnackBarState(true, error.response.data.message, "error");
        }
      });
  };

  return (
    <>
      <Box display={"flex"} flexGrow={1} className={classes.root}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon sx={{ color: "white !important" }} />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Link
                to={paths.ROOT}
                style={{ textDecoration: "none", display: "flex" }}
              >
                <img
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                  }}
                  src="/assets/images/Logo2.jpg"
                  alt=""
                />
              </Link>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {import.meta.env.VITE_HEADER_NAME}
              </Typography>
            </Box>
            <Stack
              flexDirection={"row"}
              flexGrow={1}
              alignItems={"center"}
              justifyContent={"flex-end"}
              gap={2}
              sx={{
                cursor: "pointer",
              }}
            >
              {user && (
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenuClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 28, height: 28 }}>
                      {user?.name ? user.name.toUpperCase()[0] : ""}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={isNavBarOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: isSmallScreen ? "50vw" : "20vw",
              },
            }}
          >
            <NavbarDrawer
              onDrawerToggle={handleDrawerToggle}
              role={user?.role}
            />
          </Drawer>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "& .MuiAvatar-root": {
              width: 25,
              height: 25,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Navbar;

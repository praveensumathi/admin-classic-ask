import { paths } from "../routes/paths";
import { useNavbarStyle } from "../styles/NavbarStyle";
import { NavLink as NavLinkBase } from "react-router-dom";
import React from "react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
interface INavbarProps {
  onDrawerToggle(): void;
  role: string | null | undefined;
}

const storeNavItems = [
  {
    label: "Stores",
    link: paths.STORES,
    icon: <ShoppingBasketIcon color="primary" />,
  },
  {
    label: "Offline Orders",
    link: paths.OFFLINEORDERS,
    icon: <LocalGroceryStoreIcon color="primary" />,
  },
];

const navItems = [
  // {label:"",link: paths.ROOT },
  {
    label: "Orders",
    link: paths.ROOT,
    icon: <AddShoppingCartIcon color="primary" />,
  },
  {
    label: "Products",
    link: paths.PRODUCT,
    icon: <StoreIcon color="primary" />,
  },
  {
    label: "Categories",
    link: paths.CATEGORY,
    icon: <CategoryIcon color="primary" />,
  },
  // {
  //   label: "Posters",
  //   link: paths.POSTERS,
  //   icon: <ImageIcon color="primary" />,
  // },
  {
    label: "Customers",
    link: paths.CUSTOMERS,
    icon: <GroupIcon color="primary" />,
  },

  {
    label: "Reports",
    link: paths.REPORTS,
    icon: <SummarizeIcon color="primary" />,
  },
];
function NavbarDrawer(props: INavbarProps) {
  const { onDrawerToggle, role } = props;

  const classes = useNavbarStyle();

  const NavLink = React.forwardRef(
    (props: any, ref: React.Ref<HTMLAnchorElement> | undefined) => (
      <NavLinkBase
        style={{
          textDecoration: "none",
        }}
        ref={ref}
        {...props}
        className={props.activeclassname ?? ""}
      />
    )
  );
  const filteredNavItems = role !== "shop" ? navItems : storeNavItems;

  return (
    <Box sx={{ textAlign: "start", height: "100%" }} onClick={onDrawerToggle}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        my={0}
        padding={3}
        sx={{
          backgroundColor: "#ece7ee",
        }}
      >
        <Typography color="primary" sx={{ fontWeight: 800 }} fontSize={"large"}>
          Venus Ethnic
        </Typography>
        <ArrowBackIosIcon sx={{ fontSize: "large" }} color="primary" />
      </Box>
      <Divider />
      <List>
        {filteredNavItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            component={NavLink}
            to={item.link}
            activeclassname={({ isActive }) =>
              isActive ? classes.activeLink : ""
            }
            sx={{ justifyContent: "center" }}
          >
            <ListItemButton sx={{ borderRadius: "0 10px 10px 0" }}>
              <Box display={"flex"} alignItems={"center"}>
                {item.icon}
                <ListItemText
                  sx={{
                    textAlign: "start",
                    marginLeft: "8px",
                    color: "primary.main",
                  }}
                  primary={item.label.trim()}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "absolute",
          bottom: "12px",
          left: 0,
          right: 0,
          opacity: 0.5,
        }}
      >
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          &copy; {new Date().getFullYear()} Venusethnic
        </Typography>
        <Typography>All rights reserved.</Typography>
      </Box>
    </Box>
  );
}

export default NavbarDrawer;

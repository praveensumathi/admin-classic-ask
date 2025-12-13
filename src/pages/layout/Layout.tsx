import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "./Navbar";

function Layout() {
  return (
    <Box className="test">
      <Navbar></Navbar>
      <Container
        maxWidth="xl"
        sx={{
          pb: 3,
          pt: 3,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;

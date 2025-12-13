import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";
import AttachmentIcon from "@mui/icons-material/Attachment";
import theme from "../theme/theme";
import { OrderStatusEnum } from "../common/components/enum/OrderEnum";
import { OfflineOrder } from "../interface/offlineOrders";

const OfflineOrderCard = (props: OfflineOrder) => {
  const { createdAt, orderNumber } = props;

  return (
    <Card
      sx={{
        boxShadow: 4,
        cursor: "pointer",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <CardContent>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography
            sx={{ fontSize: 12 }}
            noWrap
            color="text.primary"
            gutterBottom
          >
            <b>Order No:&nbsp;</b> {orderNumber}
          </Typography>
        </Box>

        <Divider />
        <Box>
          {createdAt && (
            <Typography
              sx={{ fontSize: 12, marginTop: 2 }}
              color="text.primary"
              gutterBottom
              component="div"
            >
              <b>Ordered At:&nbsp;</b>
              {dayjs(new Date(createdAt)).format("DD-MM-YYYY") ?? ""}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OfflineOrderCard;

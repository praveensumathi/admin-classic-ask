import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { IOrder } from "../interface/order";
import dayjs from "dayjs";
import AttachmentIcon from "@mui/icons-material/Attachment";
import theme from "../theme/theme";
import { OrderStatusEnum } from "../common/components/enum/OrderEnum";

interface IProps extends IOrder {
  selectedTabValue: string;
}

const OrderCard = (props: IProps) => {
  const {
    orderNumber,
    orderDateAndTime,
    hasTrackingAttachment,
    selectedTabValue,
  } = props;

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
          {OrderStatusEnum.Completed.toString() == selectedTabValue &&
            hasTrackingAttachment && <AttachmentIcon />}
        </Box>

        <Divider />
        <Box>
          {orderDateAndTime && (
            <Typography
              sx={{ fontSize: 12, marginTop: 2 }}
              color="text.primary"
              gutterBottom
              component="div"
            >
              <b>Ordered At:&nbsp;</b>
              {dayjs(new Date(orderDateAndTime)).format("DD-MM-YYYY") ?? ""}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Typography from "@mui/material/Typography";
import {
  Button,
  FormControl,
  Grid,
  OutlinedInput,
  TextField,
} from "@mui/material";
import OrderCard from "../../ordercard/OrderCard";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useGetAllOrders as useGetAllOrders } from "../../customHooksRQ/category/Hooks";
import dayjs from "dayjs";
import { OrderStatusEnum } from "../../common/components/enum/OrderEnum";

export default function Orders() {
  const location = useLocation();
  const navigate = useNavigate();

  const lastActiveTab =
    location && location.state ? location.state?.activeTab : "1";
  const [selectedTabValue, setSelectedTabValue] = React.useState(lastActiveTab);
  const [orderedDate, setOrderedDate] = React.useState<string | null>(null);
  const [orderNumber, setOrderNumber] = React.useState<string | null>(null);

  const { data, refetch } = useGetAllOrders(
    selectedTabValue,
    orderedDate,
    orderNumber
  );

  const handleChange = (event: any, newValue: string) => {
    setSelectedTabValue(newValue);
  };

  const handleClearFilter = () => {
    setOrderedDate(null);
    setOrderNumber(null);
  };

  React.useEffect(() => {
    if (orderNumber === null && orderedDate === null) {
      refetch();
    }
  }, [orderNumber, orderedDate]);

  React.useEffect(() => {
    if (location && location.state && location.state.activeTab) {
      if (location.state.activeTab != selectedTabValue) {
        setSelectedTabValue(location.state.activeTab);
      }
    }
  }, [location]);

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
      setOrderedDate(formattedDate);
    }
  };

  const handleOrderNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOrderNumber(event.target.value);
  };

  const handleSearch = () => {
    if (orderNumber || orderedDate) {
      refetch();
    }
  };

  const OrderCards = (
    <Grid container columnGap={4} rowGap={4}>
      {data && data.productOrderDetail.length > 0 ? (
        data.productOrderDetail.map((item) => (
          <Grid item xs={12} md={3} lg={2} key={item._id}>
            <Box
              onClick={() =>
                navigate(`${paths.ORDERSDETAILS}/${item._id}`, {
                  state: { activeTab: selectedTabValue },
                })
              }
            >
              <OrderCard
                orderNumber={item.orderNumber}
                orderDateAndTime={item.orderDateAndTime}
                hasTrackingAttachment={item.hasTrackingAttachment}
                selectedTabValue={selectedTabValue}
              />
            </Box>
          </Grid>
        ))
      ) : (
        <Typography sx={{ fontSize: 30 }}>No orders found</Typography>
      )}
    </Grid>
  );

  return (
    <>
      <Typography
        sx={{ fontSize: 30 }}
        color="textPrimary"
        gutterBottom
        component="div"
      >
        Orders ({data?.total})
      </Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            format="dd-MM-yyyy"
            value={orderedDate ? new Date(orderedDate) : null}
            onChange={(date) => handleDateChange(date)}
          />
        </LocalizationProvider>
        <form noValidate autoComplete="off">
          <FormControl sx={{ width: "25ch" }}>
            <TextField
              variant="outlined"
              label="Order Number"
              placeholder="VE-O-YYYY-YY-0"
              value={orderNumber || ""}
              onChange={handleOrderNumberChange}
            ></TextField>
          </FormControl>
        </form>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="outlined" onClick={handleClearFilter}>
            Clear filter
          </Button>
        </Box>
      </Box>

      <TabContext value={selectedTabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mt: 2 }}
          >
            <Tab label="Pending" value={OrderStatusEnum.Pending.toString()} />
            <Tab label="Accepted" value={OrderStatusEnum.Accepted.toString()} />
            <Tab label="Packed" value={OrderStatusEnum.Packed.toString()} />
            <Tab
              label="Completed"
              value={OrderStatusEnum.Completed.toString()}
            />
            <Tab
              label="Cancelled"
              value={OrderStatusEnum.Cancelled.toString()}
            />
          </TabList>
        </Box>

        <TabPanel value={OrderStatusEnum.Pending.toString()}>
          {OrderCards}
        </TabPanel>
        <TabPanel value={OrderStatusEnum.Accepted.toString()}>
          {OrderCards}
        </TabPanel>
        <TabPanel value={OrderStatusEnum.Packed.toString()}>
          {OrderCards}
        </TabPanel>
        <TabPanel value={OrderStatusEnum.Completed.toString()}>
          {OrderCards}
        </TabPanel>
        <TabPanel value={OrderStatusEnum.Cancelled.toString()}>
          {OrderCards}
        </TabPanel>
      </TabContext>
    </>
  );
}

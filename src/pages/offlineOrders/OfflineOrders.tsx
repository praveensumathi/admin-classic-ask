import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Divider, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useGetAllOfflineOrders } from "../../customHooksRQ/category/Hooks";
import dayjs from "dayjs";
import { paths } from "../../routes/paths";
import OfflineOrderCard from "../../ordercard/OfflineOrderCard";

export default function Orders() {
  const navigate = useNavigate();

  const [orderdDate, setOrderdDate] = React.useState<string | null>(null);
  const [orderNumber, setOrderNumber] = React.useState<string | null>(null);

  const { data, refetch } = useGetAllOfflineOrders(orderdDate, orderNumber);

  const handleClearFilter = () => {
    setOrderdDate(null);
    setOrderNumber(null);
  };

  React.useEffect(() => {
    if (orderNumber === null && orderdDate === null) {
      refetch();
    }
  }, [orderNumber, orderdDate]);

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
      setOrderdDate(formattedDate);
    }
  };

  const handleOrderNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOrderNumber(event.target.value);
  };

  const handleSearch = () => {
    if (orderNumber || orderdDate) {
      refetch();
    }
  };

  const offlineOrderCards = (
    <Grid container columnGap={4} rowGap={4}>
      {data && data.offlineOrders.length > 0 ? (
        data.offlineOrders.map((item) => (
          <Grid item xs={12} md={3} lg={2} key={item._id}>
            <Box
              onClick={() => navigate(`/${paths.STORES}/${item.orderNumber}`)}
            >
              <OfflineOrderCard
                _id={item._id}
                orderNumber={item.orderNumber}
                createdAt={item.createdAt}
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
        Offline Orders ({data?.total})
      </Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            format="dd-MM-yyyy"
            value={orderdDate ? new Date(orderdDate) : null}
            onChange={(date) => handleDateChange(date)}
          />
        </LocalizationProvider>

        <TextField
          variant="outlined"
          label="Order Number"
          placeholder="VE-OF-OO"
          value={orderNumber || ""}
          onChange={handleOrderNumberChange}
        ></TextField>

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

      <Divider sx={{ my: "15px" }} />

      <Box my={3}>{offlineOrderCards}</Box>
    </>
  );
}

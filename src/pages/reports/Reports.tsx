import { useState } from "react";
import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  getOnlineSellingReport,
  getOfflineOrdersReportByDateWise,
  getProductInstockReportByDateWise,
  getPurchaseProductReportByDateWise,
} from "../../services/api";
import { format } from "date-fns";
import { useSnackBar } from "../../context/SnackBarContext";
import GstBillpdf from "../orders/offlineGST/GstBillpdf";
import OnlineGSTPdf from "../orders/onlineGST/OnlineGSTPdf";
function Reports() {
  const { updateSnackBarState } = useSnackBar();
  const Reports = {
    offlineReport: "Offline Selling Report",
    onlineReport: "Online Selling Report",
    PurchaseProductReport: "Purchase Product Report",
    inStockReport: "Product InStock Report",
    offlineGstBill: "Offline GST Bill",
    onlineGstBill: "Online GST Bill",
  };

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const handleReport = async (reportFunction) => {
    if (!fromDate || !toDate) {
      updateSnackBarState(
        true,
        "Please select both FromDate and ToDate.",
        "error"
      );
      return;
    }

    if (fromDate > toDate) {
      updateSnackBarState(
        true,
        "The fromDate should be earlier than the toDate.",
        "error"
      );
      return;
    }

    try {
      const formattedFromDate = fromDate
        ? format(fromDate, "yyyy-MM-dd")
        : null;
      const formattedToDate = toDate ? format(toDate, "yyyy-MM-dd") : null;

      if (
        typeof formattedFromDate !== "string" ||
        typeof formattedToDate !== "string"
      ) {
        throw new Error("Invalid formatted dates");
      }

      const response = await reportFunction(formattedFromDate, formattedToDate);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const handleGetofflineReport = async () => {
    await handleReport(getOfflineOrdersReportByDateWise);
  };

  const handleGetPurchaseReport = async () => {
    await handleReport(getPurchaseProductReportByDateWise);
  };

  const handleGetInStockReport = async () => {
    await handleReport(getProductInstockReportByDateWise);
  };

  const handleGetOnlineReport = async () => {
    await handleReport(getOnlineSellingReport);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom component="div">
            Reports
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={Object.values(Reports)}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Report" />
            )}
            onChange={(event, value) => {
              setSelectedReport(value);
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            marginTop: 2,
          }}
        >
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd-MM-yyyy"
                label="FromDate"
                value={fromDate}
                onChange={(date) => setFromDate(date as Date)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd-MM-yyyy"
                label="ToDate"
                value={toDate}
                onChange={(date) => setToDate(date as Date)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {selectedReport === Reports.offlineReport ||
            selectedReport === Reports.onlineReport ||
            selectedReport === Reports.PurchaseProductReport ||
            selectedReport === Reports.inStockReport ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (selectedReport === Reports.offlineReport) {
                    handleGetofflineReport();
                  }
                  if (selectedReport === Reports.onlineReport) {
                    handleGetOnlineReport();
                  } else if (selectedReport === Reports.PurchaseProductReport) {
                    handleGetPurchaseReport();
                  } else if (selectedReport === Reports.inStockReport) {
                    handleGetInStockReport();
                  }
                }}
              >
                Get Report
              </Button>
            ) : selectedReport === Reports.offlineGstBill ? (
              <GstBillpdf fromDate={fromDate} toDate={toDate} />
            ) : selectedReport === Reports.onlineGstBill ? (
              <OnlineGSTPdf fromDate={fromDate} toDate={toDate} />
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Reports;

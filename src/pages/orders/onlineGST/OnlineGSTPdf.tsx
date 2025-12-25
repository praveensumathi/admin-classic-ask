import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import ReactDOM from "react-dom";
import {
  downloadGSTSalesReportExcel,
  getAllOnlineOrdersForGstByDateWise,
} from "../../../services/api";
import OnlineGSTBill from "./OnlineGSTBill";
import { format } from "date-fns";
import { useSnackBar } from "../../../context/SnackBarContext";

function OnlineGSTPdf({ fromDate, toDate }) {
  const { updateSnackBarState } = useSnackBar();

  const generatePDF = async () => {
    try {
      const formattedFromDate = fromDate
        ? format(fromDate, "yyyy-MM-dd")
        : null;
      const formattedToDate = toDate ? format(toDate, "yyyy-MM-dd") : null;

      const response = await getAllOnlineOrdersForGstByDateWise(
        formattedFromDate!,
        formattedToDate!
      ).then((response) => {
        if (response.orders && response.orders.length) {
          const container = document.createElement("div");

          response.orders.forEach((order, index) => {
            const billContainer = document.createElement("div");

            ReactDOM.render(
              <OnlineGSTBill
                key={`${index}-${order._id}`}
                productData={order}
              />,
              billContainer
            );

            // Create a new div for each billContainer to separate them into pages
            const pageContainer = document.createElement("div");
            pageContainer.appendChild(billContainer);

            // Add a page break except for the first page
            if (index > 0) {
              pageContainer.style.pageBreakBefore = "always";
            }

            container.appendChild(pageContainer);
          });

          html2pdf(container, {
            filename: `${formattedFromDate} to ${formattedToDate}-GST.pdf`,
          });
        } else {
          updateSnackBarState(true, "No Records Found", "error");
        }
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const generateGSTExcel = async () => {
    try {
      const formattedFromDate = format(fromDate, "yyyy-MM-dd");
      const formattedToDate = format(toDate, "yyyy-MM-dd");

      downloadGSTSalesReportExcel(formattedFromDate, formattedToDate);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Box>
      <Button onClick={generateGSTExcel} variant="contained">
        Generate Bill
      </Button>
    </Box>
  );
}

export default OnlineGSTPdf;

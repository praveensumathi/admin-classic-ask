import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Container,
  Divider,
} from "@mui/material";
import { IOfflineOrder } from "../../interface/product";

interface PrintComponentProps {
  offlineOrderData?: IOfflineOrder;
}

const PrintComponent = React.forwardRef<HTMLDivElement, PrintComponentProps>(
  (props, ref) => {
    const { offlineOrderData } = props;

    const generateSerialNumber = (productIndex: number, sizeIndex: number) => {
      if (!offlineOrderData || !offlineOrderData.sizeWithQuantityPrice) {
        return null;
      }
      return productIndex * getMaxSizes() + sizeIndex + 1;
    };
    const getMaxSizes = () => {
      if (!offlineOrderData || !offlineOrderData.sizeWithQuantityPrice) {
        return 0;
      }
      return Math.max(
        ...offlineOrderData.sizeWithQuantityPrice.map(
          (item) => item.sizes.length
        )
      );
    };

    let totalQuantity = 0;

    if (offlineOrderData) {
      for (const item of offlineOrderData.sizeWithQuantityPrice) {
        for (const size of item.sizes) {
          totalQuantity += size.billQuantity;
        }
      }
    }

    const totalPrice = offlineOrderData?.totalPrice;
    const discount = offlineOrderData?.discount;
    const result =
      totalPrice !== undefined && discount !== undefined
        ? totalPrice - discount
        : 0;

    const createdDate: Date | null = offlineOrderData
      ? new Date(offlineOrderData.createdAt || "")
      : null;

    return (
      <div ref={ref}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "large" }}>
              NKS COLLECTIONS
            </Typography>
            <Typography>
              Address:EB Colony Backside, Near to Sukaa
              Ganites,NAMAKKAL-637001,Ph.no:7010456239
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                textAlign: "center",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              Tax InVoice
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontWeight: 400, mb: 1 }}>
                Bill To:
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{offlineOrderData?.customerName}</span>
                  <span>{offlineOrderData?.phoneNumber}</span>
                </div>
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography sx={{ fontWeight: 400 }}>
                  INVOICE NO: {offlineOrderData?.orderNumber}
                </Typography>
                <Typography sx={{ fontWeight: 400 }}>
                  DATE:
                  {createdDate
                    ? createdDate.toLocaleDateString("en-IN")
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    S.No
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Product Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Item size
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Qty
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offlineOrderData &&
                  offlineOrderData.sizeWithQuantityPrice &&
                  offlineOrderData.sizeWithQuantityPrice.map((item, index) => {
                    return item.sizes.map((size, sizeIndex) => (
                      <TableRow key={`${index}-${sizeIndex}`}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {generateSerialNumber(index, sizeIndex)}
                        </TableCell>

                        <TableCell sx={{ textAlign: "center" }}>
                          {item.productCode}-{item.title}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {size.size}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {size.billQuantity}
                        </TableCell>
                        <TableCell
                          sx={{ textAlign: "center" }}
                        >{`₹${size.offlineSellingPrice}`}</TableCell>
                        <TableCell
                          sx={{ textAlign: "center" }}
                        >{`₹${size.totalPrice}`}</TableCell>
                      </TableRow>
                    ));
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Box sx={{ display: "flex", float: "right" }} my={1}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mr: 6 }}
              >
                No of Qty: {totalQuantity}
              </Typography>
              {offlineOrderData && offlineOrderData.discount !== 0 && (
                <Box sx={{ display: "flex", float: "right" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mr: 6 }}
                  >
                    Order Total: {`₹${offlineOrderData.totalPrice}`}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mr: 6 }}
                  >
                    Discount: {`₹${offlineOrderData.discount}`}
                  </Typography>
                </Box>
              )}
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mr: 6 }}
              >
                Total Price: {`₹${result}`}
              </Typography>
            </Box>
            <Divider sx={{ marginTop: 5, width: "100%" }} />
          </>
          <Box>
            <Typography sx={{ fontWeight: 600, mt: 2 }}>
              Terms and Conditions
            </Typography>
            <Typography>No Return/Exchange accepted after Billing.</Typography>
            <Typography sx={{ textAlign: "center" }}>
              Thanks for doing shopping with us!
            </Typography>
          </Box>
        </Container>
      </div>
    );
  }
);

export default PrintComponent;

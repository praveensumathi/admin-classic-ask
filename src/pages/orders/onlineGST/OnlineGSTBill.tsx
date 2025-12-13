import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { ToWords } from "to-words";
import { IGstBillOrders, Order } from "../../../interface/order";

interface IProps {
  key: string;
  productData: IGstBillOrders;
}

const OnlineGSTBill = (props: IProps) => {
  const { productData } = props;

  let totalQuantity = 0;
  productData.productdetail.forEach((data) => {
    if (Array.isArray(data.sizes)) {
      data.sizes.forEach((sizeData) => {
        totalQuantity += sizeData.quantity;
      });
    }
  });

  let totalAmount = 0;
  productData.productdetail.forEach((data) => {
    if (Array.isArray(data.sizes)) {
      data.sizes.forEach((sizeData) => {
        totalAmount += sizeData.quantity * sizeData.price;
      });
    }
  });

  const gridItemStyles = {
    borderInlineEnd: "1px solid #000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "14px",
  };

  const totalPrice = productData.totalPrice * 0.95;

  const cgstRate = 2.5;
  const sgstRate = 2.5;

  const cgstAmount = parseFloat(((totalPrice * cgstRate) / 100).toFixed(2));
  const sgstAmount = parseFloat(((totalPrice * sgstRate) / 100).toFixed(2));

  const totalGSTAmount = cgstAmount + sgstAmount;
  const totalAmountWithGST = totalPrice + cgstAmount + sgstAmount;

  const generateSerialNumbers = () => {
    return productData.productdetail.map((data, index) => index + 1);
  };
  const toWords = new ToWords();
  let wordsInTotalPrice = toWords.convert(totalAmountWithGST, {
    currency: true,
  });

  let wordsInTotalTaxAmount = toWords.convert(totalGSTAmount, {
    currency: true,
  });

  return (
    <>
      <Container sx={{ mt: 2 }}>
        <Typography textAlign="center" fontWeight="bolder">
          NKS Collection <span style={{ fontSize: "10px" }}>(Tax Invoice)</span>
        </Typography>
        <Typography
          variant="body2"
          fontSize="small"
          textAlign="center"
          fontWeight="bold"
        >
          NKS COLLECTIONS, 6/627-B, ANNA NAGAR, POYYERIKARAI MAIN ROAD,
          Namakkal, GSTIN/UIN:33FASPS4079G1ZJ, TamilNadu, Code:33
        </Typography>
        <Grid container border="1.5px solid #000" sx={{ display: "flex" }}>
          <Grid item md={4}>
            <Box p={1.5}>
              <Typography fontSize="small" flexWrap={"wrap"}>
                <span style={{ fontWeight: "bold" }}> Buyer(Bill To) : </span>
                {productData.shippingUserName
                  ? productData.shippingUserName
                  : productData.userName}
              </Typography>
              {/* <Typography fontSize="small">
                <span style={{ fontSize: "smaller" }}> GSTIN/UIN : </span>
              </Typography> */}
            </Box>
          </Grid>
          <Grid item md={4} sx={{ borderInline: "1px solid #000" }}>
            <Typography fontSize="small" p={1.5}>
              <span style={{ fontWeight: "bold" }}>Invoice No. : </span>
              {productData.orderNumber}
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Typography fontSize="small" p={1.5}>
              <span style={{ fontWeight: "bold" }}>Dated : </span>
              {new Date(productData.orderedDateAndTime).toLocaleDateString(
                "en-US",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ border: "1.5px solid #000" }} mt={2}>
          <Grid container sx={{ borderBottom: "1px solid #000" }}>
            <Grid item md={1} sx={gridItemStyles}>
              S.No.
            </Grid>
            <Grid item md={5} sx={gridItemStyles}>
              Description of Goods
            </Grid>
            <Grid item md={1} sx={gridItemStyles}>
              HSN / SAC
            </Grid>
            <Grid item md={1} sx={gridItemStyles}>
              Quantity
            </Grid>
            <Grid item md={1} sx={gridItemStyles}>
              Rate <span style={{ fontSize: "10px" }}>(in Rs.)</span>
            </Grid>
            <Grid item md={1} sx={gridItemStyles}>
              Per <span style={{ fontSize: "10px" }}>(NOS)</span>
            </Grid>
            <Grid
              item
              md={2}
              sx={{ textAlign: "center", fontWeight: "bold", fontSize: "14px" }}
            >
              Amount
            </Grid>
          </Grid>
          {/* Data Row */}
          {productData.productdetail.map((_productDetail, index) => (
            <Grid container key={index} sx={{ borderBottom: "1px solid #000" }}>
              <Grid
                item
                md={1}
                sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
              >
                {/* {data.sno} */}
                {generateSerialNumbers()[index]}
              </Grid>
              <Grid
                item
                md={5}
                sx={{ borderInlineEnd: "1px solid #000", pl: 1 }}
              >
                {_productDetail.title}
              </Grid>
              <Grid
                item
                md={1}
                sx={{ borderInlineEnd: "1px solid #000" }}
              ></Grid>
              {_productDetail.sizes &&
                _productDetail.sizes.map((sizeData, sizeIndex) => (
                  <React.Fragment key={sizeIndex}>
                    <Grid
                      item
                      md={1}
                      sx={{
                        borderInlineEnd: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {sizeData.quantity}
                    </Grid>
                    <Grid
                      item
                      md={1}
                      sx={{
                        borderInlineEnd: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {(sizeData.price * 0.95).toFixed(2)}
                    </Grid>
                    <Grid
                      item
                      md={1}
                      sx={{
                        borderInlineEnd: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      NOS
                    </Grid>
                    <Grid
                      item
                      md={2}
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {(sizeData.price * sizeData.quantity * 0.95).toFixed(2)}
                    </Grid>
                  </React.Fragment>
                ))}
            </Grid>
          ))}
          {/* Final Row */}
          <Grid container sx={{ borderBottom: "1.5px solid #000" }}>
            {/* <Grid item md={1}></Grid>
            <Grid item md={5}></Grid>
            <Grid item md={1}></Grid>
            <Grid item md={1}></Grid>
            <Grid item md={1}></Grid> */}
            <Grid item xs={10}></Grid>
            <Grid item md={2} sx={{ textAlign: "center" }}>
              {totalPrice}
            </Grid>
          </Grid>
          {/* CGST Row */}
          <Grid container>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            ></Grid>
            <Grid
              item
              md={5}
              sx={{ borderInlineEnd: "1px solid #000", fontWeight: "bold" }}
              textAlign="end"
              pr={1}
            >
              CGST@2.5%
            </Grid>
            <Grid item md={1} sx={{ borderInlineEnd: "1px solid #000" }}></Grid>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            ></Grid>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            >
              2.50%
            </Grid>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            ></Grid>
            <Grid
              item
              md={2}
              sx={{ textAlign: "center", borderBottom: "1px solid #000" }}
            >
              {cgstAmount}
            </Grid>
          </Grid>
          {/* SGST Row */}
          <Grid container>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            ></Grid>
            <Grid
              item
              md={5}
              sx={{ borderInlineEnd: "1px solid #000", fontWeight: "bold" }}
              textAlign="end"
              pr={1}
            >
              SGST@2.5%
            </Grid>
            <Grid item md={1} sx={{ borderInlineEnd: "1px solid #000" }}></Grid>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            ></Grid>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            >
              2.50%
            </Grid>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            ></Grid>
            <Grid
              item
              md={2}
              sx={{ textAlign: "center", borderBottom: "1px solid #000" }}
            >
              {sgstAmount}
            </Grid>
          </Grid>
          {/* Final Row */}
          <Grid container sx={{ borderBottom: "1.5px solid #000" }}>
            <Grid item md={1} sx={{ borderInlineEnd: "1px solid #000" }}></Grid>
            <Grid
              item
              md={5}
              sx={{
                textAlign: "end",
                borderInlineEnd: "1px solid #000",
                pr: 1,
                fontWeight: "bold",
              }}
            >
              Total
            </Grid>
            <Grid item md={1} sx={{ borderInlineEnd: "1px solid #000" }}></Grid>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            >
              {totalQuantity}
            </Grid>
            <Grid item md={1} sx={{ borderInlineEnd: "1px solid #000" }}></Grid>
            <Grid
              item
              md={1}
              sx={{ borderInlineEnd: "1px solid #000", textAlign: "center" }}
            ></Grid>
            <Grid item md={2} sx={{ textAlign: "center" }}>
              ₹{totalAmountWithGST.toFixed(2)}
            </Grid>
          </Grid>
          {/* Amount In Words */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography fontSize="10px">
                Amount Chargeable (in words)
              </Typography>
              <Typography fontSize="12px" fontWeight="bold">
                {wordsInTotalPrice}
              </Typography>
            </Box>
            <Box>
              <Typography fontSize="smaller">E. & O.E</Typography>
            </Box>
          </Box>
          <Grid container borderBottom="1.5px solid #000">
            <Grid item md={4} fontSize="small" textAlign="center">
              HSN/SAC
            </Grid>
            <Grid
              item
              md={8}
              sx={{
                borderTop: "1.5px solid #000",
                borderLeft: "1.5px solid #000",
              }}
            >
              <Grid container borderBottom="1.5px solid #000">
                <Grid
                  item
                  md={3}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  Taxable
                </Grid>

                <Grid
                  item
                  md={3}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  Central Tax
                </Grid>
                <Grid
                  item
                  md={3}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  State Tax
                </Grid>
                <Grid item md={3} fontSize="small" textAlign="center">
                  Total
                </Grid>
              </Grid>
              <Grid container borderBottom="1.5px solid #000">
                <Grid
                  item
                  md={3}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  Value
                </Grid>
                <Grid
                  item
                  md={1.5}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  Rate
                </Grid>
                <Grid
                  item
                  md={1.5}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  Amount
                </Grid>
                <Grid
                  item
                  md={1.5}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  Rate
                </Grid>
                <Grid
                  item
                  md={1.5}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  Amount
                </Grid>
                <Grid item md={3} fontSize="small" textAlign="center">
                  TaxAmount
                </Grid>
              </Grid>
              <Grid container>
                <Grid
                  item
                  md={3}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  {totalPrice}
                </Grid>
                <Grid
                  item
                  md={1.5}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  {cgstRate}
                </Grid>
                <Grid
                  item
                  md={1.5}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  {cgstAmount}
                </Grid>
                <Grid
                  item
                  md={1.5}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  {sgstRate}
                </Grid>
                <Grid
                  item
                  md={1.5}
                  fontSize="small"
                  borderRight="1.5px solid #000"
                  textAlign="center"
                >
                  {sgstAmount}
                </Grid>
                <Grid item md={3} fontSize="small" textAlign="center">
                  {totalGSTAmount}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ borderBottom: "1.5px solid #000" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
              }}
              gap={3}
            >
              <Typography fontSize="10px">
                Total TaxAmount (in words) :
              </Typography>
              <Typography fontSize="12px" fontWeight="bold">
                {wordsInTotalTaxAmount}
              </Typography>
            </Box>
          </Box>
          <Grid container>
            <Grid
              item
              md={4}
              fontSize="small"
              borderRight="1px solid #000"
              p={1}
            >
              <Typography fontSize="15px">Declaration :</Typography>
              We declare that this invoice shows the actual price of the goods
              described and that all particulars are true and correct
            </Grid>
            <Grid item md={8}>
              <Typography
                fontSize="small"
                fontWeight="bold"
                textAlign="center"
                mb={3}
              >
                For NKS Collection
              </Typography>
              <Typography fontSize="small" textAlign="center" mt={3}>
                Authorised Signatory
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Typography fontSize="7px" textAlign="center">
          This is a Computer Generated Invoice
        </Typography>
      </Container>
    </>
  );
};

export default OnlineGSTBill;

import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Box,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Radio,
  Grid,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  createNewOfflineOrder,
  fetchProductByProductCode,
  getOfflineOrdersByOrderNumber,
  updateOfflineOrder,
} from "../../services/api";
import CommonPrintDialog from "../../common/components/CommonPrintDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IOfflineOrder,
  IOfflineOrderSize,
  IOfflineOrderSizeWithQuantityPrice,
} from "../../interface/product";
import { useSnackBar } from "../../context/SnackBarContext";
import { DebounceInput } from "react-debounce-input";
import SearchTextField from "../../common/components/SearchTextField";
import { useParams } from "react-router-dom";
function Stores() {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("UPI");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [offlineOrderData, setOfflineOrderData] = useState<IOfflineOrder>();
  const [customerDetails, setCustomerDetails] = useState<{
    customerName: string;
    phoneNumber?: string;
  }>({
    customerName: "",
    phoneNumber: "",
  });

  const { orderNumber } = useParams();

  const [discount, setDiscount] = useState<number>(0);

  const [removedOrderedProductIds, setRemovedOrderedProductIds] = useState<
    string[]
  >([]);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [enteredOrderNumber, setEnteredOrderNumber] = useState(
    orderNumber ?? ""
  );

  const initialRows: IOfflineOrderSizeWithQuantityPrice[] = Array.from(
    { length: 4 },
    (_, index) => ({
      id: index + 1,
      productId: "",
      title: "",
      productCode: "",
      orderedProductId: "",
      selectedSize: null,
      sizes: [] as IOfflineOrderSize[],
    })
  );

  const [purchasedProductData, setPurchasedProductData] =
    useState<IOfflineOrderSizeWithQuantityPrice[]>(initialRows);

  const { updateSnackBarState } = useSnackBar();

  const handleFetchOrderDetails = async () => {
    try {
      await getOfflineOrdersByOrderNumber(enteredOrderNumber).then(
        (orderData) => {
          setOrderId(orderData._id);
          const _purchasedProductData = orderData.sizeWithQuantityPrice.map(
            (purchasedSize) => {
              return {
                ...purchasedSize,
                selectedSize: purchasedSize.sizes[0],
              };
            }
          );
          setPurchasedProductData(_purchasedProductData || []);
          setCustomerDetails((prevDetails) => ({
            ...prevDetails,
            phoneNumber: orderData.phoneNumber,
            customerName: orderData.customerName,
          }));

          setTotalPrice(orderData.totalPrice || 0);

          setDiscount(orderData.discount || 0);
        }
      );
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleSearchButtonClick = () => {
    handleFetchOrderDetails();
  };

  useEffect(() => {
    if (orderNumber) {
      //setEnteredOrderNumber(orderNumber.trim());

      handleSearchButtonClick();
    }
  }, []);

  const updateAvailableSizes = (productData, rowId) => {
    const updatedRows = purchasedProductData.map((row) => {
      if (row.id === rowId) {
        const availableSizes = productData.sizes.map((size) => size.size);
        return { ...row, availableSizes };
      }
      return row;
    });

    setPurchasedProductData(updatedRows);
  };

  const handleSizeChange = (
    selectedSize: IOfflineOrderSize | null,
    rowId: number | undefined,
    productId: string
  ) => {
    var _purchasedProductData = purchasedProductData.map((row) => {
      if (row.id === rowId && row.productId === productId) {
        row.selectedSize = {
          ...selectedSize,
          totalPrice: 0,
        } as IOfflineOrderSize;
      }
      return row;
    });
    setPurchasedProductData([..._purchasedProductData]);
  };

  const handleProductCodeChange = async (event, rowId) => {
    const productCode = event.target.value.toUpperCase();

    if (productCode.length >= 2) {
      try {
        const productData = await fetchProductByProductCode(productCode);

        setPurchasedProductData((prevData) => {
          const updatedData = prevData.map((row) => {
            if (row.id === rowId) {
              const updatedRow: IOfflineOrderSizeWithQuantityPrice = {
                ...row,
                productCode: productData.productCode,
                productId: productData.productId,
                title: productData.title,
                selectedSize: null,
                sizes: productData.sizes,
              };

              row = updatedRow;
            }

            return row;
          });

          updateAvailableSizes(productData, rowId);
          updateTotalPrice();

          return updatedData;
        });
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        updateSnackBarState(true, errorMessage, "error");
      }
    }
  };

  const handlePaymentModeChange = (event) => {
    setSelectedPaymentMode(event.target.value);
  };

  const handleClear = () => {
    setCustomerDetails({
      customerName: "",
      phoneNumber: "",
    });
  };

  const handleAddRow = () => {
    const newRow: IOfflineOrderSizeWithQuantityPrice = {
      id: purchasedProductData.length + 1,
      productId: "",
      title: "",
      productCode: "",
      orderedProductWithSizeObjectId: "",
      selectedSize: null,
      sizes: [] as IOfflineOrderSize[],
    };

    setPurchasedProductData((prevRows) => [...prevRows, newRow]);
  };

  const handleQuantityChange = (
    productCode: string,
    size: string | undefined,
    quantity: number
  ) => {
    if (size) {
      setPurchasedProductData((prevData) => {
        const updatedData = prevData.map((data) => {
          if (
            data.productCode === productCode &&
            data.selectedSize &&
            data.selectedSize?.size == size
          ) {
            data.selectedSize.billQuantity = quantity;
            data.selectedSize.totalPrice =
              quantity * data.selectedSize.offlineSellingPrice;
          }
          return data;
        });

        return updatedData;
      });
      updateTotalPrice();
    }
  };

  const updateTotalPrice = () => {
    let overallTotalPrice = 0;

    overallTotalPrice = purchasedProductData.reduce((acc, data) => {
      return acc + (data.selectedSize ? data.selectedSize?.totalPrice : 0);
    }, 0);

    setTotalPrice(overallTotalPrice);
  };

  const handleCashReceivedChange = (event) => {
    const amount = parseFloat(event.target.value) || 0;
    setCashReceived(amount);
  };

  const handleDeleteOrderedProductId = async (orderedProductId: string) => {
    try {
      const deletedProductData = purchasedProductData.find(
        (productData) =>
          productData.orderedProductWithSizeObjectId === orderedProductId
      );

      if (deletedProductData && deletedProductData.selectedSize) {
        setTotalPrice((prevTotalPrice) => {
          return (
            prevTotalPrice - (deletedProductData.selectedSize?.totalPrice || 0)
          );
        });
      }

      const updatedProductData = purchasedProductData.filter(
        (productData) =>
          productData.orderedProductWithSizeObjectId !== orderedProductId
      );

      setPurchasedProductData([...updatedProductData]);

      const newRemovedOrderedProductIds = [
        ...removedOrderedProductIds,
        orderedProductId,
      ];

      setRemovedOrderedProductIds([...newRemovedOrderedProductIds]);
    } catch (error) {
      console.error("Error deleting product:", error);
      updateSnackBarState(true, "Error deleting product", "error");
    }
  };

  const handleSave = async () => {
    let overallTotalPrice = 0;

    const sizeWithQuantityPrice: IOfflineOrderSizeWithQuantityPrice[] = [];

    overallTotalPrice = purchasedProductData.reduce((acc, data) => {
      return acc + (data.selectedSize ? data.selectedSize?.totalPrice : 0);
    }, 0);

    purchasedProductData.forEach((data) => {
      if (data.selectedSize && data.selectedSize.billQuantity > 0) {
        const size = data.selectedSize;

        const sizeInfo: IOfflineOrderSize = {
          size: size.size,
          offlineSellingPrice: size.offlineSellingPrice,
          inStock: size.inStock,
          billQuantity: size.billQuantity,
          totalPrice: size.totalPrice,
          sizeId: size.sizeId,
        };

        sizeWithQuantityPrice.push({
          productId: data.productId,
          productCode: data.productCode,
          title: data.title,
          sizes: [sizeInfo],
          orderedProductWithSizeObjectId:
            data.orderedProductWithSizeObjectId ?? "",
        });
      }
    });

    setTotalPrice(overallTotalPrice);

    const dataToSend: IOfflineOrder = {
      sizeWithQuantityPrice,
      totalPrice: overallTotalPrice,
      discount,
      modeOfTransaction: selectedPaymentMode,
      customerName: customerDetails.customerName,
      phoneNumber: customerDetails.phoneNumber,
      removedOrderedProductIds: removedOrderedProductIds,
    };

    try {
      if (orderId) {
        const updatedOfflineOrderData = await updateOfflineOrder(
          orderId,
          dataToSend
        );

        if (updatedOfflineOrderData && updatedOfflineOrderData.data) {
          setOfflineOrderData(updatedOfflineOrderData.data);
        }
      } else {
        await createNewOfflineOrder(dataToSend)
          .then((newOfflineOrderData) => {
            setOfflineOrderData(newOfflineOrderData);
            handleReset();
            setPrintDialogOpen(true);
          })
          .catch((_e) => {
            updateSnackBarState(
              true,
              "Error while create Offline Order",
              "error"
            );
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (rowId) => {
    const deletedProductData = purchasedProductData.find(
      (row) => row.id === rowId
    );

    if (deletedProductData && deletedProductData.selectedSize) {
      setTotalPrice((prevTotalPrice) => {
        return (
          prevTotalPrice - (deletedProductData.selectedSize?.totalPrice || 0)
        );
      });
    }

    setPurchasedProductData((prevRows) => {
      const updatedRows = prevRows.filter((row) => row.id !== rowId);
      return updatedRows;
    });
  };

  const handleReset = () => {
    setPurchasedProductData([...initialRows]);
    setSelectedPaymentMode("UPI");
    setTotalPrice(0);
    setPrintDialogOpen(false);
    setCashReceived(0);
    setDiscount(0);
    setEnteredOrderNumber("");
    setOrderId("");
    setCustomerDetails({
      customerName: "",
      phoneNumber: "",
    });
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    const numbersOnly = input.replace(/[^0-9]/g, "");
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      phoneNumber: numbersOnly,
    }));
  };

  const TotalBillQuantity = () => {
    let totalBillQuantity = 0;

    totalBillQuantity = purchasedProductData.reduce(
      (acc, data) =>
        acc + (data.selectedSize ? data.selectedSize?.billQuantity : 0),
      0
    );

    return totalBillQuantity;
  };

  return (
    <>
      <Container maxWidth={false}>
        <Typography variant="h4" gutterBottom component="div">
          Store Billing
        </Typography>
        <Box sx={{ display: "flex", my: 4, justifyContent: "space-between" }}>
          <Box>
            <TextField
              variant="outlined"
              size="small"
              label="Customer Name"
              value={customerDetails.customerName}
              onChange={(e) =>
                setCustomerDetails((prevDetails) => ({
                  ...prevDetails,
                  customerName: e.target.value,
                }))
              }
              sx={{ mr: 2 }}
            />

            <TextField
              variant="outlined"
              size="small"
              label="Customer Pno."
              value={customerDetails.phoneNumber}
              onChange={handlePhoneNumberChange}
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: !!customerDetails.phoneNumber,
              }}
            />
            <Button variant="contained" color="primary" onClick={handleClear}>
              Clear
            </Button>
          </Box>
          <Box>
            <TextField
              variant="outlined"
              size="small"
              label="Order Number"
              placeholder="VE-OF-0"
              value={enteredOrderNumber}
              onChange={(e) => setEnteredOrderNumber(e.target.value.trim())}
              sx={{ mr: 1 }}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchButtonClick}
            >
              Search
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginBottom: "20px", boxShadow: "3px" }}>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Product Code
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Size
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        In Stock
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Off. Price
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Bill Quantity
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Total
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderId
                      ? purchasedProductData.map((productData) =>
                          productData.sizes.map((sizeInfo) => (
                            <TableRow
                              key={`${productData.productCode}-${sizeInfo.size}`}
                            >
                              <TableCell sx={{ textAlign: "center" }}>
                                {productData.productCode}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {sizeInfo.size}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {sizeInfo.inStock}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {sizeInfo.offlineSellingPrice}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  sx={{ width: 100 }}
                                  InputProps={{ inputProps: { min: 0 } }}
                                  defaultValue={sizeInfo.billQuantity}
                                  onChange={(e) => {
                                    const quantity =
                                      parseInt(e.target.value, 10) || 0;
                                    handleQuantityChange(
                                      productData.productCode,
                                      sizeInfo.size,
                                      quantity
                                    );
                                  }}
                                />
                              </TableCell>

                              <TableCell sx={{ textAlign: "center" }}>
                                ₹{sizeInfo.totalPrice}
                              </TableCell>
                              {/* Other table cells */}
                              <TableCell sx={{ textAlign: "center" }}>
                                <IconButton
                                  onClick={() =>
                                    handleDeleteOrderedProductId(
                                      productData.orderedProductWithSizeObjectId!
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )
                      : purchasedProductData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell
                              sx={{ textAlign: "center", width: "20%" }}
                            >
                              <DebounceInput
                                element={SearchTextField}
                                id={`productCode-${row.id}`}
                                debounceTimeout={2000}
                                placeholder="Code"
                                value={row.productCode}
                                size="small"
                                sx={{ width: 120 }}
                                onChange={(e) =>
                                  handleProductCodeChange(e, row.id)
                                }
                                type="text"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", width: "15%" }}
                            >
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                value={row.selectedSize}
                                options={row.sizes || []}
                                sx={{ width: 130 }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Size"
                                    size="small"
                                    sx={{ textAlign: "center" }}
                                  />
                                )}
                                getOptionLabel={(option) => option.size}
                                isOptionEqualToValue={(option, value) =>
                                  option.size === value.size
                                }
                                onChange={(event, newSize) => {
                                  handleSizeChange(
                                    newSize,
                                    row.id,
                                    row.productId
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", width: "15%" }}
                            >
                              {row.selectedSize && row.selectedSize.inStock}
                            </TableCell>

                            <TableCell
                              sx={{ textAlign: "center", width: "15%" }}
                            >
                              {row.selectedSize &&
                                row.selectedSize.offlineSellingPrice}
                            </TableCell>

                            <TableCell
                              sx={{ textAlign: "center", width: "20%" }}
                            >
                              <TextField
                                variant="outlined"
                                size="small"
                                type="number"
                                value={row.selectedSize?.billQuantity || 0}
                                sx={{ width: "100px" }}
                                InputProps={{
                                  inputProps: {
                                    min: 0,
                                    max: row.selectedSize?.inStock || 0,
                                  },
                                }}
                                onChange={(e) => {
                                  const quantity =
                                    parseInt(e.target.value, 10) || 0;
                                  handleQuantityChange(
                                    row.productCode,
                                    row.selectedSize?.size,
                                    quantity
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", width: "15%" }}
                            >
                              ₹
                              {(row.selectedSize &&
                                row.selectedSize.totalPrice) ||
                                0}
                            </TableCell>

                            <TableCell sx={{ textAlign: "center" }}>
                              <IconButton onClick={() => handleDelete(row.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    <TableRow>
                      <TableCell colSpan={4} />
                      <TableCell align="left">
                        <Typography sx={{ fontWeight: 600 }}>
                          Total Qty: {TotalBillQuantity()}
                        </Typography>
                      </TableCell>
                      <TableCell align="left" colSpan={2}>
                        <Typography sx={{ fontWeight: 600 }}>
                          Order Total: ₹{totalPrice}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {!orderId && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <Button variant="outlined" onClick={handleAddRow}>
                      <AddIcon />
                      Add Row
                    </Button>
                  </Box>
                )}
              </TableContainer>
            </Grid>
          </Grid>
        </Box>

        {purchasedProductData.length > 0 && (
          <>
            <Box sx={{ display: "flex", alignItems: "center" }} gap={2}>
              <Typography sx={{ fontWeight: 600 }}>Mode of Payment:</Typography>
              <Box>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  row
                  value={selectedPaymentMode}
                  onChange={handlePaymentModeChange}
                >
                  <FormControlLabel
                    value="UPI"
                    control={<Radio />}
                    label="UPI"
                  />
                  <FormControlLabel
                    value="Cash"
                    control={<Radio />}
                    label="Cash"
                  />
                  <FormControlLabel
                    value="Card"
                    control={<Radio />}
                    label="Card"
                  />
                </RadioGroup>
              </Box>
            </Box>
            <Divider />
            <Box display={"flex"} gap={6} my={2}>
              {/* Discount Section */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }} py={2}>
                    Discount (₹):
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={discount}
                    size="small"
                    onChange={(e) =>
                      setDiscount(parseFloat(e.target.value) || 0)
                    }
                  />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }} py={2}>
                  Total Price:&nbsp;&nbsp;₹{totalPrice - discount}
                </Typography>
              </Box>
              <Box>
                {selectedPaymentMode === "Cash" && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }} py={2}>
                        Cash Received (₹):
                      </Typography>
                      <TextField
                        size="small"
                        value={cashReceived}
                        onChange={handleCashReceivedChange}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" py={2}>
                        Amount To Return:&nbsp;&nbsp;₹
                        {cashReceived > 0 && cashReceived > totalPrice
                          ? cashReceived - (totalPrice - discount)
                          : 0}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </>
        )}
      </Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          pb: 2,
        }}
      >
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>

        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
      <CommonPrintDialog
        title="Print Receipt"
        content="Do You Want To Print Receipt?"
        dialogOpen={printDialogOpen}
        onPrintclose={() => setPrintDialogOpen(false)}
        offlineOrderData={offlineOrderData}
      />
    </>
  );
}

export default Stores;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { paths } from "../../routes/paths";
import { getOrderDetailByOrderId, updateOrderStatus } from "../../services/api";
import { IOrderDetailByOrderID } from "../../interface/order";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { OrderStatusEnum } from "../../common/components/enum/OrderEnum";
import { useSnackBar } from "../../context/SnackBarContext";
import AcceptOrderDialog from "./AcceptOrderDialog";
import theme from "../../theme/theme";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";

function OrdersDetails() {
  const { id } = useParams();
  const { updateSnackBarState } = useSnackBar();
  const navigate = useNavigate();
  const location = useLocation();

  const [orderDetail, setOrderDetail] = useState<
    IOrderDetailByOrderID | undefined
  >(undefined);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [isTransactionIdCopied, setIsTransactionIdCopied] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [isAcceptOrderDialogOpen, setAcceptOrderDialogOpen] = useState(false);
  const [isCancelConfirmDialogOpen, setIsCancelConfirmDialogOpen] =
    useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const isPending = orderDetail?.status === OrderStatusEnum.Pending;
  const isAccepted = orderDetail?.status === OrderStatusEnum.Accepted;
  const isPacked = orderDetail?.status === OrderStatusEnum.Packed;
  const isCompleted = orderDetail?.status === OrderStatusEnum.Completed;

  useEffect(() => {
    if (id != "") {
      fetchOrderDetailById();
    }
  }, []);

  const fetchOrderDetailById = async () => {
    setIsLoading(true);
    try {
      const orderDetailById = await getOrderDetailByOrderId(id!);
      setOrderDetail(orderDetailById);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updatesOrderStatus = async (status: number) => {
    const formData = new FormData();
    formData.append("acceptOrderImage", "");
    formData.append("status", `${status}`);
    formData.append("id", id!);
    formData.append("cancelReason", cancellationReason);

    await updateOrderStatus(formData)
      .then((response) => {
        const lastActiveTab =
          location && location.state ? location.state?.activeTab : "1";
        navigate(paths.ROOT, {
          state: { activeTab: lastActiveTab },
        });
        updateSnackBarState(true, "Status updated successfully", "success");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.log(error.response.data);
          updateSnackBarState(true, error.response.data.message, "error");
        }
      });
  };

  const copyAddressToClipboard = () => {
    var address = orderDetail?.shippingDetail?.address;

    if (address) {
      address =
        `Order Number : ${orderDetail?.orderNumber}` +
        "\n" +
        `Address :` +
        "\n" +
        address;

      navigator.clipboard.writeText(address);
      setIsAddressCopied(true);
      setTimeout(() => {
        setIsAddressCopied(false);
      }, 3000);
    }
  };

  const copyTransactionIdToClipboard = () => {
    const id = orderDetail?.paymentInfo.originalTransactionId;
    if (id) {
      navigator.clipboard.writeText(id);
      setIsTransactionIdCopied(true);
      setTimeout(() => {
        setIsTransactionIdCopied(false);
      }, 3000);
    }
  };

  const handleAcceptOrderButtonClick = () => {
    setAcceptOrderDialogOpen(true);
  };

  return (
    <>
      {isLoading != null && !isLoading && (
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom component="div">
                <IconButton>
                  <ArrowBackIcon
                    sx={{}}
                    onClick={() => {
                      const lastActiveTab =
                        location && location.state
                          ? location.state?.activeTab
                          : "1";
                      navigate(paths.ROOT, {
                        state: { activeTab: lastActiveTab },
                      });
                    }}
                  />
                </IconButton>
                Order Details
              </Typography>
            </Grid>
            {orderDetail && (
              <>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }} mb={1}>
                    <Typography variant="h6" component="div" fontWeight="600">
                      Delivery Address
                      <Tooltip
                        title={isAddressCopied ? "Copied!" : "Copy Address"}
                        arrow
                      >
                        <ContentCopyIcon
                          sx={{ marginLeft: "20px", cursor: "pointer" }}
                          onClick={copyAddressToClipboard}
                        />
                      </Tooltip>
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1">
                    <Typography component={"span"} sx={{ fontWeight: "600" }}>
                      Name: &nbsp;
                    </Typography>
                    {orderDetail.userName}
                  </Typography>

                  <Typography variant="subtitle1">
                    <Box sx={{ fontWeight: "600" }}>Address:</Box>
                    {orderDetail.shippingDetail.address},&nbsp;
                    <br /> <br />
                    {orderDetail.shippingDetail.district},&nbsp;
                    {orderDetail.shippingDetail.state},&nbsp;
                    {orderDetail.shippingDetail.pincode}.
                  </Typography>
                  <Typography variant="subtitle1">
                    <Typography
                      style={{ fontWeight: "600" }}
                      component={"span"}
                    >
                      Phone Number:&nbsp;
                    </Typography>
                    {orderDetail.shippingDetail.phoneNumber}
                  </Typography>
                  <Typography variant="subtitle1">
                    <Typography
                      style={{ fontWeight: "600" }}
                      component={"span"}
                    >
                      Order Number:&nbsp;
                    </Typography>
                    {orderDetail.orderNumber}
                  </Typography>

                  <Typography variant="subtitle1">
                    <Typography
                      style={{ fontWeight: "600" }}
                      component={"span"}
                    >
                      CourierType:&nbsp;
                    </Typography>
                    {orderDetail.courierType}
                  </Typography>

                  <Typography variant="subtitle1">
                    <Typography
                      style={{ fontWeight: "600" }}
                      component={"span"}
                    >
                      Curier Charge:&nbsp;
                    </Typography>
                    {orderDetail.curierCharge ?? 0}
                  </Typography>

                  {orderDetail.status == OrderStatusEnum.Cancelled && (
                    <Typography variant="subtitle1">
                      <Typography
                        style={{ fontWeight: "600" }}
                        component={"span"}
                      >
                        Cancel Reason:&nbsp;
                      </Typography>
                      {orderDetail.cancellationReason}
                    </Typography>
                  )}

                  {orderDetail.paymentInfo && (
                    <Typography
                      variant="subtitle1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography
                        style={{ fontWeight: "600" }}
                        component={"span"}
                      >
                        Transation ID:&nbsp;
                      </Typography>
                      <Box>
                        {orderDetail.paymentInfo.merchantTransactionId}
                        <Tooltip
                          title={isTransactionIdCopied ? "Copied!" : "Copy Id"}
                          arrow
                        >
                          <ContentCopyIcon
                            fontSize="small"
                            sx={{ marginLeft: "20px", cursor: "pointer" }}
                            onClick={copyTransactionIdToClipboard}
                          />
                        </Tooltip>
                      </Box>
                    </Typography>
                  )}
                </Grid>
              </>
            )}
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "flex-end",
              }}
            >
              {isPending && (
                <Button
                  variant="contained"
                  onClick={() => updatesOrderStatus(OrderStatusEnum.Accepted)}
                >
                  Accept Order
                </Button>
              )}
              {isAccepted && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => updatesOrderStatus(OrderStatusEnum.Packed)}
                >
                  Order Packed
                </Button>
              )}
              {isPacked && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => updatesOrderStatus(OrderStatusEnum.Completed)}
                >
                  Order Completed
                </Button>
              )}
              {(isPending || isAccepted || isPacked) && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setIsCancelConfirmDialogOpen(true)}
                >
                  Cancel Order
                </Button>
              )}
              {isCompleted && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAcceptOrderButtonClick}
                >
                  Upload Tracking Info
                </Button>
              )}

              {isCompleted && orderDetail.image && (
                <Box mb={2}>
                  <img
                    src={orderDetail.image}
                    style={{
                      width: "auto",
                      height: "200px",
                      objectFit: "contain",
                    }}
                    alt="Attachment"
                  />
                  <br />
                  <Typography
                    color={theme.palette.primary.main}
                    component={"a"}
                    href={orderDetail.image}
                    target="_blank"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <DownloadIcon /> Download Attachment
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          <Divider />
          <Typography mt={3} variant="h6" fontWeight="600">
            Ordered Products
          </Typography>
          <Box my={2}>
            <TableContainer
              sx={{
                boxShadow: 2,
                width: "80%",
              }}
            >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Product Code
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Image
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Size - Quantity
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ p: "10px" }}>
                  {orderDetail?.productdetail &&
                  orderDetail.productdetail.length > 0 ? (
                    orderDetail.productdetail.map((product) => (
                      <TableRow key={product.productCode}>
                        <TableCell>{product.productCode}</TableCell>
                        <TableCell>
                          <img src={product.posterURL} height={70} width={70} />
                        </TableCell>
                        <TableCell>
                          {product.sizes && product.sizes.length > 0 ? (
                            product.sizes.map((size) => (
                              <Box key={`${size.size}-${size.quantity}`}>
                                {`${size.size}-${size.quantity}`}
                                <br />
                              </Box>
                            ))
                          ) : (
                            <Box>No sizes found.</Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>No products found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "end ",
            }}
          >
            {orderDetail && (
              <Box>
                <Typography variant="h6">
                  DeliveryFee:&nbsp;
                  <span style={{ fontWeight: "bold" }}>
                    &#8377;{orderDetail.deliveryFee}
                  </span>
                </Typography>
                <Typography variant="h6">
                  OrderTotal:&nbsp;
                  <span style={{ fontWeight: "bold" }}>
                    &#8377;{orderDetail.totalPrice}
                  </span>
                </Typography>
                <Typography variant="h6">
                  Total:&nbsp;
                  <span style={{ fontWeight: "bold" }}>
                    &#8377;{orderDetail.totalPrice + orderDetail.deliveryFee}
                  </span>
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      )}

      {isAcceptOrderDialogOpen && (
        <AcceptOrderDialog
          dialogOpen={isAcceptOrderDialogOpen}
          onDialogClose={() => setAcceptOrderDialogOpen(false)}
          orderId={id!}
          status={OrderStatusEnum.Accepted}
        />
      )}

      {isCancelConfirmDialogOpen && (
        <Dialog
          open={isCancelConfirmDialogOpen}
          onClose={() => setIsCancelConfirmDialogOpen(false)}
          PaperProps={{ sx: { width: "30vw" } }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={"600"}>
              Cancel Reason
            </Typography>
            <IconButton onClick={() => setIsCancelConfirmDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <TextField
              fullWidth
              id="outlined-textarea"
              label="Reason"
              multiline
              minRows={3}
              onChange={(event) => setCancellationReason(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!cancellationReason.trim()}
              variant="contained"
              color="error"
              fullWidth
              onClick={() => updatesOrderStatus(OrderStatusEnum.Cancelled)}
            >
              Cancel Now
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default OrdersDetails;

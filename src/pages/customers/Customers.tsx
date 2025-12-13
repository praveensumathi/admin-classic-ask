import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { ICustomer } from "../../interface/customer";
import { CustomerInitialValue } from "../../constants/IntialValues";
import {
  useDeleteCustomer,
  getAllCustomers,
} from "../../customHooksRQ/category/Hooks";
import ResetPasswordDialog from "../../pageDialog/ResetPasswordDialog";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import { MakeCustomerAsReseller, generateResetLink } from "../../services/api";
import { useSnackBar } from "../../context/SnackBarContext";
import { DebounceInput } from "react-debounce-input";
import { useTableStyle } from "../../styles/TableStyle";
import SearchTextField from "../../common/components/SearchTextField";

function Customers() {
  const classes = useTableStyle();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [copyLinkDialogOpen, setCopyLinkDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<ICustomer>(CustomerInitialValue);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerData, setCustomerData] = useState<ICustomer[]>([]);
  const [checkedCustomers, setCheckedCustomers] = useState({});
  const [totalCustomer, setTotalCustomer] = useState(0);

  const deleteCustomerMutation = useDeleteCustomer();
  const { updateSnackBarState } = useSnackBar();

  const venusethnicURL = import.meta.env.VITE_VENUSETHNIC_URL;

  const fetchAllCustomers = async () => {
    try {
      const data = await getAllCustomers(name, phoneNumber);

      setCustomerData(data.customers);
      setTotalCustomer(data.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllCustomers();
  }, [name, phoneNumber]);

  const handleResetPassword = async (user) => {
    setSelectedUser(user);
    // setCopyLinkDialogOpen(true);

    try {
      await generateResetLink(user.phoneNumber).then((link) => {
        const resetLink = `${venusethnicURL}/#${link}`;
        setResetLink(resetLink);
        setCopyLinkDialogOpen(true);
      });
    } catch (error: any) {
      console.error("Error generating reset link:", error);
      if (error && error.response) {
        updateSnackBarState(true, error.response.data.message, "error");
      }
      setCopyLinkDialogOpen(false);
    }
  };

  const closeCopyLinkDialog = () => {
    setSelectedUser(CustomerInitialValue);
    setCopyLinkDialogOpen(false);
  };

  const handleDelete = () => {
    deleteCustomerMutation.mutate(selectedCustomerId, {
      onSuccess: () => {
        updateSnackBarState(true, "customer removed successfully.", "success");
      },
      onError: () => {
        updateSnackBarState(true, "Error while remove customer.", "error");
      },
    });
    setSelectedUser(CustomerInitialValue);
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    // Fetch data after a customer is deleted
    if (deleteCustomerMutation.isSuccess) {
      fetchAllCustomers();
    }
  }, [deleteCustomerMutation.isSuccess]);

  const openDeleteDialog = (user: ICustomer) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    setSelectedCustomerId(user._id ?? "");
  };

  const handleDialogclose = () => {
    setSelectedUser(CustomerInitialValue);
    setDeleteDialogOpen(false);
  };

  const handleClear = () => {
    setPhoneNumber("");
    setName("");
  };

  const handleCustomerToResellerChange = async (userId, isReseller) => {
    try {
      if (!userId) {
        return;
      }

      await MakeCustomerAsReseller(userId, isReseller).then(() => {
        setCustomerData((prevData) => {
          const updatedData = [...prevData];
          const userIndex = updatedData.findIndex(
            (user) => user._id === userId
          );

          if (userIndex !== -1) {
            updatedData[userIndex] = {
              ...updatedData[userIndex],
              isReseller: isReseller,
            };
          }

          updateSnackBarState(
            true,
            "Customer status updated Successfully",
            "success"
          );

          return updatedData;
        });

        setCheckedCustomers((prevCheckedCustomers) => ({
          ...prevCheckedCustomers,
          [userId]: isReseller,
        }));
      });
    } catch (error) {
      updateSnackBarState(true, "Error updating Reseller status", "error");
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" gutterBottom component="div">
              Customers ({totalCustomer})
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <DebounceInput
                element={SearchTextField}
                debounceTimeout={1000}
                placeholder="PhoneNumber"
                size="small"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="tel"
                color="primary"
              />
              <DebounceInput
                element={SearchTextField}
                debounceTimeout={1000}
                placeholder="Customer Name"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
              <Button variant="outlined" size="small" onClick={handleClear}>
                Clear
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer
            elevation={0}
            sx={{
              boxShadow: 3,
            }}
            component={Paper}
          >
            <Table aria-label="simple table">
              <TableHead className={classes.table}>
                <TableRow>
                  <TableCell width={"20%"}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Reseller
                    </Typography>
                  </TableCell>
                  <TableCell width={"20%"}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      PhoneNumber
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "30%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell width={"20"}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    ></Typography>
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customerData && customerData.length > 0 ? (
                  <>
                    {customerData.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={user.isReseller}
                            onChange={() =>
                              handleCustomerToResellerChange(
                                user._id,
                                !user.isReseller
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleResetPassword(user)}>
                            Reset Password
                          </Button>
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            <DeleteIcon
                              onClick={() => openDeleteDialog(user)}
                              style={{ cursor: "pointer" }}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <CommonDeleteDialog
        title="Delete Customer"
        content="Are you sure you want to delete the customer?"
        dialogOpen={deleteDialogOpen}
        onDialogclose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
      <ResetPasswordDialog
        dialogOpen={copyLinkDialogOpen}
        handleDialogclose={handleDialogclose}
        closeCopyLinkDialog={closeCopyLinkDialog}
        resetLink={resetLink}
      />
    </>
  );
}

export default Customers;

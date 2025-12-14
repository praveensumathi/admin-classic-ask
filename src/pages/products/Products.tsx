import {
  useDeleteProduct,
  useBulkProductDelete,
  useGetProducts,
} from "../../customHooksRQ/category/Hooks";
import {
  Box,
  Button,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import React, { ChangeEvent, useState } from "react";
import { IProduct } from "../../interface/product";
import { ProductInitialValue } from "../../constants/IntialValues";
import ProductDialog from "../../pageDrawer/ProductDialog";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import Checkbox from "@mui/material/Checkbox";
import { TransitionProps } from "@mui/material/transitions";
import BulkUpload from "../BulkUpload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useSnackBar } from "../../context/SnackBarContext";
import { useTableStyle } from "../../styles/TableStyle";
import { DebounceInput } from "react-debounce-input";
import SearchTextField from "../../common/components/SearchTextField";
import { deleteOutofStockProduct } from "../../services/api";
import theme from "../../theme/theme";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function Products() {
  const classes = useTableStyle();
  const deleteProductMutation = useDeleteProduct();
  const deletebulkProductMutation = useBulkProductDelete();
  const { updateSnackBarState } = useSnackBar();

  const [open, setOpen] = React.useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<IProduct>(ProductInitialValue);
  const [productdialogOpen, setProductDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchProductCode, setSearchProductCode] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const { data: productResponse, refetch } = useGetProducts(
    searchProductCode,
    page,
    rowsPerPage
  );

  const [
    deleteMultipleProductsDialogOpen,
    setDeleteMultipleProductsDialogOpen,
  ] = useState(false);
  const [selectedCheckboxCount, setSelectedCheckboxCount] = useState(0);
  const [deleteOutOfStockDialogOpen, setDeleteOutOfStockDialogOpen] =
    useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchProductCode(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchProductCode("");
  };

  const handleDialogclose = () => {
    setProductDialogOpen(false);
  };

  const handleEditProduct = (product: IProduct) => {
    setSelectedProduct({ ...product });
    setProductDialogOpen(true);
  };

  const handleDeleteDialogOpen = (product: IProduct) => {
    setSelectedProductId(product._id ?? "");
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    deleteProductMutation.mutate(selectedProductId, {
      onSuccess: () => {
        const filteredProduct = selectedProductIds.filter(
          (id) => id !== selectedProductId
        );
        setSelectedProductIds(filteredProduct);
        setSelectedCheckboxCount(filteredProduct.length);
        updateSnackBarState(true, "Product removed successfully.", "success");
      },
      onError: () => {
        updateSnackBarState(true, "Error while remove Product.", "error");
      },
    });
    setSelectedProduct(ProductInitialValue);
    setDeleteDialogOpen(false);
  };

  const handleCheckboxChange = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
      setSelectedCheckboxCount(selectedCheckboxCount - 1);
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
      setSelectedCheckboxCount(selectedCheckboxCount + 1);
    }
  };

  const handleDeleteSelected = () => {
    setDeleteMultipleProductsDialogOpen(true);
  };

  const handleDeleteSelectedProducts = async () => {
    try {
      deletebulkProductMutation.mutate(selectedProductIds, {
        onSuccess: () => {
          updateSnackBarState(
            true,
            "Products removed successfully.",
            "success"
          );
          setSelectedProductIds([]);
          setDeleteMultipleProductsDialogOpen(false);
          setSelectedCheckboxCount(0);
        },
        onError: () => {
          updateSnackBarState(true, "Error while remove Products.", "error");
        },
      });
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  const handleDeleteOutofStockProduct = async () => {
    try {
      const result = await deleteOutofStockProduct();
      setDeleteOutOfStockDialogOpen(false);

      if (result.acknowledged && result.deletedCount !== undefined) {
        const deletedCount = result.deletedCount;

        if (deletedCount > 0) {
          updateSnackBarState(
            true,
            `Deleted ${deletedCount} products successfully.`,
            "success"
          );
          refetch();
        }
      } else {
        updateSnackBarState(
          true,
          "No out-of-stock products to delete.",
          "success"
        );
      }
    } catch (error) {
      updateSnackBarState(
        true,
        "Error while removing out-of-stock products.",
        "error"
      );
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    refetch();
  };

  return (
    <>
      <Grid container rowGap={3}>
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
              Products ({productResponse?.total})
            </Typography>
            {selectedProductIds.length > 1 ? (
              <>
                <Box display={"flex"} gap={2}>
                  <Button
                    variant="outlined"
                    onClick={handleDeleteSelected}
                    color="error"
                  >
                    Delete Selected ({selectedCheckboxCount})
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setProductDialogOpen(true)}
                  >
                    <AddIcon />
                    Add Product
                  </Button>
                  <Button
                    variant="contained"
                    component="label"
                    onClick={handleClickOpen}
                    color="primary"
                  >
                    <FileUploadIcon />
                    Bulk Upload
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box display={"flex"} gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setDeleteOutOfStockDialogOpen(true)}
                  >
                    <DeleteIcon fontSize="medium" />
                    Delete OutOfStocks
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setProductDialogOpen(true)}
                  >
                    <AddIcon />
                    Add Product
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ marginRight: "10px" }}
                    onClick={handleClickOpen}
                  >
                    <FileUploadIcon />
                    Bulk Upload
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <DebounceInput
            element={SearchTextField}
            debounceTimeout={1000}
            id="productCode"
            value={searchProductCode}
            onChange={handleInputChange}
            variant="outlined"
            placeholder="Search Name,code"
            size="small"
          />
          <Button
            variant="outlined"
            size="small"
            sx={{ padding: 0.8, marginLeft: 2 }}
            onClick={handleClearSearch}
          >
            Clear Search
          </Button>
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
                  <TableCell sx={{ width: "5%" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    ></Typography>
                  </TableCell>
                  {/* <TableCell sx={{ width: "5%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Image
                    </Typography>
                  </TableCell> */}
                  <TableCell sx={{ width: "6%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Code
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "15%", textAlign: "center" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Size - Instock
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: "15%", textAlign: "center" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Size - Price- (MRP)
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: "30%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Description
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      textAlign={"center"}
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productResponse &&
                  productResponse.products.length > 0 &&
                  productResponse.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProductIds.includes(product._id!)}
                          onChange={() => handleCheckboxChange(product._id!)}
                        />
                      </TableCell>
                      {/* <TableCell>
                        <img src={product.posterURL} height={70} width={70} />
                      </TableCell> */}
                      <TableCell>{product.productCode}</TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {product.sizes &&
                          product.sizes.length > 0 &&
                          product.sizes.map((size) => (
                            <Box key={`${size.size}-${size.inStock}`}>
                              <span>
                                {size.size}&nbsp;-&nbsp;{size.inStock}
                              </span>
                              <br />
                            </Box>
                          ))}
                      </TableCell>

                      <TableCell style={{ textAlign: "center" }}>
                        {product.sizes &&
                          product.sizes.length > 0 &&
                          product.sizes.map((size) => (
                            <Box
                              key={`${size.size}-${size.price}-${size.purchasePrice}`}
                            >
                              <span>
                                {size.size}&nbsp;-&nbsp;&#8377;{size.price}
                                {size.MRPprice !== undefined &&
                                  size.MRPprice !== 0 && (
                                    <>-&nbsp;( &#8377;{size.MRPprice})</>
                                  )}
                                {size.MRPprice === undefined && (
                                  <>&nbsp;( &#8377;0)</>
                                )}
                              </span>
                              <br />
                            </Box>
                          ))}
                      </TableCell>

                      <TableCell sx={{ maxWidth: "200px" }}>
                        <Tooltip title={product.description} arrow>
                          <Typography noWrap>{product.description}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <IconButton>
                            <EditIcon
                              onClick={() => handleEditProduct(product)}
                            />
                          </IconButton>
                          <IconButton>
                            <DeleteIcon
                              onClick={() => handleDeleteDialogOpen(product)}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} justifyContent={"flex-end"} display={"flex"}>
          <Pagination
            count={productResponse?.pageInfo?.totalPages}
            variant="outlined"
            onChange={(_e, page) => setPage(page)}
            sx={{
              "& .MuiPaginationItem-page.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: "#FFFFFF",
              },
            }}
          />
          <FormControl sx={{ ml: 1, width: "8%" }} size="small">
            <InputLabel id="take-count-label">Page Count</InputLabel>
            <Select
              labelId="Page Count"
              id="Page Count"
              value={rowsPerPage}
              label="Page Count"
              onChange={(_e) => {
                setRowsPerPage(Number(_e.target.value));
                setPage(1);
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <ProductDialog
        selectedProduct={selectedProduct}
        dialogOpen={productdialogOpen}
        onCloseDialog={handleDialogclose}
      />

      <CommonDeleteDialog
        title="Delete Product"
        content="Are you sure you want to delete the product?"
        dialogOpen={deleteDialogOpen}
        onDialogclose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
      <CommonDeleteDialog
        title="Delete products"
        content={`Are you sure you want to delete ${selectedCheckboxCount} products?`}
        dialogOpen={deleteMultipleProductsDialogOpen}
        onDialogclose={() => setDeleteMultipleProductsDialogOpen(false)}
        onDelete={handleDeleteSelectedProducts}
      />
      <CommonDeleteDialog
        title="Delete OutOfStock"
        content="Are you sure you want to delete OutofStock products?"
        dialogOpen={deleteOutOfStockDialogOpen}
        onDialogclose={() => setDeleteOutOfStockDialogOpen(false)}
        onDelete={handleDeleteOutofStockProduct}
      />

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <BulkUpload onClose={handleClose} />
      </Dialog>
    </>
  );
}
export default Products;

import {
  Box,
  Container,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Slide,
  SlideProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CommonDeleteDialog from "../common/components/CommonDeleteDialog";
import { useTableStyle } from "../styles/TableStyle";
import {
  usedeleteCategoryWiseProduct as useDeleteCategoryWiseProduct,
  usefetchProductsByCategory,
} from "../customHooksRQ/category/Hooks";
import { useSnackBar } from "../context/SnackBarContext";

interface IProps {
  dialogOpen: boolean;
  handleDialogclose(): void;
  categoryId: string;
}

const Transition = React.forwardRef(function Transition(
  props: React.PropsWithChildren<SlideProps>,
  ref: React.Ref<unknown>
) {
  const { children, ...restProps } = props;
  return (
    <Slide direction="left" ref={ref} {...restProps}>
      {children}
    </Slide>
  );
});

function CategoryWiseProductDialog(props: IProps) {
  const {
    dialogOpen: categoryWiseProductDialogOpen,
    handleDialogclose,
    categoryId,
  } = props;
  const classes = useTableStyle();

  const deletecategorywiseProductMutation = useDeleteCategoryWiseProduct();
  const { updateSnackBarState } = useSnackBar();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductCode, setSelectedProductCode] = useState("");

  const { data: products } = usefetchProductsByCategory(categoryId ?? "");

  const handleDeleteProduct = (productId) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategoryWiseProduct = () => {
    deletecategorywiseProductMutation.mutate(selectedProductId, {
      onSuccess: () => {
        updateSnackBarState(true, "Products removed successfully.", "success");
        setDeleteDialogOpen(false);
        handleDialogclose();
        setSelectedProductId("");
      },
      onError: () => {
        updateSnackBarState(true, "Error while remove Product.", "error");
      },
    });
  };

  return (
    <>
      <Dialog
        fullScreen
        open={categoryWiseProductDialogOpen}
        onClose={handleDialogclose}
        sx={{ height: "100%" }}
        TransitionComponent={Transition}
      >
        <Grid container>
          <Grid item xs={12}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                padding: "20px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" fontWeight={"bold"}>
                Products
              </Typography>
              <CloseIcon
                onClick={handleDialogclose}
                sx={{ cursor: "pointer" }}
              />
            </Box>
          </Grid>
        </Grid>
        <Container maxWidth={false}>
          <TableContainer
            elevation={0}
            component={Paper}
            sx={{ height: "75vh", overflow: "auto", boxShadow: 5 }}
          >
            <Table aria-label="simple table">
              <TableHead
                className={classes.table}
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow>
                  {/* <TableCell sx={{ width: "15%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Image
                    </Typography>
                  </TableCell> */}
                  <TableCell sx={{ width: "15%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Title
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Product code
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Size - Instock
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Size - Price- (MRP)
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "25%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Description
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "5%" }}>
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
                {products &&
                  products.length > 0 &&
                  products.map((item, index) => (
                    <TableRow key={index}>
                      {/* <TableCell>
                        <img src={item.posterURL} style={{ width: "50px" }} />
                      </TableCell> */}
                      <TableCell>
                        <Typography variant="subtitle1">
                          {item.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">
                          {item.productCode}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "left" }}>
                        {item.sizes &&
                          item.sizes.length > 0 &&
                          item.sizes.map((size) => (
                            <Box key={`${size.size}-${size.inStock}`}>
                              <span>
                                {size.size}&nbsp;-&nbsp;{size.inStock}
                              </span>
                              <br />
                            </Box>
                          ))}
                      </TableCell>

                      <TableCell style={{ textAlign: "left" }}>
                        {item.sizes &&
                          item.sizes.length > 0 &&
                          item.sizes.map((size) => (
                            <Box key={`${size.size}-${size.price}`}>
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
                        <Tooltip title={item.description} arrow>
                          <Typography noWrap>{item.description}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            cursor: "pointer",
                          }}
                        >
                          <IconButton>
                            <DeleteIcon
                              onClick={() => handleDeleteProduct(item._id)}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Dialog>

      <CommonDeleteDialog
        title="Delete Product"
        content="Are you sure you want to delete the product?"
        dialogOpen={deleteDialogOpen}
        onDialogclose={() => setDeleteDialogOpen(false)}
        onDelete={() => handleDeleteCategoryWiseProduct()}
      />
    </>
  );
}

export default CategoryWiseProductDialog;

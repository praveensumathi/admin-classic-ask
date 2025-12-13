import { Box, Typography, Grid, Hidden, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import CategoryDrawer from "../../pageDrawer/CategoryDrawer";
import {
  useDeleteCategory,
  useGetCategories,
} from "../../customHooksRQ/category/Hooks";
import { ICategory } from "../../interface/category";
import { CategoryInitialValue } from "../../constants/IntialValues";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import { useSnackBar } from "../../context/SnackBarContext";
import CategoryWiseProductDialog from "../../pageDialog/CategoryWiseProductDialog";
import { useTableStyle } from "../../styles/TableStyle";

function Categories() {
  const classes = useTableStyle();
  const [selectedCategory, setSelectedCategory] =
    useState<ICategory>(CategoryInitialValue);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [selectedProductId, setSelectedProductId] = useState("");
  const [categoryWiseProductDialogOpen, setCategoryWiseProductDialogOpen] =
    useState(false);

  const { data } = useGetCategories();
  const deleteCategoryMutation = useDeleteCategory();
  const { updateSnackBarState } = useSnackBar();

  const handleDialogclose = () => {
    setCategoryWiseProductDialogOpen(false);
  };

  const handleDrawerclose = () => {
    setCategoryDrawerOpen(false);
  };

  const handleclickViewProduct = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCategoryWiseProductDialogOpen(true);
  };

  const handleDelete = () => {
    deleteCategoryMutation.mutate(selectedCategoryId, {
      onSuccess: () => {
        updateSnackBarState(true, "category removed successfully.", "success");
      },
      onError: () => {
        updateSnackBarState(true, "Error while remove category.", "error");
      },
    });
    setSelectedCategory(CategoryInitialValue);
    setDeleteDialogOpen(false);
  };

  const handleEditCategory = (category: ICategory) => {
    setSelectedCategory({ ...category });
    setCategoryDrawerOpen(true);
  };

  const openDeleteDialog = (category: ICategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
    setSelectedCategoryId(category._id ?? "");
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
              Categories
            </Typography>
            <Button
              variant="contained"
              onClick={() => setCategoryDrawerOpen(true)}
            >
              <AddIcon />
              Add Category
            </Button>
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
                  <TableCell width={"10%"}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Image
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: "20%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Name
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: "25%" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Description
                    </Typography>
                  </TableCell>
                  <TableCell width={"20"}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      textAlign={"center"}
                    >
                      Product Count
                    </Typography>
                  </TableCell>
                  <TableCell width={"10%"}></TableCell>
                  <TableCell>
                    <Typography
                      textAlign={"center"}
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((category) => (
                    <TableRow key={category.name}>
                      <TableCell>
                        <img
                          src={category.image}
                          style={{ height: "70px", width: "70px" }}
                        />
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell
                        width={"10%"}
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {category.productCount}
                      </TableCell>
                      <TableCell width={"10%"}>
                        {category.productCount && category.productCount > 0 ? (
                          <Button
                            onClick={() =>
                              handleclickViewProduct(category._id ?? "")
                            }
                          >
                            View Products
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <Box
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <IconButton>
                            <EditIcon
                              onClick={() => handleEditCategory(category)}
                            />
                          </IconButton>

                          <IconButton>
                            <DeleteIcon
                              onClick={() => openDeleteDialog(category)}
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
      </Grid>
      <CategoryDrawer
        selectedCategory={selectedCategory}
        drawerOpen={categoryDrawerOpen}
        handleDrawerclose={handleDrawerclose}
      />
      <CommonDeleteDialog
        title="Delete Catogery"
        content="Are you sure you want to delete the category?"
        dialogOpen={deleteDialogOpen}
        onDialogclose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
      {categoryWiseProductDialogOpen && (
        <CategoryWiseProductDialog
          dialogOpen={categoryWiseProductDialogOpen}
          handleDialogclose={handleDialogclose}
          categoryId={selectedCategoryId}
        />
      )}
    </>
  );
}

export default Categories;

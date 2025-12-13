import Drawer from "@mui/material/Drawer";
import { Box, Typography, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import { ICategory } from "../interface/category";
import { CategoryInitialValue } from "../constants/IntialValues";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../customHooksRQ/category/Hooks";
import { CategorydrawerWidth } from "../constants/Constants";
import { useSnackBar } from "../context/SnackBarContext";
import AddIcon from "@mui/icons-material/Add";
import { useRef } from "react";
import { createHashHistory } from "@remix-run/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import imageCompression from "browser-image-compression";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(5, "Name should be min 5 characters")
    .required("Please enter the name"),
  description: yup.string(),
});

interface IProps {
  selectedCategory: ICategory;
  drawerOpen: boolean;
  handleDrawerclose(): void;
}

function CategoryDrawer(props: IProps) {
  const {
    drawerOpen: categoryDrawerOpen,
    handleDrawerclose,
    selectedCategory,
  } = props;
  const formRef = useRef(null);

  var categoryCreateMutation = useCreateCategory();
  var categoryUpdateMutation = useUpdateCategory();
  const { updateSnackBarState } = useSnackBar();

  const [category, setCategory] = useState<ICategory>(CategoryInitialValue);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState<
    string | null
  >(null);
  const [newCategoryImageFile, setNewCategoryImageFile] = useState<File | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ICategory>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: CategoryInitialValue,
  });

  const filePosterRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = () => {
    if (filePosterRef.current) {
      filePosterRef.current?.click();
    }
  };

  async function handleCompressFile(event: File): Promise<File | undefined> {
    const imageFile = event;
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    let options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    // Check if the image size is above 1 MB
    if (imageFile.size > 1024 * 1024) {
      // Reduce the maxSizeMB to compress the image to approximately 500 KB
      options.maxSizeMB = 0.5;
    }

    try {
      const compressedBlob = await imageCompression(imageFile, options);
      console.log(
        `compressedFile size ${compressedBlob.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      // Create a new File object from the compressed Blob with missing properties
      const compressedFile = new File([compressedBlob], imageFile.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      return compressedFile;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  const handleCategoryImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await handleCompressFile(file);
        if (compressedFile) {
          setSelectedCategoryImage(URL.createObjectURL(compressedFile));
          setNewCategoryImageFile(compressedFile);
        } else {
          console.log("Compression failed or was not needed.");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No file selected.");
    }
  };

  const handleSaveCategory = async (data: ICategory) => {
    const formData = new FormData(formRef.current!);

    // for (let entry of formData.entries()) {
    //   console.log(entry);
    // }

    if (
      newCategoryImageFile &&
      newCategoryImageFile.size > 0 &&
      newCategoryImageFile.name != ""
    ) {
      formData.append("categoryImage", newCategoryImageFile);
      formData.append("categoryRemoveImage", category.image!);
    }

    if (!isEdit) {
      categoryCreateMutation.mutate(formData, {
        onSuccess: () => {
          handleDrawerclose();
          resetForm();
          updateSnackBarState(true, "Category added successfully.", "success");
        },
        onError: (error: any) => {
          updateSnackBarState(true, error.response.data.message, "error");
        },
      });
    } else {
      formData.append("id", category._id!);
      categoryUpdateMutation.mutate(formData, {
        onSuccess: () => {
          handleDrawerclose();
          resetForm();
          updateSnackBarState(
            true,
            "Category updated successfully.",
            "success"
          );
        },
        onError: (error: any) => {
          updateSnackBarState(true, error.response.data.message, "error");
        },
      });
    }
  };

  useEffect(() => {
    if (selectedCategory && selectedCategory._id) {
      setIsEdit(true);
      setCategory({ ...selectedCategory });
      setSelectedCategoryImage(selectedCategory.image ?? null);
      setValue("name", selectedCategory.name, { shouldValidate: true });
      setValue("description", selectedCategory.description, {
        shouldValidate: true,
      });
    }
  }, [selectedCategory]);

  const resetForm = () => {
    setCategory({ ...CategoryInitialValue });
    setSelectedCategoryImage(null);
    setNewCategoryImageFile(null);
    reset({ ...CategoryInitialValue });
    setIsEdit(false);
  };

  const drawer = (
    <Box sx={{ width: CategorydrawerWidth }}>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          p={2}
        >
          <Typography variant="h6" component="div">
            {isEdit ? "Edit Category" : "Add Category"}
          </Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              resetForm();
              handleDrawerclose();
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} p={2}>
          <Box py={1}>
            <Typography variant="subtitle1">Name</Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message?.toString()}
              inputProps={{
                style: {
                  padding: "10px",
                },
              }}
              FormHelperTextProps={{
                sx: { color: "red", marginLeft: "0px" },
              }}
              fullWidth
              autoComplete="new"
              required
            ></TextField>{" "}
          </Box>
          <Box py={1}>
            <Typography variant="subtitle1">Description</Typography>
            <TextField
              id="outlined-multiline-flexible"
              multiline
              minRows={5}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message?.toString()}
              fullWidth
              FormHelperTextProps={{
                sx: { color: "red", marginLeft: "0px" },
              }}
              autoComplete="new"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
              marginTop: 2,
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Category Image
            </Typography>
            <Button variant="outlined" onClick={handleUploadButtonClick}>
              <AddIcon />
              Upload Image
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <input
              type="file"
              style={{ display: "none" }}
              ref={filePosterRef}
              onChange={handleCategoryImageUpload}
            />

            {selectedCategoryImage != null && (
              <img
                src={selectedCategoryImage}
                style={{
                  width: "100px",
                  height: "100px",
                }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={categoryDrawerOpen}
      ModalProps={{
        keepMounted: true,
      }}
      anchor="right"
      sx={{
        position: "relative",
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: CategorydrawerWidth,
        },
      }}
    >
      <form ref={formRef} onSubmit={handleSubmit(handleSaveCategory)}>
        {drawer}
        <Box
          p={2}
          gap={2}
          display={"flex"}
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              paddingRight: "30px",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                handleDrawerclose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </form>
    </Drawer>
  );
}

export default CategoryDrawer;

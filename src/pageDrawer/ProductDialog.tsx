import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { IProduct, ISize } from "../interface/product";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ProductInitialValue } from "../constants/IntialValues";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { SlideProps } from "@mui/material/Slide";
import imageCompression from "browser-image-compression";
import {
  useCreateProduct,
  useGetCategories,
  useUpdateProduct,
} from "../customHooksRQ/category/Hooks";
import { ICategory } from "../interface/category";
import { useSnackBar } from "../context/SnackBarContext";
import ProductImage from "../common/components/ProductImage";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface IProps {
  selectedProduct: IProduct;
  dialogOpen: boolean;
  onCloseDialog(shouldRefetch?: boolean): void;
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

function ProductDialog(props: IProps) {
  const {
    dialogOpen: ProductdialogOpen,
    onCloseDialog,
    selectedProduct,
  } = props;

  const formRef = useRef(null);

  const [product, setProduct] = useState<IProduct>(ProductInitialValue);
  const [isEdit, setIsEdit] = useState(false);
  const [sizeList, setSizeList] = useState<ISize[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newProductUplodedImages, setNewProductUploadImages] = useState<File[]>(
    []
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedPosterImage, setSelectedPosterImage] = useState<string | null>(
    null
  );
  const [productUploadedImages, setProductuploadedImages] = useState<string[]>(
    []
  );
  const [uploadedImageHoveredIndex, setUploadedImageHoverIndex] = useState<
    number | null
  >(null);
  const [newPosterImageFile, setNewPosterImageFile] = useState<File | null>(
    null
  );

  const [removedProductImages, setRemovedProductImages] = useState<string[]>(
    []
  );

  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
  //const [isWithGST, setIsWithGST] = useState<boolean>(false);
  const [sellerName, setSellerName] = useState<string>("");

  const [isPosterUploading, setIsPosterUploading] = useState(false);
  const [isImagesUploading, setIsImagesUploading] = useState(false);

  const fileImageRef = useRef<HTMLInputElement>(null);
  const filePosterRef = useRef<HTMLInputElement>(null);

  var productCreateMutation = useCreateProduct();
  var updateProductMutation = useUpdateProduct();

  const { data: categories } = useGetCategories();
  const { updateSnackBarState } = useSnackBar();

  useEffect(() => {
    if (selectedProduct && selectedProduct._id) {
      setIsEdit(true);
      setProduct({ ...selectedProduct });
      setSizeList(selectedProduct.sizes);
      setSelectedCategory(selectedProduct.categoryId);
      setSelectedPosterImage(selectedProduct.posterURL);
      setProductuploadedImages(selectedProduct.images);
      setSellerName(selectedProduct.sellerName);
      setPurchaseDate(new Date(selectedProduct.purchaseDate) ?? null);
    }
  }, [selectedProduct]);

  const addNewSizeRow = () => {
    setSizeList([
      ...sizeList,
      {
        size: "",
        purchasePrice: undefined,
        resellingPrice: undefined,
        inStock: 1,
        purchaseQty: 1,
        netWeight: 100,
        MRPprice: undefined,
        price: undefined,
        offlineSellingPrice: undefined,
      },
    ]);
  };

  const dplicateSizeRow = (sizeToCopy: ISize) => {
    setSizeList([
      ...sizeList,
      {
        ...sizeToCopy,
        size: "",
      },
    ]);
  };

  const handleTextFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedTextField = [...sizeList];
    updatedTextField[index][field] = value;

    setSizeList(updatedTextField);
  };

  const handleDelete = (index: number) => {
    const updatedTextField = [...sizeList];
    updatedTextField.splice(index, 1);
    setSizeList(updatedTextField);
  };

  const resetForm = () => {
    setProduct({ ...ProductInitialValue });
    setIsEdit(false);
    setSizeList([]);
    setSelectedPosterImage("");
    setNewProductUploadImages([]);
    setSelectedCategory("");
    setProductuploadedImages([]);
    setNewPosterImageFile(null);
    setRemovedProductImages([]);
    setPurchaseDate(null);
    //setIsWithGST(false);
    setSellerName("");
  };

  const handleCloseDialog = (shouldRefetch: boolean = false) => {
    resetForm();
    onCloseDialog(shouldRefetch);
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      setIsImagesUploading(true);
      const filesArray: File[] = Array.from(files);
      const validFiles = filesArray.filter(
        (file) =>
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg"
      );

      const compressedFiles = await Promise.all(
        validFiles.map((file) => handleCompressFile(file))
      );

      const compressedValidFiles = compressedFiles.filter(
        (compressedFile) => compressedFile !== undefined
      ) as File[]; // Filter out undefined and cast as File[]

      setNewProductUploadImages([
        ...newProductUplodedImages,
        ...compressedValidFiles,
      ]);

      setIsImagesUploading(false);
    } else {
      console.log(
        "Invalid file format. Please select a JPEG or PNG or JPG file."
      );
    }
  };

  const handlePreviewClick = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  const handleImagesButtonClick = () => {
    if (fileImageRef.current) {
      fileImageRef.current.click();
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...newProductUplodedImages];
    updatedImages.splice(index, 1);
    setNewProductUploadImages(updatedImages);
    setHoveredIndex(null);
  };

  const handlePosterButtonClick = () => {
    if (filePosterRef.current) {
      filePosterRef.current?.click();
    }
  };

  async function handleCompressFile(event: File): Promise<File | undefined> {
    const imageFile = event;

    let options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    // Check if the image size is above 1 MB
    if (imageFile.size > 1024 * 1024) {
      // Reduce the maxSizeMB to compress the image to approximately 500 KB
      options.maxSizeMB = 1;
    }

    try {
      const compressedBlob = await imageCompression(imageFile, options);

      // console.log(
      //   "compressedFile instanceof Blob",
      //   compressedBlob instanceof Blob
      // ); // true
      // console.log(
      //   `compressedFile size ${compressedBlob.size / 1024 / 1024} MB`
      // ); // smaller than maxSizeMB

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

  const handlePosterImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        setIsPosterUploading(true);
        const compressedFile = await handleCompressFile(file);

        if (compressedFile) {
          setSelectedPosterImage(URL.createObjectURL(compressedFile));
          setNewPosterImageFile(compressedFile);
          setIsPosterUploading(false);
        } else {
          setIsPosterUploading(false);
          console.log("Compression failed or was not needed.");
        }
      } catch (error) {
        setIsPosterUploading(false);
        console.log(error);
      }
    } else {
      console.log("No file selected.");
    }
  };

  const handleSaveProduct = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);

    var removedImages: string[] = removedProductImages;
    let price = sizeList && sizeList.length > 0 ? sizeList[0]?.price : 0;
    if (price) formData.append("price", price.toString());

    newProductUplodedImages && newProductUplodedImages.length > 0;
    newProductUplodedImages.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    sizeList && sizeList.length > 0;
    sizeList.forEach((item, index) => {
      formData.append(`sizes[${index}]`, JSON.stringify(item));
    });

    if (
      newPosterImageFile &&
      newPosterImageFile.size > 0 &&
      newPosterImageFile.name != ""
    ) {
      formData.append("posterImage", newPosterImageFile);

      if (product.posterURL) {
        removedImages = [...removedProductImages, product.posterURL];
      }
    }
    if (purchaseDate) {
      formData.append("purchaseDate", purchaseDate.toDateString());
    }

    //formData.append("isWithGST", isWithGST ? "true" : "false");
    formData.append("sellerName", sellerName);

    if (!isEdit) {
      productCreateMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseDialog(true);
          updateSnackBarState(true, "Product added successfully.", "success");
        },
        onError: () => {
          updateSnackBarState(true, "Error while add Product.", "error");
        },
      });
    } else {
      formData.append("id", product._id!);
      formData.append("removedImages", JSON.stringify(removedImages));
      formData.append("existingImages", JSON.stringify(productUploadedImages));

      updateProductMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseDialog(true);
          updateSnackBarState(true, "Product updated successfully.", "success");
        },
        onError: () => {
          updateSnackBarState(true, "Error while update Product.", "error");
        },
      });
    }
  };

  const handleDeleteUploadedImage = (index: number) => {
    const images = [...productUploadedImages];
    var removedImage = images.splice(index, 1);
    setRemovedProductImages([...removedProductImages, ...removedImage]);
    setProductuploadedImages(images);
    setUploadedImageHoverIndex(null);
  };

  return (
    <Dialog
      fullScreen
      open={ProductdialogOpen}
      onClose={() => handleCloseDialog()}
      sx={{ height: "100%" }}
      TransitionComponent={Transition}
    >
      <form ref={formRef} onSubmit={handleSaveProduct}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={"bold"}>
            {isEdit ? "Edit Product" : "Add Product"}
          </Typography>
          <Button
            color="inherit"
            onClick={() => handleCloseDialog()}
            sx={{
              float: "right",
            }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>

        <Divider />
        <DialogContent>
          <Grid container columnSpacing={5}>
            <Grid item xs={4}>
              <Box sx={{ width: "100%", p: 1 }}>
                <Typography variant="body1" fontWeight={"bold"}>
                  Title
                </Typography>
                <TextField
                  name="title"
                  id="outlined-basic"
                  variant="outlined"
                  value={product.title}
                  onChange={(e) =>
                    setProduct((prevState) => ({
                      ...prevState,
                      title: e.target.value,
                    }))
                  }
                  fullWidth
                  inputProps={{
                    style: {
                      padding: "10px",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "100%", p: 1 }}>
                <Typography variant="body1" fontWeight={"bold"}>
                  Description
                </Typography>
                <TextField
                  name="description"
                  id="outlined-basic"
                  variant="outlined"
                  multiline
                  minRows={2}
                  maxRows={8}
                  value={product.description}
                  onChange={(e) =>
                    setProduct((prevState) => ({
                      ...prevState,
                      description: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ width: "100%", p: 1 }}>
                    <Typography variant="body1" fontWeight={"bold"}>
                      Product Code
                    </Typography>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="productCode"
                      type="text"
                      value={product.productCode ?? ""}
                      onChange={(e) =>
                        setProduct((prevState) => ({
                          ...prevState,
                          productCode: e.target.value,
                        }))
                      }
                      fullWidth
                      inputProps={{
                        style: {
                          padding: "10px",
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ width: "100%", p: 1 }}>
                <Typography variant="body1" fontWeight={"bold"}>
                  MaterialType
                </Typography>
                <TextField
                  id="outlined-basic"
                  name="materialType"
                  variant="outlined"
                  value={product.materialType}
                  onChange={(e) =>
                    setProduct((prevState) => ({
                      ...prevState,
                      materialType: e.target.value,
                    }))
                  }
                  fullWidth
                  inputProps={{
                    style: {
                      padding: "10px",
                    },
                  }}
                />
              </Box>
              <Box sx={{ margin: "10px 0" }}>
                <FormControl fullWidth>
                  <Typography variant="body1" fontWeight={"bold"}>
                    Category
                  </Typography>
                  <Select
                    name="category"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value as string)
                    }
                  >
                    {categories &&
                      categories.map((category: ICategory) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
              <Grid container>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 2,
                      marginTop: 3,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      PosterURL
                    </Typography>

                    <Button
                      variant="outlined"
                      onClick={handlePosterButtonClick}
                    >
                      <AddIcon />
                      Upload Poster
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {isPosterUploading && (
                      <Box textAlign={"center"}>
                        <CircularProgress size={30} />
                      </Box>
                    )}

                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={filePosterRef}
                      onChange={handlePosterImageUpload}
                    />

                    {selectedPosterImage != null &&
                      selectedPosterImage != "" && (
                        <img
                          src={selectedPosterImage!}
                          style={{
                            width: "100px",
                            height: "100px",
                          }}
                        />
                      )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 2,
                      marginTop: 3,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Images
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleImagesButtonClick}
                    >
                      <AddIcon />
                      Upload Images
                    </Button>

                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={fileImageRef}
                      onChange={handleImagesUpload}
                      multiple
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {isImagesUploading && (
                      <Box textAlign={"center"}>
                        <CircularProgress size={30} />
                      </Box>
                    )}

                    {newProductUplodedImages &&
                      newProductUplodedImages.length > 0 &&
                      newProductUplodedImages.map((file, index) => (
                        <Box key={`newContainer${index + 1}`}>
                          <ProductImage
                            id={`newProductUplodedImagesContainer${index + 1}`}
                            file={URL.createObjectURL(file)}
                            index={index}
                            hoveredIndex={hoveredIndex}
                            setHoveredIndex={setHoveredIndex}
                            handleDeleteImage={(deleteIndex) =>
                              handleDeleteImage(deleteIndex)
                            }
                          />
                        </Box>
                      ))}

                    {productUploadedImages &&
                      productUploadedImages.length > 0 &&
                      productUploadedImages.map((item, index) => (
                        <Box key={`existsImages${index + 1}`}>
                          <ProductImage
                            id={`uploadedImagesContainer${index + 1}`}
                            file={item}
                            index={index}
                            hoveredIndex={uploadedImageHoveredIndex}
                            setHoveredIndex={setUploadedImageHoverIndex}
                            handleDeleteImage={(deleteIndex) =>
                              handleDeleteUploadedImage(deleteIndex)
                            }
                          />
                        </Box>
                      ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={8}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Grid container columnGap={2}>
                  <Grid item xs={4}>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Purchased Date"
                          value={
                            product.purchaseDate
                              ? new Date(product.purchaseDate)
                              : null
                          }
                          onChange={(date) => setPurchaseDate(date)}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  {/* <Grid item xs={4}>
                    <Box sx={{ marginLeft: 3 }}>
                      <Typography variant="body1" fontWeight={"bold"}>
                        With GST
                      </Typography>
                      <RadioGroup
                        id="withGSTRadioButton"
                        value={
                          isWithGST || product.isWithGST ? "true" : "false"
                        }
                        row
                        onChange={(event) => {
                          setIsWithGST(event.target.value === "true");
                        }}
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </Box>
                  </Grid> */}
                  <Grid item xs={4}>
                    <Box>
                      <TextField
                        fullWidth
                        label="Seller Name"
                        variant="outlined"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pt: 3,
                }}
              >
                <Typography variant="h6" fontWeight={"bold"}>
                  sizes
                </Typography>
                <Button variant="outlined" onClick={addNewSizeRow}>
                  <AddIcon />
                  Add
                </Button>
              </Box>
              {sizeList.map((sizeObj, index) => (
                <Grid
                  container
                  item
                  spacing={2}
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={1.5} mb={1}>
                    <>
                      <Typography
                        key={`size-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        Size
                      </Typography>
                      <TextField
                        id={`size-${index + 1}`}
                        value={sizeObj.size}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          // const onlyLettersValue = inputValue
                          //   .replace(/[^A-Za-z]/g, "")
                          //   .toUpperCase();

                          handleTextFieldChange(
                            index,
                            "size",
                            //onlyLettersValue
                            inputValue?.trim()
                          );
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid>
                  <Grid item xs={1.5} mb={1}>
                    <>
                      <Typography
                        key={`inStock-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        InStock
                      </Typography>
                      <TextField
                        id={`inStock-${index + 2}`}
                        value={sizeObj.inStock}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          handleTextFieldChange(index, "inStock", numericValue);
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid>
                  <Grid item xs={1.5} mb={1}>
                    <>
                      <Typography
                        key={`purchaseQty-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        Purchase Qty
                      </Typography>
                      <TextField
                        id={`purchaseQty-${index + 2}`}
                        value={sizeObj.purchaseQty}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          handleTextFieldChange(
                            index,
                            "purchaseQty",
                            numericValue
                          );
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid>
                  <Grid item xs={1.5} mb={1}>
                    <>
                      <Typography
                        key={`netWeight-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        Net Weight (g)
                      </Typography>
                      <TextField
                        id={`netWeight-${index + 2}`}
                        value={sizeObj.netWeight}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          handleTextFieldChange(
                            index,
                            "netWeight",
                            numericValue
                          );
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid>
                  {/* <Grid item xs={1.4} mb={1}>
                    <>
                      <Typography
                        key={`purchasePrice-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        Purchase Price
                      </Typography>
                      <TextField
                        id={`purchasePrice-${index + 2}`}
                        value={value.purchasePrice}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          handleTextFieldChange(
                            index,
                            "purchasePrice",
                            numericValue
                          );
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid> */}
                  <Grid item xs={1.5} mb={1}>
                    <>
                      <Typography
                        key={` MRPprice-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        MRP
                      </Typography>
                      <TextField
                        id={` MRPprice-${index + 3}`}
                        value={sizeObj.MRPprice ?? ""}
                        onChange={(event) => {
                          const inputValue = event.target.value;

                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          handleTextFieldChange(
                            index,
                            "MRPprice",
                            numericValue
                          );
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid>
                  {/* <Grid item xs={1.2} mb={1}>
                    <>
                      <Typography
                        key={`resellingPrice-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        Resell Price
                      </Typography>
                      <TextField
                        id={`resellingPrice-${index + 2}`}
                        value={value.resellingPrice}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          handleTextFieldChange(
                            index,
                            "resellingPrice",
                            numericValue
                          );
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid> */}
                  <Grid item xs={1.5} mb={1}>
                    <>
                      <Typography
                        key={`price-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        On. Price
                      </Typography>
                      <TextField
                        id={`price-${index + 4}`}
                        value={sizeObj.price}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          handleTextFieldChange(index, "price", numericValue);
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid>
                  {/* <Grid item xs={1} mb={1}>
                    <>
                      <Typography
                        key={`offlineSellingPrice-${index}`}
                        sx={{ fontSize: "11px", padding: "10px 0" }}
                      >
                        Off. Price
                      </Typography>
                      <TextField
                        id={`offlineSellingPrice-${index + 2}`}
                        value={value.offlineSellingPrice}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );

                          handleTextFieldChange(
                            index,
                            "offlineSellingPrice",
                            numericValue
                          );
                        }}
                        fullWidth
                        margin="dense"
                      />
                    </>
                  </Grid> */}
                  <Grid item xs={0.8} mt={2} display={"flex"} gap={2}>
                    <Tooltip title="Delete">
                      <IconButton>
                        <DeleteIcon onClick={() => handleDelete(index)} />
                      </IconButton>
                    </Tooltip>
                    {!isEdit && (
                      <Tooltip title="Duplicate">
                        <IconButton onClick={() => dplicateSizeRow(sizeObj)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <Box mr={4} mb={2}>
          <DialogActions>
            <Button variant="outlined" onClick={() => handleCloseDialog()}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Box>
      </form>
    </Dialog>
  );
}

export default ProductDialog;

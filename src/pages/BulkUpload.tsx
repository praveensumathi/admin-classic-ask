import { useState } from "react";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { httpWithCredentials } from "../services/http";
import csvtojson from "csvtojson";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useSnackBar } from "../context/SnackBarContext";

export default function BulkUpload({ onClose }) {
  const [jsonData, setJsonData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const { updateSnackBarState } = useSnackBar();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    try {
      const jsonData = await convertCSVtoJSON(file);
      setJsonData(jsonData);
      console.log("jsonData", jsonData);
    } catch (error) {
      console.error("Error converting CSV to JSON:", error);
    }
  };

  const convertCSVtoJSON = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const csvData = reader.result as string;
        csvtojson({
          ignoreEmpty: true,
          colParser: {
            "Sizes(Size-Instock-purchaseQty-netWeight-PurchasePrice-MRP-ResellingPrice-Price-OfflineSellingPrice;)":
              (item) => {
                const sizesArr = item.split(";").map((sizeItem) => {
                  const [
                    size,
                    inStock,
                    purchaseQty,
                    netWeight,
                    purchasePrice,
                    MRP,
                    resellingPrice,
                    price,
                    offlineSellingPrice,
                  ] = sizeItem.split("-");
                  return {
                    size,
                    inStock,
                    purchaseQty,
                    netWeight,
                    purchasePrice,
                    resellingPrice,
                    MRP: MRP || 0,
                    price,
                    offlineSellingPrice,
                  };
                });
                return sizesArr;
              },
            "ImagesLinks(;)": (item) => {
              const imagesArr = item.split(";");
              return imagesArr;
            },
          },
        })
          .fromString(csvData)
          .then((jsonArray) => {
            resolve(jsonArray);
          });
      };

      reader.onerror = () => {
        reject(new Error("Error reading CSV file."));
      };

      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const requestData =
        jsonData &&
        jsonData.map((data) => {
          const sizes =
            data[
              "Sizes(Size-Instock-purchaseQty-netWeight-PurchasePrice-MRP-ResellingPrice-Price-OfflineSellingPrice;)"
            ];

          return {
            title: data.Title,
            images: data["ImagesLinks(;)"] ? data["ImagesLinks(;)"] : [],
            description: data.Description,
            productCode: data.ProductCode.trim(),
            price: sizes[0].price,
            materialType: data.MaterialType,
            posterURL: data.PosterLink,
            purchaseDate: data["PurchaseDate(YYYY-MM-DD)"],
            sellerName: data.SellerName,
            isWithGST: data.IsWithGST ? parseInt(data.IsWithGST) : 0,
            category: data.CategoryName.trim().toLowerCase(),
            sizes: sizes.map((size) => ({
              size: size.size,
              inStock: size.inStock,
              purchaseQty: size.purchaseQty,
              netWeight: size.netWeight,
              purchasePrice: size.purchasePrice,
              MRPprice: size.MRP,
              resellingPrice: size.resellingPrice,
              price: size.price,
              offlineSellingPrice: size.offlineSellingPrice,
            })),
          };
        });

      const response = await httpWithCredentials.post(
        "/product/bulkupload",
        requestData
      );

      //console.log(requestData);

      setJsonData(null);
      setLoading(false);
    } catch (error: any) {
      console.error("Error creating products:", error);
      setLoading(false);
      updateSnackBarState(true, error.response.data.message, "error");
    }
  };

  const handleCloseDialog = () => {
    onClose();
  };

  const handleSaveData = async () => {
    try {
      await handleUpload();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <>
      <Box>
        <Toolbar>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
            width="100%"
          >
            <Box>
              {!loading && jsonData && jsonData.length > 0 && (
                <Box display="flex" gap={2} alignItems={"center"}>
                  <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    sx={{ marginRight: "10px" }}
                  >
                    <UploadFileIcon />
                    Reupload
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setJsonData([])}
                  >
                    Clear
                  </Button>

                  <Typography variant="h5" fontWeight={"bold"} sx={{ py: 2 }}>
                    Total Products : {jsonData.length}
                  </Typography>
                </Box>
              )}
            </Box>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!loading && jsonData && jsonData.length == 0 && (
            <Button
              variant="contained"
              component="label"
              color="primary"
              sx={{ position: "relative", marginTop: "15%" }}
            >
              <UploadFileIcon />
              Upload File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          )}
        </Box>
      </Box>
      <Container maxWidth={false}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : null}
        {!loading && jsonData && jsonData.length > 0 && (
          <TableContainer
            elevation={0}
            sx={{
              boxShadow: 3,
            }}
            component={Paper}
            style={{ maxHeight: "80vh", overflow: "auto" }}
          >
            <Table>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  background: "#ece7ee",
                }}
              >
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    ProductCode
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Title
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Material Type
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Catergory Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    PurchaseDate
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    SellerName
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    IsWithGST
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Size-InStock-PurchaseQty-NetWeight-PurchasePrice-MRP-RePrice-OnPrice-OffPrice
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jsonData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{data.ProductCode}</TableCell>
                    <TableCell align="center">{data.Title}</TableCell>
                    <TableCell align="center">{data.Description}</TableCell>
                    <TableCell align="center">{data.MaterialType}</TableCell>
                    <TableCell align="center">{data.CategoryName}</TableCell>
                    <TableCell align="center">
                      {data["PurchaseDate(YYYY-MM-DD)"]}
                    </TableCell>
                    <TableCell align="center">{data.SellerName}</TableCell>
                    <TableCell align="center">{data.IsWithGST}</TableCell>
                    <TableCell align="center">
                      <Table size="small">
                        <TableBody>
                          {data[
                            "Sizes(Size-Instock-purchaseQty-netWeight-PurchasePrice-MRP-ResellingPrice-Price-OfflineSellingPrice;)"
                          ].map((size, index) => (
                            <TableRow key={index}>
                              <TableCell>{size.size}</TableCell>
                              <TableCell>{size.inStock}</TableCell>
                              <TableCell>{size.purchaseQty}</TableCell>
                              <TableCell>{size.netWeight}g</TableCell>
                              <TableCell>₹{size.purchasePrice}</TableCell>
                              <TableCell>₹{size.MRP}</TableCell>
                              <TableCell>₹{size.resellingPrice}</TableCell>
                              <TableCell>₹{size.price}</TableCell>
                              <TableCell>₹{size.offlineSellingPrice}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ position: "absolute", right: 20, bottom: 20 }}>
          {!loading && jsonData && jsonData.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveData}
              sx={{ marginRight: "10px" }}
            >
              Save Data
            </Button>
          )}
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </Box>
      </Container>
    </>
  );
}

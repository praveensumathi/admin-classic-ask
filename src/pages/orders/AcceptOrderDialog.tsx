import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogContent,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateOrderStatus } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import { useSnackBar } from "../../context/SnackBarContext";
import { OrderStatusEnum } from "../../common/components/enum/OrderEnum";

interface IProps {
  dialogOpen: boolean;
  onDialogClose(): void;

  orderId: string;
  status: number;
}

function AcceptOrderDialog(props: IProps) {
  const courierOptions = [
    { id: "Shiprocket", name: "Shiprocket" },
    { id: "DTDC", name: "DTDC" },
    { id: "IndianPost", name: "IndianPost" },
    { id: "St Courier", name: "St Courier" },
  ];

  const { dialogOpen, onDialogClose, orderId, status } = props;
  const { updateSnackBarState } = useSnackBar();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [curierCharge, setCurierCharge] = useState(0);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setSelectedImage(selectedFile);
    }
  };

  const handleCourierChange = (e) => {
    setSelectedCourier(e.target.value);
  };

  const handleAcceptButtonClick = async () => {
    const formData = new FormData();
    if (selectedImage) {
      formData.append("acceptOrderImage", selectedImage || "");
      formData.append("status", `${OrderStatusEnum.Completed}`);
      formData.append("id", orderId);
      formData.append("courierType", selectedCourier || "");
      formData.append("curierCharge", curierCharge.toString() || "");

      try {
        await updateOrderStatus(formData);
        onDialogClose();
        navigate(paths.ROOT);
      } catch (error: any) {
        if (error.response && error.response.data) {
          console.log(error.response.data);
          updateSnackBarState(true, error.response.data.message, "error");
        }
      }
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={onDialogClose}
      PaperProps={{ sx: { width: "45vw" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={"600"}>
          Tracking Details
        </Typography>
        <IconButton onClick={onDialogClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box display={"flex"} gap={2} alignItems={"center"} mb={2}>
          <Typography fontWeight={600}>Upload Attachment:</Typography>
          <Button variant="outlined" onClick={handleUploadButtonClick}>
            Upload File
          </Button>
        </Box>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />

        {selectedImage && (
          <Box mb={2}>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Attachment"
              style={{
                maxWidth: "100%",
              }}
            />
          </Box>
        )}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="curier-type">Select Courier Type</InputLabel>
          <Select
            margin="dense"
            labelId="curier-type"
            label="Select Courier Type"
            onChange={handleCourierChange}
          >
            {courierOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            margin="dense"
            id="curier-charge"
            label="Curier Charge (₹)"
            variant="outlined"
            onChange={(event) => {
              if (parseInt(event.target.value) >= 0)
                setCurierCharge(parseInt(event.target.value));
            }}
          />
        </FormControl>
      </DialogContent>

      <DialogActions>
        {selectedImage && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleAcceptButtonClick}
          >
            Upload Now
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AcceptOrderDialog;

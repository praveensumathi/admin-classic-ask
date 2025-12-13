import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import BillPrintPage from "./BillPrintPage";
import { IOfflineOrder } from "../../interface/product";

interface IProps {
  dialogOpen: boolean;
  onPrintclose(): void;
  title: string;
  content: string;

  offlineOrderData?: IOfflineOrder;
}
function CommonPrintDialog(props: IProps) {
  const {
    dialogOpen,
    onPrintclose: onDialogclose,
    title,
    content,
    offlineOrderData,
  } = props;

  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Dialog open={dialogOpen} onClose={onDialogclose}>
        <DialogTitle>
          {title}
          <CloseIcon
            onClick={onDialogclose}
            sx={{ cursor: "pointer", float: "right" }}
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogclose} variant="contained" color="error">
            Cancel
          </Button>
          <ReactToPrint
            trigger={() => <Button variant="contained">Print</Button>}
            content={() => componentRef.current}
          />
        </DialogActions>
      </Dialog>
      <Box sx={{ display: "none" }}>
        <BillPrintPage ref={componentRef} offlineOrderData={offlineOrderData} />
      </Box>
    </>
  );
}

export default CommonPrintDialog;

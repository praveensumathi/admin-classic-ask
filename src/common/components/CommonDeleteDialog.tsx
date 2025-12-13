import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  dialogOpen: boolean;
  onDialogclose(): void;
  onDelete(): void;
  title: string;
  content: string;
}

function CommonDeleteDialog(props: IProps) {
  const { dialogOpen, onDialogclose, onDelete, title, content } = props;

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
          <Button onClick={onDelete} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CommonDeleteDialog;

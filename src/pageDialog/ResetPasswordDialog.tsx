import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useEffect, useState } from "react";
interface IProps {
  dialogOpen: boolean;
  handleDialogclose(): void;
  closeCopyLinkDialog(): void;
  resetLink: string;
}

function ResetPasswordDialog(props: IProps) {
  const {
    dialogOpen: copyLinkDialogOpen,
    closeCopyLinkDialog,
    resetLink,
  } = props;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resetLink);
    setIsCopied(true);
  };

  useEffect(() => {
    let timeoutId: number;
    if (isCopied) {
      timeoutId = window.setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Reset isCopied to false after 2 seconds
    }
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  return (
    <div>
      <Dialog open={copyLinkDialogOpen} onClose={closeCopyLinkDialog} fullWidth>
        <DialogTitle>
          Copy Link
          <CloseIcon
            onClick={closeCopyLinkDialog}
            sx={{ cursor: "pointer", float: "right" }}
          />
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex" }}>
            <TextField
              fullWidth
              variant="outlined"
              value={resetLink}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={isCopied ? "Copied" : "Copy Link"} arrow>
                      <FileCopyIcon
                        sx={{ cursor: "pointer" }}
                        onClick={handleCopy}
                        color="primary"
                      />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResetPasswordDialog;

import { TextField, TextFieldProps } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

function SearchTextField(props: TextFieldProps) {
  return (
    <>
      <TextField
        {...props}
        InputProps={{
          startAdornment: (
            <SearchIcon
              fontSize="small"
              sx={{
                opacity: 0.6,
                marginRight: 1,
              }}
            />
          ),
        }}
      />
    </>
  );
}

export default SearchTextField;

import { Box } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProps {
  file: any;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: any;
  handleDeleteImage(index: number): void;
  id: string;
}

function ProductImage(props: IProps) {
  const { file, index, hoveredIndex, setHoveredIndex, handleDeleteImage, id } =
    props;

  return (
    <Box
      key={id}
      sx={{
        position: "relative",
        display: "flex",
      }}
      alignItems={"center"}
      justifyContent={"center"}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <img
        src={file}
        alt={`image-${index + 1}`}
        style={{
          width: "90px",
          height: "90px",
          cursor: "pointer",
        }}
      />
      {hoveredIndex != null && hoveredIndex === index && (
        <Box
          sx={{
            position: "absolute",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            backgroundColor: "white",
            opacity: 0.6,
          }}
        >
          <DeleteIcon
            fontSize="medium"
            onClick={() => handleDeleteImage(hoveredIndex!)}
          />
        </Box>
      )}
    </Box>
  );
}
export default ProductImage;

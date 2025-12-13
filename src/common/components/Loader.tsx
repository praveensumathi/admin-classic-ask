import React from "react";
import useAxiosLoader, {
  axiosInstanceWithCredential,
  axiosInstanceWithMultipartFormData,
  axiosInstanceWithOutCredential,
} from "../../services/http";
import { Box } from "@mui/material";

const Spinner = () => <div className="spinner"></div>;

function Loader() {
  const [axiosWithCredentialLoading] = useAxiosLoader(
    axiosInstanceWithCredential
  );
  const [axiosWithOutCredentialLoading] = useAxiosLoader(
    axiosInstanceWithOutCredential
  );
  const [axiosWithMultiPartheaderLoading] = useAxiosLoader(
    axiosInstanceWithMultipartFormData
  );

  var showLoading =
    axiosWithCredentialLoading ||
    axiosWithOutCredentialLoading ||
    axiosWithMultiPartheaderLoading;

  return (
    <>
      {showLoading && (
        <Box className="overlay">
          <Spinner />
          <img
            style={{
              borderRadius: "50%",
            }}
            className="spinner-image"
            src="\assets\images\Logo2.jpg"
            alt=""
          />
        </Box>
      )}
    </>
  );
}

export default Loader;

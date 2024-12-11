import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress /> {/* Show loading spinner */}
    </Box>
  );
};

export default Loader;

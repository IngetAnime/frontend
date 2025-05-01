import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AnimePage() {
  return (
    <Box className="px-4 sm:px-6 pt-5">
      <Outlet />
    </Box>
  )
}
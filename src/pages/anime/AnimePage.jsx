import { Container, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AnimePage() {
  return (
    <Box className="px-4 sm:px-6">
      <Outlet />
    </Box>
  )
}
import { Container, Typography, Button } from "@mui/material";
import { useContext } from 'react';
// import { AppContent } from '../context/AppContext';
import Header from "../component/Header";
import { Logout } from '@mui/icons-material';
// import useLogout from "../hooks/UseLogout";
import Wrapper from "../component/Wrapper";

export default function DashboardUser() {
  // const { userData } = useContext(AppContent);

  return (
    <Wrapper>
      <Header />
      <Container>
        {/* <Typography>Dashboard {userData.username || 'User'}</Typography> */}
        {/* <Button variant="contained" color="secondary" sx={{ p: 1 }} endIcon={<Logout />} onClick={useLogout}>Keluar</Button> */}
      </Container>

    </Wrapper>
  )
}
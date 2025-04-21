import { 
  Container, Box, Button, Avatar, Typography,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import Link from "../../component/Link.jsx";
import underDevelopment from "../../helper/underDevelopment.js";
import Wrapper from "../../component/Wrapper.jsx";

export default function AuthPage() {
  return (
    <Wrapper>
      <BackgroundForDekstop />
      <Header />
      <Container fullWidth sx={{ display: 'flex', justifyContent: 'flex-start', gap: 5 }}>
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', gap: 5, width: { sm: '30rem' } }} component={'main'}>
          <Outlet />
          <LoginPlatform />
        </Box>
      </Container>
    </Wrapper>
  )
}

function BackgroundForDekstop() {
  return (
    <div className="top-0 right-0 absolute flex-1 hidden md:block overflow-hidden inset-0 -z-1">
      <img src="/images/bg.jpg" alt="" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-l from-transparent from-5% via-white to-white" />
    </div>
  )
}

function Header() {
  return (
    <Box component={'header'} className="p-5 flex justify-between items-center">
      <Link sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 'fit-content' }} color="" underline="none" to={'/'}>
        <Avatar src="/images/logo.jpg" sx={{ m: '5px' }}/>
        <Typography variant={'h1'}>IngetAnime!</Typography>
      </Link>
    </Box>
  )
}

function LoginPlatform() {
  return (
    <Box fullWidth sx={{display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{display: 'flex', gap: 1 }}>
        <Button fullWidth variant="contained" color="default" sx={{ p: 1, textTransform: 'none' }} 
          startIcon={<img src="/images/google.png" alt="MAL" style={{ height: 15 }}/>}
          onClick={underDevelopment}
        >
          Google
        </Button>
        <Button fullWidth variant="contained" color="primary" sx={{ p: 1, textTransform: 'none', background: '#2E51A2' }} 
          startIcon={<img src="/images/mal.png" alt="MAL" style={{ height: 25 }}/>}
          onClick={underDevelopment}
        >
          MyAnimeList
        </Button>
      </Box>
    </Box>
  )
}
import { 
  Container, Box,
  Typography
} from "@mui/material";
import { Outlet } from "react-router-dom";
import ButtonLink from "../../component/ButtonLink.jsx"
import Logo from "../../component/Logo.jsx";
import Wrapper from "../../component/Wrapper.jsx";
import { toast } from "react-toastify";
import { getGoogleAuthUrl, getMALAuthUrl } from "../../services/auth.service.js";

export default function AuthPage() {
  return (
    <Wrapper className={'flex flex-col gap-5'}>
      <BackgroundForDekstop />
      <Header />
      <Container>
        <Box component={'main'} className="flex flex-col gap-7.5 max-w-100">
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
      <Logo />
    </Box>
  )
}

function LoginPlatform() {
  return (
    <Box className="flex gap-2.5">
      <ButtonLink 
        fullWidth sx={{ textTransform: 'none' }}
        variant="contained" color="default" 
        startIcon={<img src="/images/google.png" alt="MAL" style={{ height: 15 }}/>}
        onClick={async () => {
          try {
            const { data } = await getGoogleAuthUrl()
            window.location.href = data.authorizationUrl
          } catch(err) {
            console.log(err.message);
            toast.error('Terjadi kesalahan')
          }
        }}
      >
        Google
      </ButtonLink>
      <ButtonLink 
        fullWidth sx={{ textTransform: 'none', background: '#2E51A2' }} 
        variant="contained" color="primary" 
        startIcon={<img src="/images/mal.png" alt="MAL" style={{ height: 25 }}/>}
        onClick={async () => {
          try {
            const { data } = await getMALAuthUrl()
            window.location.href = data.authorizationUrl
          } catch(err) {
            console.log(err.message);
            toast.error('Terjadi kesalahan')
          }
        }}  
      >
        MyAnimeList
      </ButtonLink>
    </Box>
  )
}

export function TitleAndSubtitle({ title, subtitle }) {
  return (
    <Box 
      className="flex flex-col gap-2.5"
    >
      <Typography variant="h2" textAlign={'center'}>{title}</Typography>
      <Typography textAlign={'center'}>{subtitle}</Typography>
    </Box>
  )
}

export function Form({ children, onSubmit }) {
  return (
    <Box 
      className="flex flex-col gap-5"
      component={'form'} 
      onSubmit={(e) => onSubmit(e)}
    >
      {children}
    </Box>
  )
}
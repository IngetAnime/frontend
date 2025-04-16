import { useState } from "react"
import { Container, Typography, Box, TextField, Button, Link } from "@mui/material";
import { Login } from '@mui/icons-material';
import PasswordField from "../component/PasswordField";
import Header from "../component/Header";
import Footer from "../component/Footer";

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <>
      <Header />
      <Container fullWidth sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', gap: 5 }}>
        <div className="relative flex-1 hidden md:block rounded-r-4xl overflow-hidden">
          <img src="/images/bg.jpg" alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white" />
        </div>
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', gap: 5, width: { sm: '30rem' } }} component={'main'}>
          <Box fullWidth sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h2" textAlign={'center'}>Yōkoso!!!</Typography>
            <Typography textAlign={'center'}>Cari tempat nonton anime terbaik? Yuk eksplor disini!</Typography>
          </Box>

          <Box fullWidth sx={{display: 'flex', flexDirection: 'column', gap: 2 }} component={'form'}>
            <TextField
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              type="email"
              id="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordField 
              password={password} 
              setPassword={setPassword}
            />
            <PasswordField 
              password={confirmPassword} 
              setPassword={setConfirmPassword}
              label="Konfirmasi password"
            />
            <Button variant="contained" color="primary" sx={{ p: 1 }} endIcon={<Login />}>Daftar</Button>
            <Typography sx={{ textAlign: 'center', color: 'initial', fontSize: 'small' }}>
              Sudah punya akun? <Link href="/auth/login">Masuk</Link>
            </Typography>
          </Box>

          <Box fullWidth sx={{display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" color="default" sx={{ p: 1, textTransform: 'none' }} 
                startIcon={<img src="/images/google.png" alt="MAL" style={{ height: 15 }}/>}>
                Google
              </Button>
              <Button fullWidth variant="contained" color="primary" sx={{ p: 1, textTransform: 'none', background: '#2E51A2' }} 
                startIcon={<img src="/images/mal.png" alt="MAL" style={{ height: 25 }}/>}
              >
                MyAnimeList
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  )
}
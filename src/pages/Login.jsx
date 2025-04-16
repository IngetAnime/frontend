// import { AppContent } from "../context/AppContext";
// import axios from "axios";
import { useState } from "react"
import { Container, Typography, Box, TextField, Button, Link } from "@mui/material";
import { Login } from '@mui/icons-material';
import PasswordField from "../component/PasswordField";
import Header from "../component/Header";
import Footer from "../component/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
            <Typography variant="h2" textAlign={'center'}>Okaerinasai!!!</Typography>
            <Typography textAlign={'center'}>Tempat nonton anime makin banyak nih. Yuk eksplor lagi!</Typography>
          </Box>

          <Box fullWidth sx={{display: 'flex', flexDirection: 'column', gap: 2 }} component={'form'}>
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
            <Link textAlign={'right'} fontSize={'small'}>Lupa password?</Link>
            <Button variant="contained" color="primary" sx={{ p: 1 }} endIcon={<Login />}>Masuk</Button>
            <Typography sx={{ textAlign: 'center', color: 'initial', fontSize: 'small' }}>
              Belum punya akun? <Link href="/auth/register">Daftar</Link>
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

export function LoginAnuan() {
  // const { backendUrl, setIsLoggedIn,  } = useContext(AppContent)

  // const [identifier, setIdentifier] = useState('');
  // const [password, setPassword] = useState('');

  // async function onSubmitHandler(e) {
  //   try {
  //     e.preventDefault();

  //     axios.defaults.withCredentials = true; // Cookie also will be send

  //     const data = await axios.post(backendUrl + '/api/v1/auth/login', {
  //       identifier, password
  //     })
  //     console.log(data);
  //     if (data.status === 200) {
  //       setIsLoggedIn(true);
  //       alert('Login berhasil')
  //     }
  //   } catch(error) {
  //     alert(error.message)
  //   }
  // }

  // return (
  //   <div className="">
  //     <h1>Halaman Login</h1>
  //     <form onSubmit={onSubmitHandler}>
  //       <input 
  //         onChange={(e) => setIdentifier(e.target.value)}
  //         value={identifier}
  //         type="text" name="identifier" id="identifier" placeholder="Masukkan alamat email atau username ..."
  //       /> <br />
  //       <input 
  //         onChange={(e) => setPassword(e.target.value)}
  //         value={password}
  //         type="password" name="password" id="password" placeholder="Masukkan password ..."
  //       /> <br />
  //       <button>Login</button>
  //     </form>
  //   </div>
  // )
}
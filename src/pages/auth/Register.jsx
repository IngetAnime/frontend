// import { AppContent } from "../context/AppContext";
// import axios from "axios";
import { useContext, useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { Login } from '@mui/icons-material';
import PasswordField from "../../component/PasswordField";
// import { AppContent } from "../context/AppContext"
import underDevelopment from "../../helper/underDevelopment.js";
import Link from "../../component/Link";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getLastPath from "../../helper/getLastPath.js";

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { setIsLoggedIn, setUserData } = useContext(AppContext)
  const navigate = useNavigate()

  function handleSubmit(e) {
      // underDevelopment(e)
      e.preventDefault()
  
      setUserData({ username: username })
      setIsLoggedIn(true)
  
      toast.success(`Yōkoso ${username}-san`)
      navigate(getLastPath())
    }

  return (
    <>
      {/* Title and subtitle */}
      <Box fullWidth sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h2" textAlign={'center'}>Yōkoso!!!</Typography>
        <Typography textAlign={'center'}>Cari tempat nonton anime terbaik? Yuk eksplor disini!</Typography>
      </Box>

      {/* Register form */}
      <Box fullWidth sx={{display: 'flex', flexDirection: 'column', gap: 2 }} component={'form'} onSubmit={(e) => handleSubmit(e)}>
        <TextField
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          required
          type="email"
          id="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField 
          required
          password={password} 
          setPassword={setPassword}
        />
        <PasswordField 
          required
          password={confirmPassword} 
          setPassword={setConfirmPassword}
          label="Konfirmasi password"
        />
        <Button variant="contained" color="primary" sx={{ p: 1 }} endIcon={<Login />} type="submit">Daftar</Button>
        <Typography sx={{ textAlign: 'center', color: 'initial' }}>
          Sudah punya akun? <Link to={'/auth/login'}>Masuk</Link>
        </Typography>
      </Box>
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
import { useContext, useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { Login } from '@mui/icons-material';
import PasswordField from "../../component/PasswordField";
import Link from "../../component/Link";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getLastPath from "../../helper/getLastPath.js";
import { Form, TitleAndSubtitle } from "./AuthPage.jsx";

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
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'}/>

      {/* Register form */}
      <Form onSubmit={handleSubmit}>
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
        <Button variant="contained" color="primary" endIcon={<Login />} type="submit" size="large">Daftar</Button>
        <Typography textAlign={'center'}>
          Sudah punya akun? <Link to={'/auth/login'}>Masuk</Link>
        </Typography>
      </Form>
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
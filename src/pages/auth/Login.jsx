import { useContext, useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { Login } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import PasswordField from "../../component/PasswordField";
import Link from "../../component/Link";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import getLastPath from "../../helper/getLastPath.js";
import { Form, TitleAndSubtitle } from "./AuthPage.jsx";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const { setIsLoggedIn, setUserData } = useContext(AppContext)
  const navigate = useNavigate()

  function handleSubmit(e) {
    // underDevelopment(e)
    e.preventDefault()

    setUserData({ username: identifier })
    setIsLoggedIn(true)

    toast.success(`Okaerinasai ${identifier}-san`)
    navigate(getLastPath())
  }

  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Okaerinasai!!!'} subtitle={'Tempat nonton anime makin banyak nih. Yuk eksplor lagi!'} />

      {/* Login form */}
      <Form onSubmit={handleSubmit}>
        <TextField
          id="identifier"
          label="Username atau email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <PasswordField 
          password={password} 
          setPassword={setPassword}
        />
        <Link textAlign={'right'} to={'/auth/forgot-password'}>Lupa password?</Link>
        <Button variant="contained" color="primary" endIcon={<Login />} type="submit" size="large">Masuk</Button>
        <Typography textAlign={'center'}>
          Belum punya akun? <Link to={'/auth/register'}>Daftar</Link>
        </Typography>
      </Form>
    </>
  )
}

// export function LoginAnuan() {
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
// }
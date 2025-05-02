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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { confirmPassword, email, password, username } from "../../validators/index.validator.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerUser } from "../../services/auth.service.js";

export default function RegisterPage() {
  const schema = z.object({
    username: username,
    email: email,
    password: password,
    confirmPassword: confirmPassword
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })

  const { register, setError, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema), mode: 'onChange'
  })

  async function onSubmit(req) {
    try {
      const { data } = await registerUser(req.username, req.email, req.password, req.confirmPassword)
      toast.success(`Tautan verifikasi telah dikirimkan ke email: ${data.email}`)
    } catch(err) {
      const res = err.response;
      const message = res && res.status === 409 ? 'Username atau email telah digunakan' : 'Terjadi kesalahan';
      toast.error(message)
      if (res) 
        console.log(res.message);
        setError('root', { message: message })
    }
  }

  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'} />

      {/* Register form */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="username"
          label="Username"
          autoComplete="username"
          {...register('username')}
          {...(errors.username && { error: true, helperText: errors.username.message })}
          {...(errors.root && {error: true, helperText: 'Username atau email telah digunakan'})}
        />
        <TextField
          required
          type="email"
          id="email"
          label="Email"
          autoComplete="email"
          {...register('email')}
          {...((errors.email) && {error: true, helperText: errors.email.message})}
          {...(errors.root && {error: true, helperText: 'Username atau email telah digunakan'})}
        />
        <PasswordField 
          required
          register={register('password')}
          error={errors.password}
        />
        <PasswordField 
          required
          label="Konfirmasi password"
          register={register('confirmPassword')}
          error={errors.confirmPassword}
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
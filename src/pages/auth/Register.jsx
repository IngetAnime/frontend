import { Typography, TextField, Button } from "@mui/material";
import { Login } from '@mui/icons-material';
import PasswordField from "../../component/PasswordField";
import Link from "../../component/Link";
import { toast } from "react-toastify";
import { Form, TitleAndSubtitle } from "./AuthPage.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { confirmPassword, email, password, username } from "../../validators/index.validator.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerUser } from "../../services/auth.service.js";
import useLogin from "../../hooks/useLogin.js";
import { useEffect, useState } from "react";
import { checkEmailAvailability, checkUsernameAvailability } from "../../services/user.service.js";

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

  const { register, setError, clearErrors, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema), mode: 'onChange'
  })

  const login = useLogin()

  async function onSubmit(req) {
    const { success, data, status, message } = await registerUser(req.username, req.email, req.password, req.confirmPassword)
    if (success) {
      toast.success(message);
      login(data);
    } else {
      toast.error(message);
      if (status === 409) {
        setError('root', { message: message });
      }
    }
  }

  // Check username and email availability

  const emailVal = watch('email');
  const usernameVal = watch('username');
  const [emailMessage, setEmailMessage] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout( async () => {
      if (errors.email || !emailVal) return; // Local error
      setEmailMessage('Mengecek ...');
      const { status, message } = await checkEmailAvailability(emailVal); // Hit API
      if (status === 400 || status === 409) {
        setError('email', { message: message });
      } else {
        setEmailMessage(message);
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn);
  }, [emailVal]);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout( async () => {
      if (errors.username || !usernameVal) return; // Local error
      setUsernameMessage('Mengecek ...');
      const { status, message } = await checkUsernameAvailability(usernameVal); // Hit API
      if (status === 400 || status === 409) {
        setError('username', { message: message });
      } else {
        setUsernameMessage(message);
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn);
  }, [usernameVal]);

  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'} />

      {/* Register form */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* <TextField
          id="username"
          label="Username"
          autoComplete="username"
          {...register('username', { onChange: () => clearErrors('root') })}
          {...(errors.username && { error: true, helperText: errors.username.message })}
          {...(errors.root && {error: true, helperText: 'Username atau email telah digunakan'})}
        />
        <TextField
          required
          type="email"
          id="email"
          label="Email"
          autoComplete="email"
          {...register('email', { onChange: () => clearErrors('root') })}
          {...((errors.email) && {error: true, helperText: errors.email.message})}
          {...(errors.root && {error: true, helperText: 'Username atau email telah digunakan'})}
        /> */}
        <TextField
          fullWidth
          disabled={isSubmitting}
          id="username"
          label="Username"
          autoComplete="username"
          {...register('username', { 
            onChange: () => { 
              clearErrors('root'); 
              clearErrors('username'); 
            }
          })}
          helperText={
            errors.username ? errors.username.message : 
            errors.root ? 'Username tidak cocok' :
            usernameMessage
          }
          {...((errors.username) && { error: true })}
          {...((errors.root) && { error: true })}
        />
        <TextField
          fullWidth
          disabled={isSubmitting}
          id="email"
          label="Email"
          autoComplete="email"
          {...register('email', { 
            onChange: () => { 
              clearErrors('root'); 
              clearErrors('email'); 
            }
          })}
          helperText={
            errors.email ? errors.email.message : 
            errors.root ? 'Email tidak cocok' :
            emailMessage
          }
          {...((errors.email) && { error: true })}
          {...((errors.root) && { error: true })}
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
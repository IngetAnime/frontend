import { Typography, TextField, Button } from "@mui/material";
import { Login } from '@mui/icons-material';
import PasswordField from "../../component/PasswordField";
import Link from "../../component/Link";
import { toast } from "react-toastify";
import { Form, TitleAndSubtitle } from "./AuthPage.jsx";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { identifier, loginPassword } from "../../validators/index.validator.js";
import { zodResolver } from "@hookform/resolvers/zod"
import { login } from "../../services/auth.service.js";
import useLogin from "../../hooks/useLogin.js";

export default function LoginPage() {
  const schema = z.object({
    identifier: identifier,
    password: loginPassword
  })
  
  const loginUser = useLogin()
  const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({ 
    resolver: zodResolver(schema), mode: 'onChange'
  })

  async function onSubmit(req) {
    try {
      const { data } = await login(req.identifier, req.password)
      loginUser(data)
    } catch(err) {
      const res = err.response;
      const message = res && res.status === 400 ? 'Username, email, atau password yang dimasukkan salah' : 'Terjadi kesalahan';
      toast.error(message)
      if (res.status === 400) 
        setError('root', { message: message })
    }
  }

  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Okaerinasai!!!'} subtitle={'Tempat nonton anime makin banyak nih. Yuk eksplor lagi!'} />

      {/* Login form */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          disabled={isSubmitting}
          id="identifier"
          label="Username atau email"
          autoComplete="identifier"
          {...register('identifier', { onChange: () => clearErrors('root') })}
          {...((errors.identifier) && {error: true, helperText: errors.identifier.message})}
          {...((errors.root) && {error: true, helperText: 'Username atau email tidak cocok'})}
        />
        <PasswordField 
          isSubmitting={isSubmitting}
          register={register('password', { onChange: () => clearErrors('root') })} 
          error={errors.password}
          rootError={errors.root}
        />
        <Link textAlign={'right'} to={'/auth/forgot-password'}>Lupa password?</Link>
        <Button variant="contained" color="primary" endIcon={<Login />} type="submit" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Masuk'}
        </Button>
        <Typography textAlign={'center'}>
          Belum punya akun? <Link to={'/auth/register'}>Daftar</Link>
        </Typography>
      </Form>
    </>
  )
}
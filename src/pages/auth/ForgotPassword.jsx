import { TextField, Button } from "@mui/material"
import { Key, Send } from "@mui/icons-material"
import { Form, TitleAndSubtitle } from "./AuthPage"
import { useResendCountdown } from "../../hooks/useResendCountdown.js"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { confirmPassword, identifier, password } from "../../validators/index.validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPassword, resetPassword } from "../../services/auth.service.js"
import { toast } from "react-toastify"
import { useSearchParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import useLogin from "../../hooks/useLogin.js"
import PasswordField from "../../component/PasswordField.jsx"

export default function ForgotPasswordPage() {
  const [ searchParam ] = useSearchParams();
  const [ isTokenProvided, setIsTokenProvided] = useState(false);
  const didRun = useRef(false)
  
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    setIsTokenProvided(searchParam.has('token'))
  }, [searchParam])

  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Daijoubu!!!'} subtitle={'Gak usah takut akunmu hilang, kami akan bantu kok!'}/>

      {/* Forgot password form */}
      { isTokenProvided ? <ResetPassword searchParam={searchParam} /> : <ForgotPassword /> }
    </>
  )
}

function ForgotPassword() {
  const schema = z.object({
    identifier: identifier
  })

  const { seconds, canResend, start } = useResendCountdown()

  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm({
    resolver: zodResolver(schema), mode: 'onChange'
  })

  const handleResend = async (req) => {
    const { success, status, message } = await forgotPassword(req.identifier)
    if (success) {
      toast.success(message);
      start();
    } else {
      toast.error(message);
      if (status === 404) {
        setError('root', { message: message });
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleResend)}>
      <TextField
        id="identifier"
        label="Username atau email"
        {...register('identifier', { onChange: () => clearErrors('root') })}
        {...errors.identifier && { error: true, helperText: errors.identifier.message }}
        {...errors.root && { error: true, helperText: errors.root.message }}
      />
      <Button variant="contained" color="primary" endIcon={<Send />} type="submit" disabled={!canResend} size="large">
        Kirim tautan {!canResend ? ` ulang dalam ${seconds} detik` : ''}
      </Button>
    </Form>
  )
}

function ResetPassword({ searchParam }) {
  const schema = z.object({
    newPassword: password,
    confirmPassword: confirmPassword,
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })

  const login = useLogin();
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema), mode: 'onChange'
  })

  const onSubmit = async (req) => {
    const token = searchParam.get('token')
    const { success, data, status, message } = await resetPassword(token, req.newPassword, req.confirmPassword)
    if (success) {
      toast.success(message);
      login(data)
    } else {
      toast.error(message);
      if (status === 400) {
        setError('root', { message: message });
      }
    }
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <PasswordField key={'1'}
        register={register('newPassword')}
        error={errors.newPassword}
      />
      <PasswordField key={'2'}
        register={register('confirmPassword')}
        error={errors.confirmPassword}
        label="Konfirmasi password"
      />
      <Button variant="contained" color="primary" endIcon={<Key />} type="submit" size="large">Reset password</Button>
    </Form>
  )
}
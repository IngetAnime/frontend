import { TextField, Button } from "@mui/material"
import { Send } from "@mui/icons-material"
import { Form, TitleAndSubtitle } from "./AuthPage"
import { useResendCountdown } from "../../hooks/useResendCountdown.js"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { identifier } from "../../validators/index.validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPassword } from "../../services/auth.service.js"
import { toast } from "react-toastify"

export default function ForgotPasswordPage() {
  const schema = z.object({
    identifier: identifier
  })

  const { seconds, canResend, start } = useResendCountdown()

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema), mode: 'onChange'
  })

  const handleResend = async (req) => {
    try {
      const { data } = await forgotPassword(req.identifier)
      toast.success(`Tautan reset password telah dikirimkan ke email: ${data.email}`);
      start()
    } catch(err) {
      const res = err.response;
      const message = res && res.status === 404 ? 'Username atau email tidak ditemukan' : 'Terjadi kesalahan';
      toast.error(message)
      if (res) {
        console.log(res.message);
        setError('root', { message: message })
      }
    }
  }
  
  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Daijoubu!!!'} subtitle={'Gak usah takut akunmu hilang, kami akan bantu kok!'}/>

      {/* Forgot password form */}
      <Form onSubmit={handleSubmit(handleResend)}>
        <TextField
          id="identifier"
          label="Username atau email"
          {...register('identifier')}
          {...errors.identifier && { error: true, helperText: errors.identifier.message }}
          {...errors.root && { error: true, helperText: errors.root.message }}
        />
        <Button variant="contained" color="primary" endIcon={<Send />} type="submit" disabled={!canResend} size="large">
          Kirim tautan {!canResend ? ` ulang dalam ${seconds} detik` : ''}
        </Button>
      </Form>
    </>
  )
}

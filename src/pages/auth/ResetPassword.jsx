import { Button } from "@mui/material"
import { useContext } from "react"
// import underDevelopment from "../../helper/underDevelopment"
import PasswordField from "../../component/PasswordField"
import { Key } from "@mui/icons-material"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../context/AppContext.jsx"
import { Form, TitleAndSubtitle } from "./AuthPage.jsx"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { confirmPassword, password } from "../../validators/index.validator.js"
import { resetPassword } from "../../services/auth.service.js"

export default function ResetPasswordPage() {
  const schema = z.object({
    newPassword: password,
    confirmPassword: confirmPassword,
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })

  const navigate = useNavigate()
  const { setIsLoggedIn, setUserData } = useContext(AppContext)
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString)
  const token = urlParams.get('token')

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema), mode: 'onChange'
  })

  const onSubmit = async (req) => {
    try {
      const { data } = await resetPassword(token, req.newPassword, req.confirmPassword)
      setIsLoggedIn(true)
      setUserData(data)
      navigate('/')
      toast.success('Password berhasil diperbarui')
      toast.success(`Okaerinasai, ${data.username}-san!`)
    } catch(err) {
      const res = err.response;
      const message = res && res.status === 400 ? 'Token tidak valid atau sudah kedaluwarsa' : 'Terjadi kesalahan';
      toast.error(message)
      if (res) 
        console.log(res.message);
        setError('root', { message: message })
    }
  }
  
  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Daijoubu!!!'} subtitle={'Gak usah takut akunmu hilang, kami akan bantu kok!'}/>

      {/* Reset password form */}
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
    </>
  )
}

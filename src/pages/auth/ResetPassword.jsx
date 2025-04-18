import { Box, Typography, TextField, Button } from "@mui/material"
import { useContext, useState } from "react"
// import underDevelopment from "../../helper/underDevelopment"
import PasswordField from "../../component/PasswordField"
import { Key } from "@mui/icons-material"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import getLastPath from "../../helper/getLastPath.js"
import { AppContext } from "../../context/AppContext.jsx"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { setIsLoggedIn } = useContext(AppContext)
  
  const navigate = useNavigate()

  function handleResetPassword(e) {
    // underDevelopment(e)
    e.preventDefault()
    setIsLoggedIn(true)

    toast.success('Password berhasil diperbarui')
    navigate(getLastPath())
  }
  
  return (
    <>
      {/* Title and subtitle */}
      <Box fullWidth sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h2" textAlign={'center'}>Daijoubu!!!</Typography>
        <Typography textAlign={'center'}>Gak usah takut akunmu hilang, kami akan bantu kok!</Typography>
      </Box>

      {/* Reset password form */}
      <Box fullWidth sx={{display: 'flex', flexDirection: 'column', gap: 2 }} component={'form'} onSubmit={(e) => handleResetPassword(e)}>
        <PasswordField key={'1'}
          password={password} 
          setPassword={setPassword}
        />
        <PasswordField key={'2'}
          password={confirmPassword} 
          setPassword={setConfirmPassword}
          label="Konfirmasi password"
        />
        <Button variant="contained" color="primary" sx={{ p: 1 }} endIcon={<Key />} type="submit">Reset password</Button>
      </Box>
    </>
  )
}

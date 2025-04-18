import { Box, Typography, TextField, Button } from "@mui/material"
import { useEffect, useState } from "react"
import underDevelopment from "../../helper/underDevelopment"
import { Send } from "@mui/icons-material"

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')

  const [seconds, setSeconds] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const expiryTime = 60;

  useEffect(() => {
    const expireAt = parseInt(localStorage.getItem('resendExpireAt')) || 0;
    const now = Date.now();
    const remaining = Math.ceil((expireAt - now) / 1000);

    if (remaining > 0) {
      setSeconds(remaining);
      setCanResend(false);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (!canResend && seconds > 0) {
      timer = setTimeout(() => {
        setSeconds(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setCanResend(true);
            localStorage.removeItem('resendExpireAt');
          }
          return next;
        });
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [seconds, canResend]);

  const handleResend = () => {
    if (!canResend) return;

    const expireAt = Date.now() + expiryTime * 1000;
    localStorage.setItem('resendExpireAt', String(expireAt));
    setSeconds(expiryTime);
    setCanResend(false);
  };
  
  return (
    <>
      {/* Title and subtitle */}
      <Box fullWidth sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h2" textAlign={'center'}>Daijoubu!!!</Typography>
        <Typography textAlign={'center'}>Gak usah takut akunmu hilang, kami akan bantu kok!</Typography>
      </Box>

      {/* Forgot password form */}
      <Box fullWidth sx={{display: 'flex', flexDirection: 'column', gap: 2 }} component={'form'} 
        onSubmit={(e) => {
          underDevelopment(e)
          handleResend()
        }}>
        <TextField
          id="identifier"
          label="Username atau email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Button variant="contained" color="primary" sx={{ p: 1 }} endIcon={<Send />} type="submit" disabled={!canResend}>
          Kirim tautan {!canResend ? ` ulang dalam ${seconds} detik` : ''}
        </Button>
      </Box>
    </>
  )
}

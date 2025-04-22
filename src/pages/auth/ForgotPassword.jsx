import { Box, Typography, TextField, Button } from "@mui/material"
import { useEffect, useState } from "react"
import underDevelopment from "../../helper/underDevelopment"
import { Send } from "@mui/icons-material"
import { Form, TitleAndSubtitle } from "./AuthPage"

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

  const handleResend = (e) => {
    if (!canResend) return;
    underDevelopment(e)
    const expireAt = Date.now() + expiryTime * 1000;
    localStorage.setItem('resendExpireAt', String(expireAt));
    setSeconds(expiryTime);
    setCanResend(false);
  };
  
  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Daijoubu!!!'} subtitle={'Gak usah takut akunmu hilang, kami akan bantu kok!'}/>

      {/* Forgot password form */}
      <Form onSubmit={handleResend}>
        <TextField
          id="identifier"
          label="Username atau email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Button variant="contained" color="primary" endIcon={<Send />} type="submit" disabled={!canResend} size="large">
          Kirim tautan {!canResend ? ` ulang dalam ${seconds} detik` : ''}
        </Button>
      </Form>
    </>
  )
}

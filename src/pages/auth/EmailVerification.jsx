import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import ButtonLink from '../../component/ButtonLink';
import { Form, TitleAndSubtitle } from './AuthPage';
import { useContext, useEffect, useState } from 'react';
import { resendVerification, verifyEmail } from '../../services/auth.service';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function EmailVerificationPage() {
  // Handle email verification
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const token = urlParams.get('token')

    const verifyEmailUser = async () => {
      try {
        console.log(token);
        await verifyEmail(token)
        toast.success(`Email berhasil di verifikasi`)
        navigate('/')
      } catch(err) {
        const res = err.response;
        if (res) {
          console.log(res);
        }
        const message = res && res.status === 400 ? 'Token tidak valid atau sudah kedaluwarsa' : 'Terjadi kesalahan';
        toast.error(message)
      }
    }
    if (token) {
      verifyEmailUser()
    }
  }, [navigate])

  // Handle countdown for request resend link

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

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const handleResend = async () => {
    if (!canResend) return;
    try {
      const { data } = await resendVerification();
      toast.success(`Tautan verifikasi telah dikirimkan ke email: ${data.email}`);
      const expireAt = Date.now() + expiryTime * 1000;
      localStorage.setItem('resendExpireAt', String(expireAt));
      setSeconds(expiryTime);
      setCanResend(false);
    } catch(err) {
      const res = err.response;
      const message = res && res.status === 404 ? 'Token tidak valid, silakan login ulang' : 'Terjadi kesalahan';
      toast.error(message)
    }
  };

  // This site need user logged in

  const { isLoggedIn } = useContext(AppContext);

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {/* Title and subtitle */}
      <TitleAndSubtitle title={'Yōkoso!!!'} subtitle={'Cari tempat nonton anime terbaik? Yuk eksplor disini!'}/>
      
      {
        isLoggedIn === null ? (<CircularProgress className='m-auto' />) : 
        isLoggedIn === false ? null : 
        <Form onSubmit={handleSubmit(handleResend)}>
          <Typography textAlign={'center'}>Belum menerima tautan verifikasi?</Typography>
          <Button variant="contained" color="primary" endIcon={<Send />} type="submit" disabled={!canResend || isSubmitting} size="large">
            Kirim tautan {!canResend ? ` ulang dalam ${seconds} detik` : ''}
          </Button>
        </Form>
      }

      {/* Reset password form */}
      {/* <ButtonLink variant="contained" color="primary" startIcon={<ArrowBack />} to={'/'} size="large">
        Kembali
      </ButtonLink> */}
    </>
  )
}
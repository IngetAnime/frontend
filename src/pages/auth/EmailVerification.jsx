import { Typography, Button, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import { Form, TitleAndSubtitle } from './AuthPage';
import { useEffect, useState } from 'react';
import { resendVerification, verifyEmail } from '../../services/auth.service';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useRequireLogin } from '../../hooks/useRequireLogin';
import { useResendCountdown } from '../../hooks/useResendCountdown';

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const [ searchParam ] = useSearchParams();
  const { isLoggedIn } = useRequireLogin();
  const { seconds, canResend, start } = useResendCountdown(60)

  const [hasExchanged, setHasExchanged] = useState(false);
  useEffect(() => {
    const token = searchParam.get('token')

    if (hasExchanged) return;

    const verifyEmailUser = async () => {
      try {
        setHasExchanged(true)
        await verifyEmail(token)
        toast.success(`Email berhasil di verifikasi`)
        navigate('/')
      } catch(err) {
        const res = err.response;
        const message = res && res.status === 400 ? 'Token tidak valid atau sudah kedaluwarsa' : 'Terjadi kesalahan';
        toast.error(message)
      }
    }
    
    if (token) verifyEmailUser();
  }, [navigate, hasExchanged, searchParam])

  const { handleSubmit, formState: { isSubmitting } } = useForm()

  const handleResend = async () => {
    if (!canResend) return;
    try {
      const { data } = await resendVerification();
      toast.success(`Tautan verifikasi telah dikirimkan ke email: ${data.email}`);
      start()
    } catch(err) {
      const res = err.response;
      const message = res && res.status === 404 ? 'Token tidak valid, silakan login ulang' : 'Terjadi kesalahan';
      toast.error(message)
    }
  };  

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
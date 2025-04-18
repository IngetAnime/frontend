import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ButtonLink from '../../component/ButtonLink';

export default function EmailVerificationPage() {
  return (
    <>
      {/* Title and subtitle */}
      <Box fullWidth sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h2" textAlign={'center'}>Yōkoso!!!</Typography>
        <Typography textAlign={'center'}>Cari tempat nonton anime terbaik? Yuk eksplor disini!</Typography>
      </Box>

      {/* Reset password form */}
      <Box fullWidth sx={{display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ButtonLink variant="contained" color="primary" sx={{ p: 1 }} startIcon={<ArrowBack />} to={'/'}>
          Kembali
        </ButtonLink>
      </Box>
    </>
  )
}
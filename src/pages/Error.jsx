import { Container, Box, Typography, Button } from "@mui/material"
import Header from "../component/Header"
import Wrapper from "../component/Wrapper"
import Footer from "../component/Footer"
import ButtonLink from "../component/ButtonLink"
import { ArrowBack } from "@mui/icons-material"

export default function ErrorPage() {
  return (
    <Wrapper>
      <Box component={'div'} className="flex flex-col justify-between min-h-dvh">
        <Header />
        <Container component={'div'} className="flex-1 mt-10">
          <Typography variant="h2">404</Typography>
          <Typography 
            fontWeight={'bold'} 
            color="secondary"
            component={'div'}
            fontSize={'small'} 
            sx={{
              fontSize: { xs: '3rem', md: '5rem' }
            }}
          >
            Halaman <br /> Tidak Ditemukan
          </Typography>
          <Typography variant="subtitle1">Gomennasai, kami tidak bisa menemukan halaman yang Anda cari :( </Typography>
          <ButtonLink variant="contained" startIcon={<ArrowBack />} sx={{ my: 5 }} to={'/'}>Kembali ke halaman utama</ButtonLink>

          <div className="top-0 right-0 absolute flex-1 hidden md:block overflow-hidden h-full -z-1">
            <img src="/images/not_found.png" alt="" className="w-full h-full object-cover"/>
          </div>
        </Container>
        <Footer />
      </Box>
    </Wrapper>
  )
}
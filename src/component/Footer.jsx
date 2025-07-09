import { Box, Avatar, Typography, Container, Toolbar, Divider, Menu, MenuItem, IconButton, List, ListItem } from "@mui/material";
import Logo from "./Logo";
import { GitHub, Instagram, LinkedIn } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: 'primary.main', marginTop: 2 }}>
      <Container className="py-4 text-white flex flex-col gap-5">
        <Box className="flex items-center justify-between py-2 flex-col gap-5 md:gap-0 md:flex-row">
          <Box className="flex items-center w-full justify-between md:justify-center gap-2 md:gap-0 md:max-w-fit">
            <Logo color="white" />
            <Typography sx={{ color: '#aaffe2' }} className="text-right md:text-left">
              <span className="hidden md:inline">&nbsp;/</span> Cari tempat nonton anime terbaik
            </Typography>
          </Box>
          <Typography>Designed and coded by Ahmad Subhan D</Typography>
        </Box>
        <Box className="flex items-center justify-between">
          <Typography>&copy; 2025. All rights reserved.</Typography>
          <List disablePadding className="flex">
            <ListItem disablePadding>
              <IconButton href="https://github.com/ahmadsubhand" target={'_blank'} sx={{ color: 'white' }}>
                <GitHub />
              </IconButton>
            </ListItem>
            <ListItem disablePadding>
              <IconButton href="https://www.instagram.com/ahmadsubhand" target={'_blank'} sx={{ color: 'white' }}>
                <Instagram />
              </IconButton>
            </ListItem>
            <ListItem disablePadding>
              <IconButton href="https://www.linkedin.com/in/ahmadsubhand/" target={'_blank'} sx={{ color: 'white' }}>
                <LinkedIn />
              </IconButton>
            </ListItem>
          </List>
        </Box>
        {/* <Typography component={'footer'} fontWeight={'medium'} textAlign={'center'}>2025 - IngetAnime</Typography> */}
      </Container>
    </Box>
  )
}
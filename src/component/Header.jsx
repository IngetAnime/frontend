import { 
  Box, Avatar, Typography, Tooltip, IconButton, Menu, MenuItem, Divider, ListItemIcon, Button,
} from "@mui/material";
import { Logout, Settings, Login } from "@mui/icons-material";
import Link from "./Link";
import { useState, Fragment, useContext } from "react";
import { AppContext } from "../context/AppContext";
import underDevelopment from "../helper/underDevelopment";
import ButtonLink from "./ButtonLink";
import { toast } from "react-toastify";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn, userData } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log(isLoggedIn);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetting = () => {
    handleClose()
    underDevelopment()
  }

  const handleLogout = () => {
    handleClose();
    toast.success(`Matane, ${userData.username}-san`)
    setIsLoggedIn(false)
  }

  return (
    <Box component={'header'} className="p-5 flex justify-between items-center">
      {/* IngetAnime logo */}
      <Link sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 'fit-content' }} color="standard" underline="none" to={'/'}>
        <Avatar src="/images/logo.jpg" sx={{ m: '5px' }}/>
        <Typography variant={'h1'}>IngetAnime!</Typography>
      </Link>

      {/* Profile user */}
      <div data-active={isLoggedIn} className="hidden data-[active=true]:block">
      {/* <div className="hidden"> */}
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Pengaturan akun" placement="bottom-end">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar src="/images/logo.jpg" />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleSetting}>
            <Avatar src="/images/logo.jpg" /> {userData.username}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSetting}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Pengaturan
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Keluar
          </MenuItem>
        </Menu>
      </div>

      <div data-active={isLoggedIn} className="block data-[active=true]:hidden">
        <ButtonLink variant="contained" endIcon={<Login />} to={'/auth/login'}>Masuk</ButtonLink>
      </div>
    </Box>
  )
}
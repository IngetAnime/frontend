import { 
  Box, Avatar, Typography, IconButton, Menu, MenuItem, Divider, ListItemIcon, AppBar, Toolbar,
  useScrollTrigger, Slide, List, ListItem, ListItemButton, ListItemText, Tooltip, SwipeableDrawer,
  Tabs, Tab
} from "@mui/material";
import { 
  Logout, Settings, Login, Menu as MenuIcon, DateRange, Explore, AccountCircle, LibraryBooks,
} from "@mui/icons-material";
import Link from "./Link";
import { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { AppContext } from "../context/AppContext";
import underDevelopment from "../helper/underDevelopment";
import ButtonLink from "./ButtonLink";
import Logo from "./Logo";
import AnimeSearch from "./Search";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout.js";

export default function Header() {
  const { isLoggedIn, userData } = useContext(AppContext);
  const navigate = useNavigate()
  const logoutUser = useLogout()
  const menuItem = [
    {
      text: 'Timeline',
      icon: <DateRange />,
      link: '/anime/timeline',
      onClick: () => {
        navigate('/anime/timeline')
      },
    },
    {
      text: 'Eksplorasi',
      icon: <Explore />,
      link: '/anime',
      onClick: () => {
        navigate('/anime')
      },
    },
    {
      text: 'List',
      icon: <LibraryBooks />,
      link: '/anime/myliststatus',
      onClick: () => {
        navigate('/anime/myliststatus')
      }
    }
  ]

  const profileMenu = [
    {
      text: 'Pengaturan',
      icon: <Settings />,
      onClick: underDevelopment,
    },
    {
      text: 'Keluar',
      icon: <Logout />,
      onClick: logoutUser,
    },
  ]

  const avatarProps = userData
  ? { src: userData.picture, alt: userData.username }
  : {};

  return (
    <>
      <HideOnScroll> 
        <AppBar> {/* Make nav static */}
          <Toolbar className="flex justify-between gap-5"> {/* Basic styling for nav */}
            <Box className="flex gap-5 w-full">
              <MobileMenu menuItem={menuItem} profileMenu={profileMenu} isLoggedIn={isLoggedIn} avatarProps={avatarProps} />
              <Logo color="white" className="hidden md:flex"/>
              <AnimeSearch />
            </Box>
            <DekstopMenu menuItem={menuItem} profileMenu={profileMenu} isLoggedIn={isLoggedIn} avatarProps={avatarProps} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar className="p-5"/> {/* Nav behind */}
    </>
  )
}

// Hide sliding when scrolling
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element,
};

function DekstopMenu({ menuItem, profileMenu, isLoggedIn=true, avatarProps }) {
  const [anchorEl, setAnchorEl] = useState(null)

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleCloseMenu() {
    setAnchorEl(null)
  }

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const profile = (
    <Box className={`flex`}>
      <Tooltip title="Buka pengaturan">
        <IconButton size="medium" onClick={handleOpenMenu} color="inherit">
          <Avatar {...avatarProps} sx={{ width: 35, height: 35 }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.25))',
              mt: 1.5,
              '& .MuiAvatar-root': { // Image profile style
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': { // Arrow up style
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
        <MenuItem>
          <Avatar {...avatarProps} /> {avatarProps?.alt}
        </MenuItem>
        <Divider />
        {profileMenu.map((menu, index) => (
          <MenuItem key={index} onClick={() => { menu.onClick(); handleCloseMenu(); }}>
            <ListItemIcon>
              {menu.icon}
            </ListItemIcon>
            {menu.text}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )

  const login = (
    <ButtonLink variant="contained" 
      endIcon={<Login />} 
      sx={{ 
        display: 'flex',
        my: 1,
        backgroundColor: 'white',
        color: 'primary.main',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
      }}
      to={'/auth/login'} 
    >
      <Box>Masuk</Box>
    </ButtonLink>
  )

  return (
    <Box className="hidden md:flex gap-7.5">
      {/* Navigation */}
      <List className="hidden gap-5 lg:flex">
        {menuItem.map((menu, index) => (
          <ListItem key={index} disablePadding>
            <Link color='white' className="flex gap-2.5 items-center" to={menu.link}>
              {menu.icon}
              {menu.text}
            </Link>
          </ListItem>
        ))}
      </List>
      <Tabs 
        value={value} onChange={handleChange}
        className="items-center" variant="scrollable" 
        sx={{ display: { xs: 'flex', lg: 'none' }, maxWidth: '11rem' }}
      >
        {menuItem.map((menu, index) => (
          <Tab key={index} sx={{ minWidth: '7rem' }}
            label={
              <Link color='white' className="flex gap-2.5 items-center" to={menu.link}>
                {menu.icon}
                {menu.text}
              </Link>
            }
          />
        ))}
      </Tabs>

      {isLoggedIn ? profile : login}
    </Box>
  )
}

function MobileMenu({ menuItem, profileMenu, isLoggedIn=true, avatarProps }) {
  const [isOpen, setisOpen] = useState(null)
  const navigate = useNavigate()

  function toogleDrawer(open) {
    setisOpen(open)
  }

  function NavMenu() {
    return (
      <List disablePadding>
        {menuItem.map((menu, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => { menu.onClick(); toogleDrawer(false); }}>
              <ListItemIcon>
                {menu.icon}
              </ListItemIcon>
              <ListItemText primary={menu.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    )
  }

  function ProfileMenu() {
    return (
      <>
        <Box className="h-35 w-70 relative">
          {avatarProps.src && (
            <img {...avatarProps} className="w-full h-full object-cover"/>
          )}
          <Box 
            className="absolute w-fit px-4 py-2 bottom-0 text-white rounded-tr-md flex gap-3" 
            sx={{ bgcolor: 'primary.main' }}>
            <AccountCircle />
            <Typography>{avatarProps.alt}</Typography>
          </Box>
        </Box>

        <List disablePadding>
          {profileMenu.map((menu, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => { menu.onClick(); toogleDrawer(false); }}>
                <ListItemIcon>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    )
  }

  function LoginMenu() {
    return (
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/auth/login')}>
            <ListItemIcon>
              <Login />
            </ListItemIcon>
            <ListItemText primary={'Masuk'} />
          </ListItemButton>
        </ListItem>
      </List>
    )
  }

  return (
    <Box className="block md:hidden">
      <IconButton color="inherit" onClick={() => toogleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer 
        anchor={'left'} open={Boolean(isOpen)} 
        onClose={() => toogleDrawer(false)} onOpen={() => toogleDrawer(true)}
      >
        <Box className="p-2.5" sx={{ textTransform: 'none' }} onClick={() => toogleDrawer(false)}>
          <Logo />
        </Box>
        { isLoggedIn ? <ProfileMenu /> : <LoginMenu />}
        <Divider />
        <NavMenu />
      </SwipeableDrawer>
    </Box>
  )
}
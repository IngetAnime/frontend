import { 
  Box, Avatar, Typography, IconButton, Menu, MenuItem, Divider, ListItemIcon, AppBar, Toolbar, InputBase, CssBaseline,
  useScrollTrigger, Slide, List, ListItem, ListItemButton, ListItemText, Tooltip, SwipeableDrawer
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles"
import { 
  Logout, Settings, Login, Menu as MenuIcon, Search as SearchIcon, DateRange, Explore, AccountCircle,
} from "@mui/icons-material";
import Link from "./Link";
import { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { AppContext } from "../context/AppContext";
import underDevelopment from "../helper/underDevelopment";
import ButtonLink from "./ButtonLink";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import Logo from "./Logo";

export default function Header() {
  const { isLoggedIn } = useContext(AppContext);
  const menuItem = [
    {
      text: 'Timeline',
      icon: <DateRange />,
      onClick: underDevelopment,
    },
    {
      text: 'Eksplorasi',
      icon: <Explore />,
      onClick: underDevelopment,
    },
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
      onClick: underDevelopment,
    },
  ]

  return (
    <>
      <HideOnScroll> 
        <AppBar> {/* Make nav static */}
          <Toolbar className="flex gap-5"> {/* Basic styling for nav */}
            <MobileMenu menuItem={menuItem} profileMenu={profileMenu} />
            <Logo color="white" className="hidden sm:flex"/>
            <AnimeSearch />
            <Box className="flex-1 hidden sm:block" />
            <DekstopMenu menuItem={menuItem} profileMenu={profileMenu} isLoggedIn={isLoggedIn} />
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

function AnimeSearch() {
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    // marginRight: theme.spacing(2),
    // marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
    //   marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  function handleSearch(e) {
    if (e.key === 'Enter') {
      underDevelopment(e);
    }
  }
  return (
    <Search onKeyDown={(e) => handleSearch(e)}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase sx={{ width: '100%' }}
        placeholder="Cari judul anime…"
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
  )
}

function DekstopMenu({ menuItem, profileMenu, isLoggedIn=false }) {
  const [anchorEl, setAnchorEl] = useState(null)

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleCloseMenu() {
    setAnchorEl(null)
  }

  return (
    <Box className="hidden sm:flex gap-5">
      {/* Navigation */}
      <List className="flex gap-2.5">
        {menuItem.map((menu, index) => (
          <ListItem key={index}>
            <Link color='white' className="flex gap-2.5 items-center">
              {menu.icon}
              {menu.text}
            </Link>
          </ListItem>
        ))}
      </List>

      {/* Profile */}
      <Box className={`${isLoggedIn ? 'flex' : 'hidden'}`}>
        <Tooltip title="Buka pengaturan">
          <IconButton size="medium" onClick={handleOpenMenu} color="inherit">
            <Avatar src="/images/logo.jpg" sx={{ width: 35, height: 35 }} />
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
            <Avatar src="/images/logo.jpg" /> asdcode123
          </MenuItem>
          <Divider />
          {profileMenu.map((menu, index) => (
            <MenuItem key={index} onClick={() => { menu.onClick(); handleCloseMenu() }}>
              <ListItemIcon>
                {menu.icon}
              </ListItemIcon>
              {menu.text}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Login button */}
      <ButtonLink variant="contained" 
        endIcon={<Login />} 
        sx={{ 
          display: isLoggedIn ? 'none' : 'flex',
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
    </Box>
  )
}

function MobileMenu({ menuItem, profileMenu }) {
  const [isOpen, setisOpen] = useState(null)

  function toogleDrawer(open) {
    setisOpen(open)
  }

  function NavMenu() {
    return (

      <List disablePadding>
        {menuItem.map((menu, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
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
          <img src="/images/bg.jpg" alt="" className="w-full h-full object-cover"/>
          <Box 
            className="absolute w-fit px-4 py-2 bottom-0 text-white rounded-tr-md flex gap-3" 
            sx={{ bgcolor: 'primary.main' }}>
            <AccountCircle />
            <Typography>asdcode123</Typography>
          </Box>
        </Box>

        <List disablePadding>
          {profileMenu.map((menu, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
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

  return (
    <Box className="block sm:hidden">
      <IconButton color="inherit" onClick={() => toogleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer 
        anchor={'left'} open={Boolean(isOpen)} 
        onClose={() => toogleDrawer(false)} onOpen={() => toogleDrawer(true)}
      >
        <ProfileMenu />
        <Divider />
        <NavMenu />
      </SwipeableDrawer>
    </Box>
  )
}
import { 
  Box, Avatar, Typography, IconButton, Menu, MenuItem, Divider, ListItemIcon, AppBar, Toolbar, InputBase, CssBaseline,
  useScrollTrigger, Container,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles"
import { 
  Logout, Settings, Login, Menu as MenuIcon, Search as SearchIcon,
  Inbox,
  Mail,
  DateRange,
  Explore,
  AccountCircle,
} from "@mui/icons-material";
import Link from "./Link";
import { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { AppContext } from "../context/AppContext";
import underDevelopment from "../helper/underDevelopment";
import ButtonLink from "./ButtonLink";
import { toast } from "react-toastify";
import { Link as RouterLink, useNavigate } from "react-router-dom"

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
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

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const {isLoggedIn, setIsLoggedIn, userData } = useContext(AppContext)

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      underDevelopment(e);
    }
  }

  const handleSetting = () => {
    handleMenuClose()
    underDevelopment()
  }

  const handleLogout = () => {
    handleMenuClose();
    toast.success(`Matane, ${userData.username}-san`)
    setIsLoggedIn(false)
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
      onClick: handleSetting,
    },
    {
      text: 'Keluar',
      icon: <Logout />,
      onClick: handleLogout,
    },
  ]

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <MobileMenu 
              menuItem={menuItem} profileMenu={profileMenu} userData={userData} isLoggedIn={isLoggedIn}
            />

            {/* IngetAnime logo */}
            <Link 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                gap: 1, width: 'fit-content' 
              }} 
              color="standard" underline="none" to={'/'}
            >
              <Avatar src="/images/logo.jpg" />
              <Typography variant={'h1'}>IngetAnime!</Typography>
            </Link>

            {/* Search anime */}
            <Search onKeyDown={(e) => handleSearch(e)}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Cari judul anime…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            <Box sx={{ display: {xs: 'none', md: 'block'}, flexGrow: 1 }} />

            <DekstopMenu 
              menuItem={menuItem} profileMenu={profileMenu} userData={userData} isLoggedIn={isLoggedIn}
              // handleMenuClose={handleMenuClose} setAnchorEl={setAnchorEl} anchorEl={anchorEl} isMenuOpen={isMenuOpen} 
            />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
        
  );
}

function MobileMenu({ menuItem, profileMenu, userData, isLoggedIn }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      {/* Profile menu */}
      <div data-active={isLoggedIn} className="hidden data-[active=true]:block">
        <div className="overflow-hidden relative w-full h-35" onClick={(e) => e.stopPropagation()}>
          <img src="/images/bg.jpg" alt="" className="w-full h-full object-cover"/>
          <ListItem sx={{ 
            width: 'fit-content', px: 2, py: 1, position: 'absolute', bgcolor: '#FFF', bottom: 0, borderTopRightRadius: '1rem' 
          }}>
            <ListItemIcon>
              <AccountCircle color="textSecondary"/>
            </ListItemIcon>
            <ListItemText primary={userData.username} />
          </ListItem>
        </div>

        <List>
          {profileMenu.map((menu, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={menu.onClick}>
                <ListItemIcon>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>

      {/* Login button */}
      <div data-active={isLoggedIn} className="block data-[active=true]:hidden">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/')}>
              <ListItemIcon>
                <Avatar src="/images/logo.jpg" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant={'h1'}>IngetAnime!</Typography>} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/auth/login')}>
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary={'Masuk'} />
            </ListItemButton>
          </ListItem>
        </List>
      </div>

      <Divider />
      
      {/* Navigation */}
      <List>
        {menuItem.map((menu, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={(e) => menu.onClick(e)}>
              <ListItemIcon>
                {menu.icon}
              </ListItemIcon>
              <ListItemText primary={menu.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
  <div className="md:hidden">
    {/* Navigation icon */}
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="open drawer"
      sx={{ mr: 2 }}
      onClick={toggleDrawer(true)}
    >
      <MenuIcon />
    </IconButton>

    {/* Navigation menu */}
    <Drawer open={open} onClose={toggleDrawer(false)}>
      {DrawerList}
    </Drawer>
  </div>
  )
}

function DekstopMenu({ menuItem, profileMenu, userData, isLoggedIn }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
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
      <MenuItem>
        <Avatar src="/images/logo.jpg" /> {userData?.username || ''}
      </MenuItem>
      <Divider />
      {profileMenu.map((menu, index) => (
        <MenuItem key={index} onClick={menu.onClick}>
          <ListItemIcon>
            {menu.icon}
          </ListItemIcon>
          {menu.text}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <div className="hidden md:flex gap-10 items-center">
      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: '2rem' }}>
        {menuItem.map((menu, index) => (
          <ButtonLink key={index} 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              gap: 1, width: 'fit-content', textTransform: 'none'
            }} 
            color="standard" to={'/'} size="large" onClick={menu.onClick}
          >
            {menu.icon}
            {menu.text}
          </ButtonLink>
        ))}
      </Box>

      {/* Profile menu */}
      <div data-active={isLoggedIn} className="hidden data-[active=true]:block">
        <Box display={'flex'}>
          <IconButton
            size="medium"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
          >
            <Avatar src="/images/logo.jpg" sx={{ width: 35, height: 35 }} />
          </IconButton>
        </Box>
      </div>
      {renderMenu}
      
      {/* Login button */}
      <div data-active={isLoggedIn} className="block data-[active=true]:hidden">
        <ButtonLink variant="contained" 
          endIcon={<Login />} 
          sx={{ 
            backgroundColor: 'white',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
          to={'/auth/login'} 
        >
          <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>Masuk</Box>
        </ButtonLink>
      </div>

    </div>
  )
}

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


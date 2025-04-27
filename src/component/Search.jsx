import { styled, alpha } from "@mui/material/styles"
import underDevelopment from "../helper/underDevelopment";
import { InputBase } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function AnimeSearch({ isHeader=true }) {
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '100%',
    ...( isHeader &&
      {
        // [theme.breakpoints.up('md')]: {
        //   width: '12rem',
        // },
        [theme.breakpoints.up('lg')]: {
          width: 'auto',
        },
      }
    )
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
import { styled, alpha } from "@mui/material/styles"
import { InputBase } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAnimeListSchema } from "../validators/mal.validator";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function AnimeSearch({ isHeader=true }) {
  // Search form 

  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  const navigate = useNavigate();
  const { handleSubmit, getValues, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(getAnimeListSchema), mode: 'onChange', values: {
      q: q || ''
    }
  })

  useEffect(() => {
    if (errors.q) {
      toast.error(errors.q.message || "Input tidak valid");
    }
  }, [errors.q]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setValue('q', e.target.value);
      handleSubmit(onSubmit)();
    }
  }

  const onSubmit = async (req) => {
    navigate(`/?q=${encodeURIComponent(req.q)}`);
  }

  // Search component

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

  return (
    <Search onKeyDown={(e) => handleSearch(e)}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase sx={{ width: '100%' }}
        placeholder="Cari judul anime…"
        inputProps={{ 'aria-label': 'search' }}
        defaultValue={getValues('q')}
      />
    </Search>
  )
}
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormHelperText } from '@mui/material';

export default function PasswordField({ register, error, rootError, isSubmitting, label="Password" }) { 
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl fullWidth variant="outlined" error={Boolean(error || rootError)} disabled={isSubmitting} >
      <InputLabel htmlFor={"outlined-adornment-password" + label}>{label}</InputLabel>
      <OutlinedInput
        required
        id={"outlined-adornment-password" + label}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? 'hide the password' : 'display the password'
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        autoComplete={ label === "Password" ? 'current-password' : 'new-password'}
        {...register}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
      {rootError && <FormHelperText>Password tidak cocok</FormHelperText>}
    </FormControl>
  )
}
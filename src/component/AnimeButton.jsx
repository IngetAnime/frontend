import { Typography } from "@mui/material";
import ButtonLink from "./ButtonLink";

export default function AnimeButton({ backgroundColor, sx, icon, content, to }) {
  backgroundColor = 
    backgroundColor === 'green' ? '#00BC7D' :
    backgroundColor === 'yellow' ? '#F0B100' :
    backgroundColor === 'blue' ? '#0092B8' :
    backgroundColor === 'read' ? '#FB2C36' :
    backgroundColor === 'gray' ? '#90A1B9' :
    '#00BC7D'

  return (
    <ButtonLink to={to} variant="contained" size="small" 
      sx={{ 
        backgroundColor, justifyContent: 'space-around', gap: '0.5rem', px: '0.5rem', 
        minWidth: 'unset', width: 'fit-content', height: 'fit-content',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&:focus': {
          boxShadow: 'none',
        },
        '&:active': {
          boxShadow: 'none',
        },
        ...sx, 
      }}
    >
      {icon}
      <Typography>{content}</Typography>
    </ButtonLink>
  )
}
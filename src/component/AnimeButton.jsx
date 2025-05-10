import { Typography } from "@mui/material";
import ButtonLink from "./ButtonLink";

export default function AnimeButton({ backgroundColor, sx, icon: Icon, content, to, onClick, title }) {
  backgroundColor = 
    backgroundColor === 'green' ? '#00BC7D' :
    backgroundColor === 'yellow' ? '#F0B100' :
    backgroundColor === 'blue' ? '#0092B8' :
    backgroundColor === 'read' ? '#FB2C36' :
    backgroundColor === 'gray' ? '#90A1B9' :
    '#00BC7D'

  return (
    <ButtonLink 
      to={to} variant="contained" size="small" onClick={onClick} { ...(title && { title: title })}
      {...(to ? { target: '_blank', rel: 'noopener' } : {})}
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
      {Icon && <Icon fontSize={'small'} />}
      {content && <Typography fontSize={'small'}>{content}</Typography>}
    </ButtonLink>
  )
}
import { 
  Box,
  Container,
  Divider,
} from "@mui/material";
import ButtonLink from "../component/ButtonLink";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import Timeline from "./anime/Timeline";
import Explore from "./anime/Explore";
import List from "./anime/List";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  return (
      <Container className="flex flex-wrap justify-between overflow-hidden" component={'main'}>
        <AnimeWrap to={'/anime/timeline'}>
          <Timeline isDashboard={'true'} />
        </AnimeWrap>
        <Divider orientation="vertical" flexItem />
        <AnimeWrap to={'/anime'}>
          <Explore isDashboard={'true'} />
        </AnimeWrap>
        <AnimeWrap to={'/anime/myliststatus'}>
          <List isDashboard={'true'} />
        </AnimeWrap>
      </Container>
  )
}

function AnimeWrap({ children, to }) {
  const navigate = useNavigate();
  return (
    <Box className="flex flex-col w-full md:max-w-[48%] pt-5">
      <Box className="max-h-[75vh] overflow-hidden">
        {children}
      </Box>
      <ButtonLink
        onClick={() => navigate(to)} 
        variant="contained" endIcon={<KeyboardDoubleArrowRight />} 
        sx={{ 
          width: 'fit-content', alignSelf: 'flex-end', my: '1rem'
        }}
      >
        Lebih banyak
      </ButtonLink>
    </Box>
  )
}
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Box, Typography } from '@mui/material';
import { useRef } from 'react';

export default function SlideNumber({ value, setValue, menu }) {
  const swiperRef = useRef(null);

  return (
    <Box className="w-full relative">
      <Swiper
        // freeMode
        centeredSlides={true}
        slidesPerView={5}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setValue(swiper.realIndex)}
      >
        {menu.map(((num, i) => (
          <SwiperSlide key={i} className='m-auto' onClick={() => {
            setValue(i);
            swiperRef.current?.slideTo(i, 250);
          }}>
            <Typography 
              color={ (i === value) && 'primary'} 
              fontWeight={ (i !== value) && 'light'} 
              fontSize={(i !== value) && 'small'}
              align='center'
            >
              {i}
            </Typography>
          </SwiperSlide>
        )))}
      </Swiper>
      <Box 
        className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-10"
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "0.25rem",
          backgroundColor: "white",
        }}
      >
        <Typography>&nbsp;</Typography>
      </Box>
    </Box>
  )
}
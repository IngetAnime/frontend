import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

export default function SlideNumber({ value, setValue, menu }) {
  // Move slide to value has been selected before
  useEffect(() => {
    const index = menu.findIndex(item => item.value === value);
    if (index !== -1 && swiperRef.current) {
      swiperRef.current.slideTo(index, 250);
    }
  }, [value]);
  
  const swiperRef = useRef(null);
  return (
    <Box className="w-full relative">
      <Swiper
        centeredSlides={true}
        slidesPerView={5}
        // initialSlide={menu.findIndex(item => item.value === value)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          const index = swiper.realIndex;
          // console.log(menu[index].value);
          setValue(menu[index].value)
        }}
      >
        {menu.map(((num, i) => (
          <SwiperSlide key={i} className='m-auto' onClick={() => {
            setValue(num.value);
            // console.log(num.value);
            swiperRef.current?.slideTo(i, 250);
          }}>
            <Typography 
              color={ (num.value === value) && 'primary'} 
              fontWeight={ (num.value !== value) && 'light'} 
              fontSize={(num.value !== value) && 'small'}
              align='center'
            >
              {num.text}
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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from "react";
import Slide from "react-slick";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function Slider({ children, slidesToShow=2 }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = children.length;

  return (
    <div className=" w-full">
      <Slide 
        dots={true} speed={300} slidesToShow={slidesToShow} slidesToScroll={1} infinite={false} initialSlide={2} 
        beforeChange={(oldIndex, newIndex) => setCurrentSlide(newIndex)}
        nextArrow={<NextArrow currentSlide={currentSlide} totalSlides={totalSlides} slidesToShow={slidesToShow}/>}  
        prevArrow={<PrevArrow currentSlide={currentSlide} />}
      >
        {children}
      </Slide>
    </div>
  );
}

const NextArrow = ({ onClick, currentSlide, totalSlides, slidesToShow=2 }) => {
  const isEnd = currentSlide >= totalSlides - slidesToShow;
  if (isEnd) return null;

  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: "white",
        color: "black",
        right: 0,
        top: 0,
        position: "absolute",
        transform: "translate(-75%, 25%)",
        zIndex: 2,
        boxShadow: 2,
        "&:hover": {
          backgroundColor: "grey.100",
        },
      }}
    >
      <ChevronRight />
    </IconButton>
  );
};

const PrevArrow = ({ onClick, currentSlide }) => {
  if (currentSlide === 0) return null;

  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: "white",
        color: "black",
        position: "absolute",
        left: 0,
        top: 0,
        transform: "translate(75%, 25%)",
        zIndex: 2,
        boxShadow: 2,
        "&:hover": {
          backgroundColor: "grey.100",
        },
      }}
    >
      
      <ChevronLeft />
    </IconButton>
  );
};
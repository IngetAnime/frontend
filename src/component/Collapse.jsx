import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"
import { Box, IconButton, Collapse as MuiCollapse } from "@mui/material"
import { useRef, useState, useEffect } from "react"

export default function Collapse({ children, collapsedSize=50 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef(null);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    setTimeout(() => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setShowButton(contentHeight > collapsedSize);
      }
    }, 500);
  }, [children, collapsedSize]);

  return (
    <Box className="flex flex-col">
      <MuiCollapse in={isOpen} collapsedSize={collapsedSize}>
        <div ref={contentRef}>
          {children}
        </div>
      </MuiCollapse>
      { showButton && (
        <IconButton size="small" className="w-fit self-end" onClick={handleOpen}>
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      )}
    </Box>
  )
}
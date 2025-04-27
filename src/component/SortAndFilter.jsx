import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Box, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

export default function SortAndFilter({ sortAndFilter }) {
  const [isOpen, setIsOpen] = useState(false)

  function handleOpen() {
    setIsOpen(!isOpen)
  }

  return (
    <Box className="flex flex-col">
      <Collapse in={isOpen} collapsedSize={45}>
        <Box className="flex flex-wrap gap-5 py-1.25">
          {sortAndFilter.map((menu, index) => (
            <InputSelect name={menu.name} menu={menu.menus} isMultiple={menu.isMultiple} key={index}/>
          ))}
        </Box>
      </Collapse>

      <IconButton size="small" className="w-fi  t self-end" onClick={handleOpen}>
        {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>
    </Box>
  )
}

export function InputSelect({ name, menu, isMultiple=true }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [sortType, setSortType] = useState(0);
  const [filterType, setFilterType] = useState(menu.map((menu, index) => index));

  const handleChangeSort = (event) => {
    setSortType(event.target.value);
  };

  const handleChangeFilter = (event) => {
    const {
      target: { value },
    } = event;
    setFilterType(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl size="small" fullWidth={isMobile} sx={{ minWidth: { xs: 'unset', sm: '10rem' } }}>
      <InputLabel id={name + menu[0].text}>{name}</InputLabel>
      <Select
        labelId={name + menu[0].text}
        id={name}
        value={isMultiple ? filterType : sortType}
        label={name}
        onChange={isMultiple ? handleChangeFilter : handleChangeSort}
        multiple={isMultiple}
      >
        {menu.map((filter, index) => (
          <MenuItem value={index} className="flex items-center" key={index}>{filter.text}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
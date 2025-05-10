import { Box, FormControl, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import Collapse from "./Collapse";
import { Controller } from "react-hook-form";

export default function SortAndFilter({ filterAndSort, control, disabled }) {
  return (
    <SelectWrapper>
      {filterAndSort.map((menu, index) => (
        <SelectField name={menu.name} id={menu.id} key={index} disabled={disabled}>
          <Controller
            render={({ field }) => (
              <Select { ...field }
                labelId={menu.id}
                id={menu.id}
                label={menu.name}
                multiple={false}
              >
                {menu.menus.map((item, index) => (
                  <MenuItem value={item.value || item.text} className="flex items-center" key={index}>
                    {item.text}
                  </MenuItem>
                ))}
              </Select>
            )}
            name={menu.id}  
            control={control}
          />
        </SelectField>
      ))}
    </SelectWrapper>
  )
}

function SelectWrapper({ children }) {
  return (
    <Collapse collapsedSize={50}>
      <Box className="flex flex-wrap gap-5 py-1.25">
        {/* {sortAndFilter.map((menu, index) => (
          <InputSelect name={menu.name} menu={menu.menus} isMultiple={menu.isMultiple} 
            key={index} handleChange={menu.handleChange}
          />
        ))} */}
        {children}
      </Box>
    </Collapse>
  )
}

function SelectField({ children, name, id, isMobile, disabled=false }) {
  const theme = useTheme()
  isMobile = isMobile || useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <FormControl size="small" fullWidth={isMobile} sx={{ minWidth: { xs: 'unset', sm: '10rem' } }} disabled={disabled}>
      <InputLabel id={id}>{name}</InputLabel>
      {children}
    </FormControl>
  )
}

export function InputSelect({ name, menu, isMultiple=true, sx, handleChange }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [sortType, setSortType] = useState(0);
  const [filterType, setFilterType] = useState(menu.map((menu, index) => index));

  const handleChangeSort = async (event) => {
    setSortType(event.target.value);
    handleChange(event.target.value);
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
    <FormControl size="small" fullWidth={isMobile} sx={{ minWidth: { xs: 'unset', sm: '10rem' }, ...sx }}>
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
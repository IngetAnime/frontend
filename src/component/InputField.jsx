import { FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";

export default function InputField({ menu, control }) {
  return menu.type === 'textField' ? (
    <TextField
      {...((menu.error) && {error: true, helperText: menu.error.message})}
      {...(menu.isDirty && {focused: true})}
      size="small"
      label={menu.name}
      id="outlined-start-adornment"
      type={menu.type && menu.type}
      fullWidth
      sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }}
      slotProps={ menu.endAdornment && {
        input: {
          endAdornment: <InputAdornment position="end">{menu.endAdornment}</InputAdornment>,
        },
      }}
      {...menu.register}
    />
  ) : menu.type === 'date' ? (
    <Controller 
      render={({ field }) => (
        <DatePicker label={menu.name} defaultValue={null} size="small"
          sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }}
          slotProps={{
            field: {
              clearable: true
            },
            textField: {
              error: menu.error,
              helperText: menu.error?.message
            }
          }}
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY-MM-DD'): null)}
        />
      )}
      name={menu.id}
      control={control}
    />
  ) : menu.type === 'dateTime' ? (
    <Controller 
      render={({ field }) => (
        <DateTimePicker label={menu.name} defaultValue={null} size="small"
          sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }}
          slotProps={{
            field: {
              clearable: true
            },
            textField: {
              size: 'small',
              error: menu.error,
              helperText: menu.error?.message
            }
          }}
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY-MM-DD'): null)}
        />
      )}
      name={menu.id}
      control={control}
    />
  ) : menu.type === 'fieldIcon' ? (
    <TextField
      {...((menu.error) && {error: true, helperText: menu.error.message})}
      {...(menu.isDirty && {focused: true})}
      size="small"
      label={menu.name}
      id="outlined-start-adornment"
      type={menu.type && menu.type}
      fullWidth
      sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }}
      slotProps={ menu.endAdornment && {
        input: {
          endAdornment: <InputAdornment position="end">{menu.endAdornment}</InputAdornment>,
        },
      }}
      {...menu.register}
    />
  ) : menu.type === 'select' ? (
      <Controller
        render={({ field }) => (
          <FormControl 
            size="small" fullWidth sx={{ width: { md: 'calc(50% - 0.4rem)' }, marginTop: '0.5rem' }} 
            error={Boolean(menu.error)}
            {...(menu.isDirty && {focused: true})}
          >
            <InputLabel id={menu.id}>{menu.name}</InputLabel>
            <Select { ...field }
              labelId={menu.id}
              id={menu.id}
              label={menu.name}
              multiple={false}
            >
              {menu.menus.map((item, index) => (
                <MenuItem value={item.value !== undefined ? item.value : item.text} className="flex items-center" key={index}>
                  {item.text}
                </MenuItem>
              ))}
            </Select>
            {menu.error && <FormHelperText>{menu.error.message}</FormHelperText>}
          </FormControl>
        )}
        name={menu.id}  
        control={control}
      />
  ) :
  (
    <></>
  )
}
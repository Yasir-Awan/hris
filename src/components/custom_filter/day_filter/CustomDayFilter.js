import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomDayFilter(props) {
  const [filterDay, setFilterDay] = useState(dayjs(''));

  const handleDayChange = (newValue) => {
    // console.log(filterDay)
    const formattedDate = newValue.format('MMM D, YYYY');
    setFilterDay(formattedDate);
    props.onChange(filterDay)
  };
    console.log(filterDay)

//   const formattedDate = filterDay.format('MMM D, YYYY');
//   console.log(formattedDate)

  return (
    <Stack spacing={1} sx={{ width: 300, mt: -1, mb: 1 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Day"
          value={filterDay}
          onChange={handleDayChange}
          renderInput={(params) => (
            <TextField
              {...params}
              value={filterDay}
              error={filterDay === null}
            />
          )}
        />
      </LocalizationProvider>
    </Stack>
  );
}

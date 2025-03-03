import { useState } from 'react';
import MuiTextField from '@mui/material/TextField';

export const TextField = () => {
  const [value, setValue] = useState('');

  return (
    <MuiTextField
      label="Enter vector"
      variant="outlined" // Options: "outlined", "filled", "standard"
      value={value}
      placeholder="001001"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

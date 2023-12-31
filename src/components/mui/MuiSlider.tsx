import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

export default function MuiSlider() {
  const [value, setValue] = React.useState<number>(30);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <Slider aria-label="Volume" value={value} onChange={handleChange} />
      </Stack>
    </Box>
  );
}
